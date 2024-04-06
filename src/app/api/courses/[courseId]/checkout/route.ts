import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs";
import { url } from "inspector";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0].emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const course = await prismadb?.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });
    const purchase = await prismadb.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });
    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }
    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title!,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];
    let stripeCustomre = await prismadb.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });
    if (!stripeCustomre) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });
      stripeCustomre = await prismadb.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }
    const seesion = await stripe.checkout.sessions.create({
      customer: stripeCustomre.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLICK_APP_URL}/courses/${course.id}?sucess=1`,
      cancel_url: `${process.env.NEXT_PUBLICK_APP_URL}/courses/${course.id}?canceled=1`,
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
    });
    return NextResponse.json({ url: seesion.url });
  } catch (err) {
    console.log("[COURSE_ID_CHECKOUT]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

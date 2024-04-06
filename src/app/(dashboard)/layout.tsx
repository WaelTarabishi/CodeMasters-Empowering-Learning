import Navbar from "./_components/navbar";
import Sidebar from "./_components/side-bar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full ">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px]">{children}</main>
    </div>
  );
};

export default DashboardLayout;

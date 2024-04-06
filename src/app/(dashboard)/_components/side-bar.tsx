import Link from "next/link";
import Logo from "./logo";
import SidebarRoutes from "./sidebar-routes";

const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <Link href={"/"}>
        <div className="p-5 flex flex-row items-center justify-start gap-x-2">
          <Logo />
          <span className=" font-semibold text-center text-gray-800">
            CodeMasters
          </span>
        </div>
      </Link>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};

export default Sidebar;

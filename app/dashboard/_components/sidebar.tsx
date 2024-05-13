
import { OrganizationSwitcher } from "@clerk/clerk-react";
import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
    return (
        <div className="h-full border-r sm:border-none flex flex-col overflow-y-auto shadow-sm">
        <div className="p-3 flex items-center">
          <Logo/>
        </div>
        <div className="flex flex-col w-full sm:border-r">
          <SidebarRoutes/>
        </div>
        <div className="w-full flex-1 flex flex-col justify-between sm:border-r">
            <div className="mt-auto w-full px-3 pb-5 sm:hidden">
                <OrganizationSwitcher/>
            </div>
        </div>
      </div>
      
    );
}
"use client"
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { IconType } from "react-icons/lib";

interface SidebarItemProps {
    icon: LucideIcon | IconType;
    label: string;
    href: string
};
export const SidebarItem = ({
    icon: Icon,
    label,
    href
}: SidebarItemProps
    ) => {
    const pathname = usePathname();
    const router = useRouter();

    // checking the active url
    const isActive = (pathname === "/" && href === "/") ||
                    pathname === href || pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
    }
    return (
       <button
       type="button"
       className={cn("flex items-center gap-x-2  text-sm font-[500] pl-6 transition-all hover:text-rose-600 hover:bg-rose-300/20", isActive && "text-rose-700 bg-rose-200/20 hover:bg-sky-200/20 hover:text-rose-700") }
       onClick={onClick}
       >
        <div className="flex items-center gap-x-2 py-4">
            <Icon
                size={22}
                className={cn( 
                    "text-slate-500",
                    isActive && "text-rose-700"
                )}
            />
            {label}
        </div>
        <div className={cn(
            "ml-auto opacity-0 border-2 border-rose-700 h-6 rounded transition-all",
            isActive && "opacity-100"
        )}/>
       </button>
       
    );
}

"use client";

import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import { RiRobot3Line } from "react-icons/ri";
import { FaGithub } from "react-icons/fa";
import { SidebarItem } from "./sidebar-item";


const routes = [
    {
        icon: FileIcon,
        label: "All Files",
        href: "/dashboard/file",
    },
    {
        icon: StarIcon,
        label: "Favorites",
        href: "/dashboard/favorites",
    },
    {
        icon: RiRobot3Line,
        label: "Ai Agent",
        href: "/dashboard/ai",
    },
    {
        icon: TrashIcon,
        label: "Trash",
        href: "/dashboard/trash",
    },
    {
        icon: FaGithub,
        label: "Github",
        href: "https://github.com/mcakyerima/full_stack_tender_download_system",
    }
]

export const SidebarRoutes = () => {
    return (
        <div className="flex flex-col w-full">
            {
                routes.map((route) => (
                    <SidebarItem
                        key={route.href}
                        icon={route.icon}
                        label={route.label}
                        href={route.href}
                    />
                ))
            }
        </div>
    )
}
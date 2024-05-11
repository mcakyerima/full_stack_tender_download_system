"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import { RiRobot3Fill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import Link from 'next/link';


export const SideNav = () => {
    const pathname = usePathname();
    return (  
            <div className="hidden relative sm:block  pt-4 md:w-[180px] border-r min-h-screen md:fixed lg:fixed xl:fixed">
            <div className="w-full  flex flex-col justify-center gap-2 ">
                <div className="w-full flex flex-col items-center gap-3  self-start">
                    <Button
                        variant={"link"}
                        className={clsx("flex mr-1 items-center gap-3 text-gray-600 hover:text-blue-500", {
                        "text-green-500": pathname.includes("/dashboard/files"),
                        })}
                    >
                        <FileIcon className={clsx("w-6 h-6", {
                        "text-green-500": pathname.includes("/dashboard/files"),
                        })}  />
                        <Link href="/dashboard/files">All Files</Link>
                    </Button>

                    <Button
                        variant={"link"}
                        className={clsx("flex items-center gap-3 text-gray-600 hover:text-blue-500", {
                        "text-cyan-500": pathname.includes("/dashboard/favorites"),
                        })}
                    >
                        <StarIcon className={clsx("w-6 h-6", {
                        "text-cyan-600": pathname.includes("/dashboard/favorites"),
                        })} />
                        <Link href="/dashboard/favorites">Favorites</Link>
                    </Button>

                
                    <Button
                        variant={"link"}
                        className={clsx("flex items-center gap-5 mr-4 text-gray-600 hover:text-red-500", {
                        "text-red-500": pathname.includes("/dashboard/trash"),
                        })}
                    >
                        <TrashIcon className={clsx("w-6 h-6", {
                        "text-red-500": pathname.includes("/dashboard/trash"),
                        })} />
                        <Link href="/dashboard/trash">Trash</Link>
                    </Button>

                    <Button
                        variant={"link"}
                        className={clsx("flex ml-3 items-center gap-5 mr-4 text-gray-600 hover:text-red-500", {
                        "text-cyan-700": pathname.includes("/dashboard/ai"),
                        })}
                    >
                        <RiRobot3Fill className={clsx("w-6 h-6", {
                        "text-cyan-700": pathname.includes("/dashboard/ai"),
                        })} />
                        <Link href="/dashboard/ai">Ai agent</Link>
                    </Button>

                    <Button
                        variant={"link"}
                        className="flex-1 mt-auto botton-0 items-center gap-4 mr-5 text-gray-600 hover:text-red-500"
                    >
                        <FaGithub className="w-6 h-6 text-gray-900" />
                        <Link href="https://github.com/mcakyerima/full_stack_tender_download_system">Repo</Link>
                    </Button>
                </div>
            </div>
            </div>
    )
}

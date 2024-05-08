import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Trash2Icon, MoreVertical } from "lucide-react";
import FileDeleteDialog from './file-delete-dialog';
import { Doc } from '@/convex/_generated/dataModel';

interface FileCardActionsProps {
    file: Doc<"files">
}

export const FileCardActions = ({
    file
}: FileCardActionsProps) => {
    const [isConfirmedOpen, setIsConfirmedOpen] = useState(false);

    return (
        <>
            <FileDeleteDialog file={file} isOpen={isConfirmedOpen} setIsOpen={setIsConfirmedOpen} />
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setIsConfirmedOpen(true)} className="flex gap-1 items-center cursor-pointer text-red-500">
                        <Trash2Icon size={20} /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};


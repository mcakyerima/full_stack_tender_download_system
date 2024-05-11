import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Trash2Icon, MoreVertical, StarIcon } from "lucide-react";
import FileDeleteDialog from './file-delete-dialog';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Protect } from '@clerk/clerk-react';

interface FileCardActionsProps {
    file: Doc<"files">
    isFavorited: boolean
}

export const FileCardActions = ({
    file,
    isFavorited,
}: FileCardActionsProps) => {
    const [isConfirmedOpen, setIsConfirmedOpen] = useState(false);
    const setFavorite = useMutation(api.files.setFavorite);

    const handleFavorite = async (file_id: Id<"files">) => {
        console.log({file_id});
        try {
            await setFavorite({
                fileId: file_id
            });
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            <FileDeleteDialog file={file} isOpen={isConfirmedOpen} setIsOpen={setIsConfirmedOpen} />
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleFavorite(file._id)} className="flex gap-1 items-center cursor-pointer text-green-500">
                        {
                            isFavorited ? (
                                <span className='flex items-center gap-1'>
                                    <StarIcon size={20} fill='green' /> Unfavorite
                                </span>
                            ): (
                                <span className='flex items-center gap-1'>
                                    <StarIcon size={20} /> Favorite
                                </span>
                            )
                        }
                    </DropdownMenuItem>
                    <Protect
                        role='org:admin'
                        fallback={<></>}
                        >
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => setIsConfirmedOpen(true)} className="flex gap-1 items-center cursor-pointer text-red-500">
                            <Trash2Icon size={20} /> Delete
                        </DropdownMenuItem>
                    </Protect>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};


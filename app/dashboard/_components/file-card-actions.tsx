
import React, { useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Protect } from "@clerk/clerk-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2Icon, MoreVertical, StarIcon, RotateCw, Download } from "lucide-react";
import FileDeleteDialog from "@/components/file-delete-dialog";

interface FileCardActionsProps {
  file: Doc<"files">;
  isFavorited: boolean;
  url: any
}

export const FileCardActions = ({
  file,
  isFavorited,
  url
}: FileCardActionsProps) => {
  const [isConfirmedOpen, setIsConfirmedOpen] = useState(false);
  const setFavorite = useMutation(api.files.setFavorite);
  const restoreFile = useMutation(api.files.restoreFile);

  // Handle donwload
  const handleDownload = () => {
    window.open(url, "_blank");
  };

  const handleFavorite = async (file_id: Id<"files">) => {
    try {
      await setFavorite({
        fileId: file_id,
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <FileDeleteDialog
        file={file}
        isOpen={isConfirmedOpen}
        setIsOpen={setIsConfirmedOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent> 
          {!file.shouldDelete && (
            <>
            <DropdownMenuItem
            onClick={handleDownload}
          >
              <span className="flex items-center gap-[6px] cursor-pointer text-green-500">
                <Download size={20} /> Download
              </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleFavorite(file._id)}
                className="flex gap-[6px] items-center cursor-pointer text-green-500"
              >
                {isFavorited ? (
                  <span className="flex items-center gap-1">
                    <StarIcon size={20} fill="green" /> Unfavorite
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <StarIcon size={20} /> Favorite
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>

          )}
          <Protect role="org:admin" fallback={<></>}>
            <DropdownMenuItem
              onClick={() =>{
                if (file.shouldDelete) {
                  restoreFile({
                    fileId: file._id
                  })
                } else {
                   setIsConfirmedOpen(true)}
                }
              }
              className="flex gap-1 items-center cursor-pointer"
            >
              { file.shouldDelete ?  
                <div className="flex gap-[6px] text-green-500">
                  <RotateCw size={20} />
                  <span>Restore</span> 
                </div> : 
                <div className="flex gap-[6px] text-red-500">
                  <Trash2Icon size={20} />
                  <span>Delete</span>
                </div>
              }
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useToast } from '@/components/ui/use-toast';
import { ConvexError } from 'convex/values';

interface FileDeleteDialogProps {
    file: Doc<"files">;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const FileDeleteDialog: React.FC<FileDeleteDialogProps> = ({ file, isOpen, setIsOpen }) => {
    // show a toast after the file is deleted
    const { toast } = useToast();
    const handleDelete = async () => {
        try {
            await deleteFile({
                fileId: file._id
            });
            toast({
                variant: "success",
                title: "File marked for deletion",
                description: "Your file is now in the recycle bin and will be deleted soon!",
            });
        } catch (error) {
            if (error instanceof ConvexError){
                toast({
                    variant: "destructive",
                    title: "Failed to delete file",
                    description: error.data,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Failed to delete file",
                    description: "An error occurred while deleting the file.",
                });
            }
        }
        
    }
    // use the convex deleteFile mutation to delete the file
    const deleteFile = useMutation(api.files.deleteFile);
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will mark your file for deletion, files are deleted periodically.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => handleDelete()}
                    >Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default FileDeleteDialog;

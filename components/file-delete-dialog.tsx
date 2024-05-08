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
                title: "File deleted successfully",
                description: "Your file is now in the recycle bin",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to delete file",
                description: "An error occurred while deleting the file. Please try again later."
            });
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
                        This action will delete your data and add it to the recycle bin.
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

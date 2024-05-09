"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// FORMS IMPORT 
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { FormSchema } from "@/schemas";
import { FileMimeTypes } from "@/convex-types/mime-types";




import { IoMdClose } from "react-icons/io";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

  
  export const Modal = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
    // Function to handle click outside the modal body
    function handleOutsideClick(e: React.MouseEvent<HTMLDivElement>) {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }
    // donst show modal if isVisible is false
    if (!isVisible) {
        return null;
    }    

  const { toast } = useToast()
  // generating upload url
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  // 1. Define your form.
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      file: undefined,
      deadline: undefined,
      description: "",
    },
  });

  const fileRef = form.register("file")

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values);
    console.log(values.file);
      // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();

    // get file type from value
    const fileType = values.file[0].type;

     // Step 2: POST the file to the URL
     const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": fileType },
      body: values?.file[0],
    });

    let deadline = values.deadline.toISOString()
    // get a storage id
    const { storageId } = await result.json();

    try {
      await createFile({
        name: values.title,
        type: FileMimeTypes[fileType],
        description: values.description,
        deadline: deadline,
        fileId: storageId,
        orgId,

      });
      
      form.reset();

      // close dialog
        onClose();

      toast({
        variant: "success",
        title: "File uploaded successfully",
        description: "Now everyone can view your file."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "Your files could not be uploaded, try again later!"
      })
    }
  }

  // adding data to convex
  const createFile = useMutation(api.files.createFile);
  
  // get individual organizations in clerks auth
  const organization = useOrganization();

  // get personal accounts in clerk auth
  const user = useUser();


  // user organization id or user id if not org
  let orgId: string | any = null;
  if (organization.isLoaded && user.isLoaded) {
      orgId = organization.organization?.id ?? user.user?.id
      // console.log({OrgId: orgId});

    return (
        <div>
            <div id="modal_body"
                onClick={handleOutsideClick}
                className="fixed inset-0 z-50 bg-black/80 pointer-event-none flex items-center justify-center">
                <div className="relative w-[450px]">
                    <div className="absolute top-5 cursor-pointer right-4">
                    <IoMdClose onClick={onClose} />
                    </div>
                    <Card className="h-auto w-full">
                        <CardHeader>
                            <CardTitle>Upload your files here</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                control={form.control}
                                name="title"
                                render={({ field }: any) => (
                                    <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }: any) => (
                                    <FormItem>
                                    <FormLabel>Tender description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                        placeholder="Enter tender description"
                                        className="resize-none"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <div className="w-full flex flex-col space-y-3 sm:flex-row lg:flex-row xl:flex-row items-center gap-[12px] relative">
                                <FormField
                                control={form.control}
                                name="file"
                                render={() => (
                                    <FormItem className="w-full sm:w-[50%]">
                                    <FormLabel>File</FormLabel>
                                    <FormControl className="h-9">
                                        <Input type="file" {...fileRef}/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="deadline"
                                render={({ field }: string | any) => (
                                    <FormItem className="flex w-full sm:w-[50%] flex-col">
                                    <FormLabel>Tender deadline</FormLabel>
                                    <Popover asChild>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "z-30 w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                            date < new Date(new Date().setHours(0,0,0,0))
                                            }
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />

                                </div>
                                <Button
                                type="submit"
                                className="w-full"
                                disabled={form.formState.isSubmitting}
                                >
                                {form.formState.isSubmitting
                                ?
                                    <Loader2 className="mr-2 animate-spin"/>
                                : 
                                "Submit"
                                }
                                </Button>
                            </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
}

export default Modal;
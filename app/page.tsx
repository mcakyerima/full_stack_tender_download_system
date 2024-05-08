"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { SignInButton, SignOutButton, SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// FORMS IMPORT 
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
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
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Tender title must be at least 2 characters.",
  }),
  file: z.instanceof(FileList),
  deadline: z.date(), // Define deadline as a string
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(160, {
      message: "Description must not be longer than 160 characters.",
    }),
})

export default function Home() {

  const { toast } = useToast()
  // generating upload url
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)


  // FORMS
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
      deadline: ""
    },
  });

  const fileRef = form.register("file")
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    console.log(values.file);
      // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();

     // Step 2: POST the file to the URL
     const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0].type },
      body: values?.file[0],
    });

    let deadline = values.deadline.toISOString()
    // get a storage id
    const { storageId } = await result.json();

    try {
      await createFile({
        name: values.title,
        description: values.description,
        deadline: deadline,
        fileId: storageId,
        orgId,

      });
      
      form.reset();

      // close dialog
      setIsFileDialogOpen(false);

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
  }

  const [isFileDialogOpen, setIsFileDialogOpen ] = useState(false);

  // retrieving data from convex
  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId} : "skip");
   
  return (
    <main className="container mx-auto pt-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Your Files</h1>
        <Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => {
            setIsFileDialogOpen(isOpen);
            form.reset();
        }}>
          <DialogTrigger asChild >
            <Button>
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-5">Upload your files here</DialogTitle>
              <DialogDescription>
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
                    <div className="w-full flex items-center gap-[12px] relative">
                    <FormField
                      className="w-[45%] self-start"
                      control={form.control}
                      name="file"
                      render={() => (
                        <FormItem className="w-[45%] self-start">
                          <FormLabel>File</FormLabel>
                          <FormControl className="h-9">
                            <Input type="file" {...fileRef}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      className="w-[40%] self-end mr-0"
                      control={form.control}
                      name="deadline"
                      render={({ field }: string | any) => (
                        <FormItem className="flex flex-col w-[40%] self-end">
                          <FormLabel>Tender deadline</FormLabel>
                          <Popover asChild>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "z-30 w-[240px] pl-3 text-left font-normal",
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
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {files?.map((file) => (
        <div key={file._id}>{file.name}  {file.orgId}</div>
      ))}
  
    </main>
  );
}

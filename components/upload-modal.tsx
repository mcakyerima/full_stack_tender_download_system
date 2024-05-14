"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation} from "convex/react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { IoMdClose } from "react-icons/io";
import { Switch } from "@/components/ui/switch";

// FORMS IMPORT 
import { any, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { Loader2 } from "lucide-react";
import { FormSchema } from "@/schemas";
import { FileMimeTypes } from "@/convex-types/mime-types";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

  
  export const Modal = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
    const { toast } = useToast();
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const createFile = useMutation(api.files.createFile);
    const organization = useOrganization();
    const user = useUser();
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        title: "",
        file: any,
        deadline: undefined,
        description: "",
      },
    });

    // Function to handle click outside the modal body
    function handleOutsideClick(e: React.MouseEvent<HTMLDivElement>) {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }

    if (!isVisible) {
      return null;
    }
  
    let orgId: string | any = null;
    if (organization.isLoaded && user.isLoaded) {
      orgId = organization.organization?.id ?? user.user?.id;
    }

  const fileRef = form.register("file")

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log({values});
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
        isPublic: values.isPublic,
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
                                    <Popover>
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
                              <FormField
                                control={form.control}
                                name="isPublic"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                      <FormLabel>Set tender as public</FormLabel>
                                      <FormDescription>
                                        Enyone can view your Tender.
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
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
export default Modal;
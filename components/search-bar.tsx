"use client";

import { z } from 'zod';
import { SearchSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from './ui/input';
import { Loader2, SearchIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";



async function onSubmit(values: z.infer<typeof SearchSchema>) {
    console.log(values);
}

export const SearchBar = () => {

    const form = useForm<z.infer<typeof SearchSchema>>({
        resolver: zodResolver(SearchSchema),
        defaultValues: {
          query: ""
        },
      });

    return (
        <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="query"
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
                    <Button
                     type="submit"
                     disabled={form.formState.isSubmitting}
                     >
                      {form.formState.isSubmitting
                      ?
                        <Loader2 className="mr-2 animate-spin"/>
                      : 
                        <SearchIcon/>
                      }
                    </Button>
                  </form>
                </Form>
    )
}
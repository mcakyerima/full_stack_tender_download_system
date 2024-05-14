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
import { Dispatch, SetStateAction } from 'react';




export const SearchBar = ({
   query,
   setQuery
  }: { query: string, setQuery: Dispatch<SetStateAction<string>>}) => {

    const form = useForm<z.infer<typeof SearchSchema>>({
        resolver: zodResolver(SearchSchema),
        defaultValues: {
          query: ""
        },
      });

    // handling submit
    const onSubmit = async (data: z.infer<typeof SearchSchema>) => {
        setQuery(data.query);
    };

    return (
        <div>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-between">
                    <div className='relative w-full'>
                        <div className="h-[42px]">
                            <FormField
                                control={form.control}
                                name="query"
                                render={({ field }: any) => (
                                    <FormControl>
                                        <div className="relative h-full">
                                            <Input
                                                placeholder='Search files'
                                                className="w-full h-full  px-4 focus:outline-none focus:border-transparent flex items-center rounded-full  shadow-sm border"
                                                {...field}
                                            />
                                            <Button
                                                type="submit"
                                                disabled={form.formState.isSubmitting}
                                                className="top-[2px] right-0 absolute rounded-full w-[39px] h-[38px] mr-1 p-0 focus:outline-none"
                                            >
                                                {form.formState.isSubmitting ? (
                                                    <Loader2 className="animate-spin" />
                                                ) : (
                                                    <SearchIcon size={20} />
                                                )}
                                            </Button>
                                        </div>
                                </FormControl>
                                )}
                            />
                            
                        </div>
                    </div>
                </form>
            </Form>
        </div>
  
    )
}
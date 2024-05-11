import * as z from 'zod';

export const FormSchema = z.object({
    title: z.string().min(2, {
      message: "Tender title must be at least 2 characters.",
    }),
    file: typeof FileList !== 'undefined' ? z.instanceof(FileList) : z.any(),
    deadline: z.date(),
    description: z
      .string()
      .min(10, {
        message: "Description must be at least 10 characters.",
      })
      .max(160, {
        message: "Description must not be longer than 160 characters.",
      }),
  })

  export const SearchSchema = z.object({
    query: z.string().min(0, {
      message: "Search query must be at least 2 characters.",
    }),
  })
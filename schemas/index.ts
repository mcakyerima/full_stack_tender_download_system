import * as z from 'zod';

export const FormSchema = z.object({
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
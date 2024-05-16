import { Doc } from "@/convex/_generated/dataModel";

// MIME types for file types
export const FileMimeTypes = {
  'image/jpeg': 'image',
  'image/png': 'image',
  'application/pdf': 'pdf',
  'text/csv': 'csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xls',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'doc'
} as Record<string, Doc<"files">["type"]>;




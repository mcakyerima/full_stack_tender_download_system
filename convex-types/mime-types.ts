import { Doc } from "@/convex/_generated/dataModel";
import { FcImageFile } from "react-icons/fc";
import { FaFilePdf } from "react-icons/fa";
import { FaFileCsv } from "react-icons/fa6";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import { PiMicrosoftWordLogoFill } from "react-icons/pi";
import { ReactNode } from "react";

// MIME types for file types
export const FileMimeTypes = {
  'image/jpeg': 'image',
  'image/png': 'image',
  'application/pdf': 'pdf',
  'text/csv': 'csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xls',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'doc'
} as Record<string, Doc<"files">["type"]>;




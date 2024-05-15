"use client";

import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ReactNode } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { calculateRemainingDays } from "@/lib/date-utils";
import { FileCardActions } from "./file-card-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BsFilePdf } from "react-icons/bs";
import { FaFileCsv } from "react-icons/fa6";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import { PiMicrosoftWordLogoFill } from "react-icons/pi";
import { Image } from "lucide-react";

export default function FileCard({
  file,
  favorites,
}: {
  file: Doc<"files">;
  favorites: Doc<"favorites">[];
}) {
  const fileUrl: any = useQuery(api.files.imageUrl, { fileId: file.fileId });

  const [remainingDays, setRemainingDays] = useState<number | null>(null);

  const headerIconTypes = {
    image: <Image size={25} />,
    pdf: <BsFilePdf size={25} color="rose" />,
    csv: <FaFileCsv size={25} />,
    xls: <PiMicrosoftExcelLogo size={25} />,
    doc: <PiMicrosoftWordLogoFill size={25} />,
  } as Record<Doc<"files">["type"], ReactNode>;

  
  const iconTypes = {
    image: <Image size={50} />,
    pdf: <BsFilePdf size={50} color="rose" />,
    csv: <FaFileCsv size={50} />,
    xls: <PiMicrosoftExcelLogo size={50} />,
    doc: <PiMicrosoftWordLogoFill size={50} />,
  } as Record<Doc<"files">["type"], ReactNode>;

  // favorite docs
  const isFavorited = favorites.some(
    (favorite) => favorite.fileId === file._id
  );

  useEffect(() => {
    const deadlineDate = new Date(file.deadline);
    const days = calculateRemainingDays(deadlineDate);
    setRemainingDays(days);
  }, [file.deadline]);

  const handleDownload = () => {
    window.open(fileUrl, "_blank");
  };

  return (
    <Card className="border rounded-md shadow-md relative">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {headerIconTypes[file.type]}
            {file.name}
          </div>
          <div className="absolute right-2 top-5">
            <FileCardActions isFavorited={isFavorited} file={file} />
          </div>
        </CardTitle>
        <CardDescription>{file.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="flex justify-center items-center overflow-hidden border rounded-md h-[120px] w-full shadow-inner inset-3"
          style={{
            backgroundImage: `url(${fileUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {file.type !== "image" && iconTypes[file.type]}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Deadline:{" "}
          {remainingDays !== null
            ? `in ${remainingDays} ${remainingDays > 1 ? "days" : "day"}`
            : "Unknown"}
        </p>
        <Button onClick={handleDownload}>Download</Button>
      </CardFooter>
    </Card>
  );
}

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { calculateRemainingDays } from "@/lib/date-utils";
import { FileCardActions } from "./file-card-actions";

export const FileCard = ({
  file
}: { file: Doc<"files"> }) => {
  const [remainingDays, setRemainingDays] = useState<number | null>(null);

  useEffect(() => {
    const deadlineDate = new Date(file.deadline);
    const days = calculateRemainingDays(deadlineDate);
    setRemainingDays(days);
  }, [file.deadline]);

  return (
    <Card className="border rounded-md shadow-md relative">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
            {file.name}
            <div className="absolute right-2 top-3">
                <FileCardActions file={file}/>
            </div>
        </CardTitle>
        <CardDescription>{file.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{file.orgId}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Deadline: {remainingDays !== null ? `in ${remainingDays} days` : "Unknown"}</p>
        <Button>Download</Button>
      </CardFooter>
    </Card>
  );
};

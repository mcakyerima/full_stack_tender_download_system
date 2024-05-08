"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { UploadDialog } from "@/components/upload-dialog";
import { FileCard } from "@/components/file-card";

export default function Home() {

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
  // retrieving data from convex
  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId} : "skip");
   
  return (
    <main className="container mx-auto pt-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold mb-8">Your Files</h1>
        <UploadDialog/>
      </div>
      <div className="grid grid-cols-4 gap-4 md:grid-cols-3 sm:grid-cols-1">
        {files?.map((file) => (
          <FileCard
            key={file._id}
            file={file}
          />
        ))}

      </div>
  
    </main>
  );
}

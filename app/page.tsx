"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useState } from 'react';
import { UploadDialog } from "@/components/upload-dialog";
import { FileCard } from "@/components/file-card";
import { EmptyFileVector } from "@/components/empty_file";
import { Loader2 } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { Modal } from "@/components/upload-modal";
import { Button } from "@/components/ui/button";

export default function Home() {
  // create a state for modal
  const [isModalOpen, setIsModalOpen ] = useState<boolean>(true);

  // function to handle modal trigger
  function handleUploadClick() {
    setIsModalOpen(true);
  }

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

  const isLoading = files === undefined;
   
  return (
    <main className="container mx-auto pt-12">
      {
        isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Loader2 className="sm:w-2 sm:h-2 lg:h-32 lg:w-32 md:w-10 md:h-10  animate-spin text-rose-700"/>
            <h1 className="text-2xl">Loading files...</h1>
          </div>
        )
      }
      {!isLoading && files.length === 0 && (
        <div className="flex flex-col items-center space-y-6">
          <EmptyFileVector/>
          <Button onClick={() => {
             handleUploadClick();
           }
          } >
              Upload File
            </Button>
        </div>
      )}

      { !isLoading && files.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Your Files</h1>
            <Button onClick={() => {
              handleUploadClick();
            }}>
              Upload File
            </Button>
           </div>
           <SearchBar/>
          <div className="grid lg:grid-cols-4 gap-4 md:grid-cols-2 sm:grid-cols-1 mt-5">
            {files?.map((file) => (
              <FileCard
                key={file._id}
                file={file}
              />
            ))}
          </div>
        </>
      )}
        <Modal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}

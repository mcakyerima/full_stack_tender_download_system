"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { SignInButton, SignOutButton, SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";


export default function Home() {
  // adding data to convex
  const createFile = useMutation(api.files.createFile);
  
  // get individual organizations in clerks auth
  const organization = useOrganization();

  // get personal accounts in clerk auth
  const user = useUser();


  // user organization id or user id if not org
  let orgId = null;
  if (organization.isLoaded && user.isLoaded) {
      orgId = organization.organization?.id ?? user.user?.id
      console.log({OrgId: orgId});
  }

  // retrieving data from convex
  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId} : "skip");


  const handleUpload = (name: string, orgId: string | any) => {
    if (!orgId) return;
    createFile({
      name: name,
      orgId: orgId,
    });
  }
   
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {files?.map((file) => (
        <div key={file._id}>{file.name}  {file.orgId}</div>
      ))}
  
      <Button onClick={() => handleUpload("Helo world", orgId)}>Upload</Button>
    </main>
  );
}

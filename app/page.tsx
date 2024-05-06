"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";


export default function Home() {
  // adding data to convex
  const createFile = useMutation(api.files.createFile);

  // retrieving data from convex
  const files = useQuery(api.files.getFiles);
   
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {files?.map((file) => (
        <div key={file._id}>{file.name}</div>
      ))}
      <SignedIn>
        <SignOutButton/>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal"/>
      </SignedOut>
      <Button>
        Hello world
      </Button>

      <Button onClick={() => {
        createFile({
          name: "mckaka",
        }
        );
      }}>Upload</Button>
    </main>
  );
}

"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
const FileCard = dynamic(
  () => import("@/app/dashboard/_components/file-card"),
  {
    ssr: false,
  }
);
// TABS
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// SELECT AND SORT
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EmptyFileVector } from "@/components/empty_file";
import { EmptyTrash } from "@/components/empty_trash";
import { LayoutGrid, List, Loader2, Upload } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { Modal } from "@/components/upload-modal";
import { Button } from "@/components/ui/button";
import { NoData } from "@/components/no-data";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Doc } from "@/convex/_generated/dataModel";

export default function FilesBrowser({
  title,
  favorites,
  isPublic,
  deleteOnly,
}: {
  title: string;
  favorites?: boolean;
  isPublic?:boolean;
  deleteOnly?:boolean
}) {

  // get the pathname so that if the pathname is /dashboard/trash, we can show the empty trash component
  const pathname = usePathname();
  // console.log({pathname});

  // create a state for modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // state for query
  const [query, setQuery] = useState<string>("");

  // setting valu for select component
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

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
    orgId = organization.organization?.id ?? user.user?.id;
    // console.log({OrgId: orgId});
  }

  // retrieving data from convex
  const files = useQuery(
    api.files.getFiles,
    orgId ? { 
              orgId, 
              query, 
              favorites, 
              isPublic, 
              deleteOnly, 
              type: type === "all" ? undefined : type,
             } 
            : "skip"
  );

  // get all favorites
  const allFavorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  // refactor i want isFavorited to return boolean for every file
  const modifiedFile = files?.map((file) => {
    const isFavorited = allFavorites?.some((favorite) => favorite.fileId === file._id);
    return { ...file, isFavorited };
  });

  // Loading state for files
  const isLoading = files === undefined;

  return (
    <main className="container mx-auto relative">
      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Loader2 className="sm:w-2 sm:h-2 lg:h-32 lg:w-32 md:w-10 md:h-10  animate-spin text-rose-700" />
          <h1 className="text-2xl">Loading files...</h1>
        </div>
      )}
      
      {!isLoading && (
        <>
          <div className="flex space-x-36 md:space-x-8  lg:space-x-28  items-center sticky z-30 top-[55px]  my-component pt-8 pb-3 shadow-sm">
            <h1 className="text-lg md:text-2xl lg:text-4xl font-bold">
              {title}
            </h1>
            <div className="hidden sm:block flex-1">
              <div className="flex-1">
                <SearchBar query={query} setQuery={setQuery} />
              </div>
            </div>
            <Button
                className="flex items-center gap-2"
                onClick={() => {
                  handleUploadClick();
                }}
              >
                <Upload height={18} width={18} className="mb-[1px]"/>
                Upload File
            </Button>
          </div>
          <div className="mt-3 sm:hidden">
                <SearchBar query={query} setQuery={setQuery} />
          </div>

          {/* Table toggler for goggling between grid view and table List view*/}
          <Tabs defaultValue="grid" className="mt-4  w-[380px] sm:w-full overflow-x-scroll sm:overflow-hidden">
            <div className="flex items-center justify-between sticky ">
              <TabsList>
                  <TabsTrigger value="grid" className="flex gap-1 items-cente">
                    <LayoutGrid size={22}/> Grid
                  </TabsTrigger>
                  <TabsTrigger value="table" className="flex gap-1 items-cent">
                    <List size={22}/> Table
                  </TabsTrigger>
              </TabsList>
              <div className="flex gap-1 items-center">
                <label htmlFor="type-select" className="text-sm hidden sm:block">Type filter</label>
                {/* "image" | "csv" | "pdf" | "doc" | "xls" */}
                <Select  defaultValue={type} onValueChange={(newType: any) => {
                    setType(newType as any);
                }}>
                  <SelectTrigger id="type-select" className="w-[180px]">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">Doc</SelectItem>
                    <SelectItem value="xls">xls</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              </div>
            <TabsContent value="grid">
              <div className="grid lg:grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1 my-5">
                  {modifiedFile?.map((file) => (
                    <FileCard
                      key={file._id}
                      file={file}
                    />
                  ))}
                </div>
            </TabsContent>
            <TabsContent value="table">
              <div className="mt-3 w-[400px] sm:w-full">
                <DataTable columns={columns} data={modifiedFile ?? []}/>
              </div>
            </TabsContent>
          </Tabs>
          {!isLoading && !query && (files === undefined || files.length === 0) && (
            <div className="flex flex-col items-center space-y-6 p-0 mb-4">
              {/* if the pathname is /dashboard/trash, show the empty trash components */}
              {pathname === "/dashboard/trash" ? (
                <EmptyTrash />
              ) : (
                <>
                   <EmptyFileVector />
                    <Button
                      className="flex items-center gap-2"
                      onClick={() => {
                        handleUploadClick();
                      }}
                    >
                      <Upload height={18} width={18} className="mb-[1px]"/>
                      Upload File
                    </Button>
                </>
              )}
             
            </div>
          )}
          {!isLoading && query && files.length === 0 && (
            <NoData />
          )}
        </>
      )}
      <Modal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}


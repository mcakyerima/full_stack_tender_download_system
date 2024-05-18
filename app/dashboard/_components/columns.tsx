"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { ColumnDef } from "@tanstack/react-table"
import { useQuery } from "convex/react"
import { formatRelative } from "date-fns"
import React from "react"
import { FileCardActions } from "./file-card-actions"

function UserCell({userId}: {userId: Id<"users">}): React.ReactElement{
  const userProfile = useQuery(api.users.getUserProfile, { userId })
  return (
    <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 border">
          <AvatarImage  src={userProfile?.image} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className="text-xs">{userProfile?.name}</p>
      </div>
  )
}

export const columns: ColumnDef<Doc<"files"> & { isFavorited: (boolean | undefined) }>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    header: "Uploaded On",
    cell: ({ row }) => {
      return (
        <div>
          {formatRelative(new Date(row.original._creationTime), new Date())}
        </div>
      )
    },
  },
  {
    header: "User",
    cell: ({ row }) => {
      return (
        <UserCell userId={row.original.userId} />
      )
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      const fileUrl: any = useQuery(api.files.imageUrl, { fileId: row.original.fileId });
      return (
        <FileCardActions
          file={row.original}
          url={fileUrl}
        />
      )
    },
  },
]
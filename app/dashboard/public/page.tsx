"use client";

import FilesBrowser from "@/app/dashboard/_components/file-browser";

export default function FilesPage() {
  return (
    <div>
      <FilesBrowser title="Public Tenders" isPublic={true}/>
    </div>
  );
}

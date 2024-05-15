"use client";
import FilesBrowser from "../_components/file-browser";

export default function Trash() {
  return (
    <div>
      <FilesBrowser title="Your Trash" deleteOnly={true} />
    </div>
  );
}

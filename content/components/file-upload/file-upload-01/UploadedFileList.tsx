import { cn } from "@/lib/utils";
import UploadedFileItem from "./UploadedFileItem";

interface UploadedFileListProps {
  uploadedFiles: File[];
  fileProgresses: Record<string, number>;
  removeFile: (filename: string) => void;
}

export default function UploadedFileList({
  uploadedFiles,
  fileProgresses,
  removeFile,
}: UploadedFileListProps) {
  if (uploadedFiles.length === 0) {
    return null; // Don't render anything if there are no files
  }

  return (
    <div className={cn("px-6 pb-5 space-y-3 mt-4")}>
      {uploadedFiles.map((file, index) => (
        <UploadedFileItem
          key={file.name + index} // Use index in key for potential duplicate names
          file={file}
          progress={fileProgresses[file.name] || 0}
          onRemove={removeFile}
        />
      ))}
    </div>
  );
}

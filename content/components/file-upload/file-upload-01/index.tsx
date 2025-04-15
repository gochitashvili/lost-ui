"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRef, useState } from "react";
import FileDropzone from "./FileDropzone";
import FileUploadFooter from "./FileUploadFooter";
import FileUploadHeader from "./FileUploadHeader";
import ProjectDetailsForm from "./ProjectDetailsForm";
import UploadedFileList from "./UploadedFileList";

export default function FileUpload01() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileProgresses, setFileProgresses] = useState<Record<string, number>>(
    {}
  );

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress for each file
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setFileProgresses((prev) => ({
          ...prev,
          [file.name]: Math.min(progress, 100),
        }));
      }, 300);
    });
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (filename: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== filename));
    setFileProgresses((prev) => {
      const newProgresses = { ...prev };
      delete newProgresses[filename];
      return newProgresses;
    });
  };

  return (
    <div className="flex items-center justify-center p-10">
      <Card className="w-full mx-auto max-w-lg bg-background rounded-lg p-0 shadow-md">
        <CardContent className="p-0">
          <FileUploadHeader />
          <ProjectDetailsForm />
          <FileDropzone
            fileInputRef={fileInputRef}
            handleBoxClick={handleBoxClick}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleFileSelect={handleFileSelect}
          />
          <UploadedFileList
            uploadedFiles={uploadedFiles}
            fileProgresses={fileProgresses}
            removeFile={removeFile}
          />
          <FileUploadFooter />
        </CardContent>
      </Card>
    </div>
  );
}

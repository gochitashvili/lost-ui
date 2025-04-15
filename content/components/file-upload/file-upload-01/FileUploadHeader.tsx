export default function FileUploadHeader() {
  return (
    <div className="p-6 pb-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-medium text-foreground">
            Create a new project
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop files to create a new project.
          </p>
        </div>
      </div>
    </div>
  );
}

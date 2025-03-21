import Image from "next/image";

const BLOCKS = [
  { title: "Account and User Management" },
  { title: "Badges" },
  { title: "Banners" },
  { title: "Bar Charts" },
  { title: "Billing and Usage" },
  { title: "Dialogs" },
  {
    title: "File Upload",
    description: "Upload files to your app",
    image: "/file-upload.webp",
  },
];

export default function Home() {
  return (
    <div className="w-full">
      <div className="mb-15">
        <h1 className="text-foreground mb-4 text-4xl/[1.1] font-bold tracking-tight md:text-5xl/[1.1]">
          Building Blocks for the Web
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Clean, modern building blocks. Copy and paste into your apps. Works
          with all React frameworks. Open Source. Free forever.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-10 w-full">
        {BLOCKS.map((block, index) => (
          <div key={index} className="space-y-2">
            <Image
              className="grayscale rounded-lg border border-border"
              src="/file-upload.webp"
              alt="blocks"
              width={1000}
              height={1000}
            />
            <div className="font-medium leading-none tracking-tight">
              {block.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

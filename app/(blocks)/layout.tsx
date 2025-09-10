import "@/app/globals.css";

import { Header } from "@/components/header";
import Navbar01 from "@/components/navbar-01";
import Script from "next/script";

export default function BlockLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-(--breakpoint-xl) flex-1 px-8">
          <div className="min-h-[calc(100%-2rem)] w-full pt-10 pb-20">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

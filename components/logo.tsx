import { cn } from "@/lib/utils";
import { ChartNoAxesGantt } from "lucide-react";
import Link from "next/link";

function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span className="bg-primary text-primary-foreground flex items-center justify-center rounded-md p-1.5">
        <ChartNoAxesGantt className="size-5" />
      </span>
      <span className="text-lg bloc font-medium text-primary">Lost</span>
    </Link>
  );
}

export default Logo;

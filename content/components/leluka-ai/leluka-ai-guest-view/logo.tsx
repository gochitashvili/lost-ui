import { cn } from "@/lib/utils";
import { ChartNoAxesGantt } from "lucide-react";
import Link from "next/link";

function LelukaAiLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <ChartNoAxesGantt className="size-5" />
      <span className="text-leluka-ai-foreground/80 -ml-1 text-lg font-medium">
        Leluka AI
      </span>
    </Link>
  );
}

export default LelukaAiLogo;

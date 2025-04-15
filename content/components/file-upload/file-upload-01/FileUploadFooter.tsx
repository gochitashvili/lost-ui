import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export default function FileUploadFooter() {
  // Add potential props here if needed, e.g., onCancel, onContinue
  return (
    <div className="px-6 py-3 border-t border-border bg-muted rounded-b-lg flex justify-between items-center">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              Need help?
            </Button>
          </TooltipTrigger>
          <TooltipContent className="py-3 bg-background text-foreground border">
            <div className="space-y-1">
              <p className="text-[13px] font-medium">Need assistance?</p>
              <p className="text-muted-foreground dark:text-muted-background text-xs max-w-[200px]">
                Upload project images by dragging and dropping files or using
                the file browser. Supported formats: JPG, PNG, SVG. Maximum file
                size: 4MB.
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex gap-2">
        <Button variant="outline" className="h-9 px-4 text-sm font-medium">
          Cancel
        </Button>
        <Button className="h-9 px-4 text-sm font-medium">Continue</Button>
      </div>
    </div>
  );
}

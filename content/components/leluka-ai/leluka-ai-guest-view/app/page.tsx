import { Button } from "../button";
import LelukaAiLogo from "../logo";

export default function LelukaAiGuestViewPage() {
  return (
    <div className="bg-leluka-ai-background flex h-full min-h-screen w-full flex-col justify-between">
      <div className="mx-auto flex w-full max-w-(--breakpoint-xl) items-center justify-between px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <LelukaAiLogo />
        <div>
          <Button variant="secondary" size="lg">
            Login
          </Button>
        </div>
      </div>
      <div className="flex h-full flex-1 flex-col justify-between">
        <div className="flex flex-1 items-center justify-center">
          content here
        </div>
        <div className="mx-auto flex w-full max-w-(--breakpoint-xl) items-center justify-center px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="text-muted-foreground text-center text-xs">
            <span>
              All rights reserved © {new Date().getFullYear()} Leluka AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

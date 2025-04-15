import { Label } from "@/components/ui/label";

export function Icon() {
  return (
    <Label htmlFor="workspace-name">
      Workspace <span className="text-destructive">*</span>
    </Label>
  );
}

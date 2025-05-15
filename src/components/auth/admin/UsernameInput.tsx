
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ControllerRenderProps } from "react-hook-form";

export interface UsernameInputProps {
  field: ControllerRenderProps<any, "username">;
}

export function UsernameInput({ field }: UsernameInputProps) {
  return (
    <div className="relative">
      <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      <Input
        placeholder="Enter your username"
        className="pl-10 h-12 border-muted/30 bg-white/50 backdrop-blur-sm"
        {...field}
      />
    </div>
  );
}

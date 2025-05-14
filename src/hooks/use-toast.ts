
import { toast as sonnerToast } from "sonner";

export function toast(props: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}) {
  const { title, description, variant } = props;
  
  if (variant === "destructive") {
    return sonnerToast.error(title, {
      description,
    });
  }
  
  return sonnerToast(title, {
    description,
  });
}

export function useToast() {
  return {
    toast,
  };
}

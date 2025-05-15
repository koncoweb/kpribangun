
import { Button } from "@/components/ui/button";

interface DemoLoginButtonProps {
  onDemoLogin: (username: string, password: string) => void;
}

export function DemoLoginButton({ onDemoLogin }: DemoLoginButtonProps) {
  return (
    <>
      <div className="relative w-full my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted/40"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Demo Access
          </span>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        onClick={() => onDemoLogin("superadmin", "password123")}
        className="w-full text-sm h-10 border-muted/30 bg-white/30 backdrop-blur-sm hover:bg-white/50"
      >
        Login as Superadmin
      </Button>
    </>
  );
}

export default DemoLoginButton;

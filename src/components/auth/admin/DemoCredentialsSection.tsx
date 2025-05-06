
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

interface DemoCredential {
  label: string;
  username: string;
  password: string;
}

interface DemoCredentialsSectionProps {
  demoCredentials: DemoCredential[];
  onDemoLogin: (username: string, password: string) => void;
}

export function DemoCredentialsSection({ 
  demoCredentials, 
  onDemoLogin 
}: DemoCredentialsSectionProps) {
  if (!demoCredentials || demoCredentials.length === 0) {
    return null;
  }

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
      
      <div className="grid w-full grid-cols-2 gap-2">
        {demoCredentials.map((cred) => (
          <Button 
            key={cred.label}
            variant="outline" 
            onClick={() => onDemoLogin(cred.username, cred.password)}
            className="text-sm h-10 border-muted/30 bg-white/30 backdrop-blur-sm hover:bg-white/50"
          >
            <ShieldCheck className="mr-2 h-4 w-4" /> {cred.label}
          </Button>
        ))}
      </div>
    </>
  );
}

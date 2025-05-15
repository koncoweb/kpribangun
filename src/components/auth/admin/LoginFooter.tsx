
import { Link } from "react-router-dom";

interface LoginFooterProps {
  onDemoLogin: (username: string, password: string) => void;
  copyrightText?: string;
}

export function LoginFooter({ 
  onDemoLogin,
  copyrightText = "KPRI Bangun &copy; 2023 - All rights reserved"
}: LoginFooterProps) {
  return (
    <div className="flex flex-col gap-4 pt-0 pb-6 relative z-10 w-full">
      <div className="flex justify-center w-full mt-2">
        <Link to="/anggota-login" className="text-sm text-blue-600 hover:underline">
          Login sebagai Anggota
        </Link>
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-4">
        {copyrightText}
      </p>
    </div>
  );
}

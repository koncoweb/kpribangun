
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/services/auth/core";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentUser } from "@/services/auth/core";

type HeaderProps = {
  pageTitle: string;
};

export default function Header({ pageTitle }: HeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Berhasil Keluar",
        description: "Anda telah berhasil keluar dari sistem",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Gagal Keluar",
        description: "Terjadi kesalahan saat mencoba keluar",
        variant: "destructive"
      });
    }
  };
  
  return (
    <header className="bg-white border-b py-4 px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-koperasi-dark">{pageTitle}</h1>
      
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon">
          <Bell size={18} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <User size={18} />
              <span>{currentUser?.nama || "Admin"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profil")}>Profil</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/pengaturan")}>Pengaturan</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">Keluar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

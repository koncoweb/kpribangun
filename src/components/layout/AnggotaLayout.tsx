
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { logoutUser, getCurrentUser } from "@/services/authService";
import "@/styles/form-styles.css";

type AnggotaLayoutProps = {
  children: ReactNode;
  pageTitle: string;
};

export default function AnggotaLayout({ children, pageTitle }: AnggotaLayoutProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  
  // Set document title when page changes
  document.title = `${pageTitle} | Profil Anggota`;
  
  const handleLogout = () => {
    logoutUser();
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari sistem",
    });
    navigate("/anggota-login");
  };
  
  const handleChangePassword = () => {
    navigate("/anggota/change-password");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6 mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-white">
                {currentUser?.nama?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-medium">{currentUser?.nama}</h1>
              <p className="text-sm text-muted-foreground">ID: {currentUser?.anggotaId}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={handleChangePassword}
            >
              <Lock className="mr-1 h-4 w-4" />
              Ubah Password
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-1 h-4 w-4" />
              Keluar
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">{pageTitle}</h2>
        {children}
      </main>
      
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} KPRI Bangun. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}

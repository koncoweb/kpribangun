
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { initDefaultUsers } from "@/services/auth";
import { toast } from "@/hooks/use-toast";

export function InitializeDataButton() {
  const [initInProgress, setInitInProgress] = useState(false);

  const handleInitData = async () => {
    try {
      setInitInProgress(true);
      await initDefaultUsers();
      toast({
        title: "Inisialisasi data berhasil",
        description: "Data pengguna default telah ditambahkan ke database",
      });
    } catch (error) {
      console.error("Init data error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan saat menginisialisasi data",
      });
    } finally {
      setInitInProgress(false);
    }
  };

  return (
    <div className="text-center">
      <Button 
        variant="outline" 
        onClick={handleInitData}
        disabled={initInProgress}
        className="mt-2 mx-auto text-xs"
      >
        {initInProgress ? "Menginisialisasi..." : "Inisialisasi Data"}
      </Button>
      <p className="text-xs text-muted-foreground mt-1">
        Klik tombol di atas jika ini adalah pertama kali Anda menggunakan aplikasi
      </p>
    </div>
  );
}

export default InitializeDataButton;

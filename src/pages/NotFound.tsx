
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
        <p className="text-2xl text-gray-700 mb-6">Halaman Tidak Ditemukan</p>
        <p className="text-gray-600 mb-6">
          Maaf, kami tidak dapat menemukan halaman yang Anda cari.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button onClick={() => navigate(-1)} variant="outline">
            Kembali
          </Button>
          <Button onClick={() => navigate("/")} variant="default">
            Ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;


import Layout from "@/components/layout/Layout";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Users, 
  PiggyBank, 
  ShoppingCart, 
  FileText, 
  Settings,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { initSampleProdukData } from "@/services/produk";
import { initSampleKasirData } from "@/services/kasirService";

export default function Index() {
  // Initialize sample data for the POS system
  useEffect(() => {
    initSampleProdukData();
    initSampleKasirData();
  }, []);

  const mainNavigation = [
    {
      title: "Data Anggota",
      icon: Users,
      description: "Kelola data anggota koperasi",
      path: "/anggota",
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Transaksi",
      icon: PiggyBank,
      description: "Simpan, pinjam, & angsuran",
      path: "/transaksi",
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Point of Sales",
      icon: ShoppingCart,
      description: "Kelola penjualan toko",
      path: "/pos",
      color: "bg-amber-100 text-amber-800",
    },
    {
      title: "Laporan",
      icon: FileText,
      description: "Laporan keuangan & transaksi",
      path: "/laporan",
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "Pengaturan",
      icon: Settings,
      description: "Konfigurasi sistem koperasi",
      path: "/pengaturan",
      color: "bg-gray-100 text-gray-800",
    }
  ];

  return (
    <Layout pageTitle="Dashboard">
      <h1 className="page-title">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <span className="stat-value">125</span>
          <span className="stat-label">Total Anggota</span>
        </div>
        
        <div className="stat-card">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <PiggyBank className="h-5 w-5 text-green-600" />
          </div>
          <span className="stat-value">Rp 125.500.000</span>
          <span className="stat-label">Total Simpanan</span>
        </div>
        
        <div className="stat-card">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <PiggyBank className="h-5 w-5 text-amber-600" />
          </div>
          <span className="stat-value">Rp 85.250.000</span>
          <span className="stat-label">Total Pinjaman</span>
        </div>
        
        <div className="stat-card">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <ShoppingCart className="h-5 w-5 text-purple-600" />
          </div>
          <span className="stat-value">Rp 43.750.000</span>
          <span className="stat-label">Total Penjualan</span>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Menu Utama</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainNavigation.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center`}>
                  <item.icon className="h-6 w-6" />
                </div>
                
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-3">{item.description}</p>
                  
                  <Link to={item.path}>
                    <Button variant="outline" className="w-full mt-2 flex items-center justify-between">
                      Buka {item.title}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
}

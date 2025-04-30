
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function POSIndex() {
  return (
    <Layout pageTitle="Point of Sales">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Point of Sales</h2>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <CardTitle>Selamat Datang di Point of Sales</CardTitle>
            </div>
            <CardDescription>
              Kelola stok barang, inventori, transaksi, dan laporan penjualan Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              Gunakan menu di sidebar untuk mengakses berbagai fitur Point of Sales.
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

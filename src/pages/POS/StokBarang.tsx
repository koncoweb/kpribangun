
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function StokBarang() {
  return (
    <Layout pageTitle="Stok Barang">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Stok Barang</h2>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle>Manajemen Stok Barang</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>Halaman ini akan menampilkan dan mengelola stok barang yang tersedia.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

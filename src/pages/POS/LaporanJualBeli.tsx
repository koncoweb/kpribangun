
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function LaporanJualBeli() {
  return (
    <Layout pageTitle="Laporan Jual Beli">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Laporan Jual Beli</h2>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              <CardTitle>Laporan Penjualan dan Pembelian</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>Halaman ini akan menampilkan laporan jual beli dengan grafik dan data detail.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

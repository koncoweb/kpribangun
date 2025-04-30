
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

export default function RiwayatTransaksi() {
  return (
    <Layout pageTitle="Riwayat Transaksi">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Riwayat Transaksi</h2>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <CardTitle>Riwayat Transaksi Penjualan</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>Halaman ini akan menampilkan riwayat transaksi penjualan.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

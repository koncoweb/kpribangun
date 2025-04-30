
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from "lucide-react";

export default function KuitansiPembayaran() {
  return (
    <Layout pageTitle="Kuitansi Pembayaran">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Kuitansi Pembayaran</h2>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <CardTitle>Manajemen Kuitansi</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>Halaman ini akan menampilkan dan mengelola kuitansi pembayaran.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

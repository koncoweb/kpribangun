
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "lucide-react";

export default function LaporanRugiLaba() {
  return (
    <Layout pageTitle="Laporan Rugi Laba">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Laporan Rugi Laba</h2>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              <CardTitle>Laporan Rugi Laba</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>Halaman ini akan menampilkan laporan rugi laba dengan grafik dan data detail.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

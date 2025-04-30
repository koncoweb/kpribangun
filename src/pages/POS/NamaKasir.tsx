
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function NamaKasir() {
  return (
    <Layout pageTitle="Nama Kasir">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Nama Kasir</h2>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Manajemen Kasir</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>Halaman ini akan menampilkan dan mengelola data kasir.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

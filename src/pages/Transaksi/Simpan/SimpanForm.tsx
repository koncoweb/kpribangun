
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getAnggotaList } from "@/adapters/serviceAdapters";
import { SimpananForm } from "@/components/transaksi/SimpananForm";
import { useAsync } from "@/hooks/use-async";

export default function SimpleSimpanForm() {
  const { data: anggotaList, loading } = useAsync(
    async () => await getAnggotaList(),
    [],
    []
  );

  return (
    <Layout pageTitle="Transaksi Simpanan">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi/simpan">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Buat Transaksi Simpanan</h1>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Memuat data...</p>
            </div>
          ) : (
            <SimpananForm anggotaList={anggotaList} />
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}

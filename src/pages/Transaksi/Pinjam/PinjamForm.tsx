
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getAllAnggota } from "@/services/anggotaService";
import { PinjamanForm } from "@/components/transaksi/pinjaman-form";

export default function SimplePinjamForm() {
  const [anggotaList, setAnggotaList] = useState([]);
  
  useEffect(() => {
    // Load anggota from local storage
    const loadedAnggota = getAllAnggota();
    setAnggotaList(loadedAnggota);
  }, []);

  return (
    <Layout pageTitle="Transaksi Pinjaman">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi/pinjam">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Buat Transaksi Pinjaman</h1>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <PinjamanForm anggotaList={anggotaList} />
        </CardContent>
      </Card>
    </Layout>
  );
}

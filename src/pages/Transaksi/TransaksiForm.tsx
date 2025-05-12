import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { getAllAnggota } from "@/services/anggotaService";
import { SimpananForm } from "@/components/transaksi/SimpananForm";
import { PinjamanForm } from "@/components/transaksi/pinjaman-form"; // Updated import path

export default function TransaksiForm() {
  const [transaksiType, setTransaksiType] = useState<string>("simpan");
  const [anggotaList, setAnggotaList] = useState([]);
  
  useEffect(() => {
    // Load anggota from local storage
    const loadedAnggota = getAllAnggota();
    setAnggotaList(loadedAnggota);
  }, []);

  return (
    <Layout pageTitle="Transaksi Baru">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Buat Transaksi Baru</h1>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Tabs 
            defaultValue="simpan" 
            onValueChange={(value) => setTransaksiType(value)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="simpan">Simpanan</TabsTrigger>
              <TabsTrigger value="pinjam">Pinjaman</TabsTrigger>
            </TabsList>
            
            <TabsContent value="simpan">
              <SimpananForm anggotaList={anggotaList} />
            </TabsContent>
            
            <TabsContent value="pinjam">
              <PinjamanForm anggotaList={anggotaList} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
}


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { getAnggotaList } from "@/adapters/serviceAdapters";
import { SimpananForm } from "@/components/transaksi/SimpananForm";
import { PinjamanForm } from "@/components/transaksi/pinjaman-form";
import { Anggota } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export default function TransaksiForm() {
  const [transaksiType, setTransaksiType] = useState<string>("simpan");
  const { toast } = useToast();
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadAnggota = async () => {
      try {
        setLoading(true);
        const data = await getAnggotaList();
        setAnggotaList(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal memuat data anggota",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadAnggota();
  }, [toast]);

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
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Memuat data...</p>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}

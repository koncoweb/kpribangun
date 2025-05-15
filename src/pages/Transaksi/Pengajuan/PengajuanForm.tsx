import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { getAnggotaList } from "@/adapters/serviceAdapters";
import { Anggota } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PengajuanSimpananForm } from "@/components/pengajuan/PengajuanSimpananForm";
import { PengajuanPinjamanForm } from "@/components/pengajuan/PengajuanPinjamanForm";

export default function PengajuanForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("simpanan");
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getAnggotaList();
        setAnggotaList(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memuat data anggota",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  return (
    <Layout pageTitle="Form Pengajuan">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi/pengajuan">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Buat Pengajuan Baru</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Form Pengajuan</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Memuat data...</p>
            </div>
          ) : (
            <Tabs 
              defaultValue="simpanan" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="simpanan">Simpanan</TabsTrigger>
                <TabsTrigger value="pinjaman">Pinjaman</TabsTrigger>
              </TabsList>
              
              <TabsContent value="simpanan">
                <PengajuanSimpananForm anggotaList={anggotaList} />
              </TabsContent>
              
              <TabsContent value="pinjaman">
                <PengajuanPinjamanForm anggotaList={anggotaList} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}

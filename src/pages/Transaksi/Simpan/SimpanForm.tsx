
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getAnggotaList } from "@/adapters/serviceAdapters";
import { SimpananForm } from "@/components/transaksi/SimpananForm";
import { Anggota } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export default function SimpleSimpanForm() {
  const navigate = useNavigate();
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

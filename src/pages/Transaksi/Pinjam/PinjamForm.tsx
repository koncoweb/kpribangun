
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { PinjamanForm } from "@/components/transaksi/pinjaman-form";
import { getAnggotaList } from "@/adapters/serviceAdapters";
import { Anggota } from "@/types";

export default function PinjamForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load anggota list on component mount
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
    <Layout pageTitle="Tambah Pinjaman Baru">
      {loading ? (
        <div className="flex justify-center py-8">
          <p>Memuat data...</p>
        </div>
      ) : (
        <PinjamanForm anggotaList={anggotaList} />
      )}
    </Layout>
  );
}

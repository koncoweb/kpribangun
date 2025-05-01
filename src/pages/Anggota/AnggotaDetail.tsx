
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { getAnggotaById } from "@/services/anggotaService";
import { 
  getTransaksiByAnggotaId, 
  calculateTotalSimpanan, 
  calculateTotalPinjaman, 
  getOverdueLoans,
  getUpcomingDueLoans,
  calculatePenalty
} from "@/services/transaksi";
import { Anggota, Transaksi } from "@/types";
import { LoadingState } from "@/components/anggota/detail/LoadingState";
import { AnggotaDetailHeader } from "@/components/anggota/detail/AnggotaDetailHeader";
import { MainInfoSection } from "@/components/anggota/detail/MainInfoSection";
import { KeluargaSection } from "@/components/anggota/detail/KeluargaSection";
import { TransactionSection } from "@/components/anggota/detail/TransactionSection";

export default function AnggotaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anggota, setAnggota] = useState<Anggota | null>(null);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [jatuhTempo, setJatuhTempo] = useState<{
    transaksi: Transaksi;
    jatuhTempo: string;
    daysUntilDue: number;
  }[]>([]);
  const [tunggakan, setTunggakan] = useState<{
    transaksi: Transaksi;
    jatuhTempo: string;
    daysOverdue: number;
    penalty: number;
  }[]>([]);
  
  useEffect(() => {
    if (id) {
      try {
        const foundAnggota = getAnggotaById(id);
        if (foundAnggota) {
          setAnggota(foundAnggota);
          
          // Get all transactions for this member
          const anggotaTransaksi = getTransaksiByAnggotaId(id);
          setTransaksi(anggotaTransaksi);
          
          try {
            // Get upcoming due loans
            const upcomingDue = getUpcomingDueLoans()
              .filter(item => item.transaksi.anggotaId === id)
              .map(item => ({
                transaksi: item.transaksi,
                jatuhTempo: item.jatuhTempo,
                daysUntilDue: item.daysUntilDue
              }));
            setJatuhTempo(upcomingDue);
            
            // Get overdue loans
            const overdue = getOverdueLoans()
              .filter(item => item.transaksi.anggotaId === id)
              .map(item => ({
                transaksi: item.transaksi,
                jatuhTempo: item.jatuhTempo,
                daysOverdue: item.daysOverdue,
                penalty: calculatePenalty(item.transaksi.jumlah, item.daysOverdue)
              }));
            setTunggakan(overdue);
          } catch (error) {
            console.error("Error processing loan data:", error);
            toast({
              title: "Warning",
              description: "Terjadi kesalahan saat memuat data pinjaman",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Anggota tidak ditemukan",
            description: "Data anggota yang dicari tidak ditemukan",
            variant: "destructive",
          });
          navigate("/anggota");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memuat data. Silakan coba lagi.",
          variant: "destructive",
        });
        navigate("/anggota");
      }
    }
  }, [id, navigate, toast]);
  
  if (!anggota) {
    return (
      <Layout pageTitle="Detail Anggota">
        <LoadingState />
      </Layout>
    );
  }
  
  const totalSimpanan = calculateTotalSimpanan(anggota.id);
  const totalPinjaman = calculateTotalPinjaman(anggota.id);
  const simpananTransaksi = transaksi.filter(t => t.jenis === "Simpan");
  const pinjamanTransaksi = transaksi.filter(t => t.jenis === "Pinjam");
  const angsuranTransaksi = transaksi.filter(t => t.jenis === "Angsuran");

  const keluargaCount = anggota.keluarga?.length || 0;
  const dokumenCount = anggota.dokumen?.length || 0;

  return (
    <Layout pageTitle={`Detail Anggota - ${anggota.nama}`}>
      <AnggotaDetailHeader 
        nama={anggota.nama}
        keluargaCount={keluargaCount}
        dokumenCount={dokumenCount}
        anggotaId={anggota.id}
      />
      
      <MainInfoSection
        anggota={anggota}
        totalSimpanan={totalSimpanan}
        totalPinjaman={totalPinjaman}
      />
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <KeluargaSection 
          anggota={anggota} 
          onAnggotaUpdate={setAnggota} 
        />
      </div>
      
      <TransactionSection
        transaksi={transaksi}
        simpananTransaksi={simpananTransaksi}
        pinjamanTransaksi={pinjamanTransaksi}
        angsuranTransaksi={angsuranTransaksi}
        jatuhTempo={jatuhTempo}
        tunggakan={tunggakan}
        anggotaId={anggota.id}
      />
    </Layout>
  );
}

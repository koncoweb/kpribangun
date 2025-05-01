
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAnggotaById } from "@/services/anggotaService";
import { 
  getTransaksiByAnggotaId, 
  calculateTotalSimpanan, 
  calculateTotalPinjaman, 
  getOverdueLoans,
  getUpcomingDueLoans,
  calculateJatuhTempo,
  calculatePenalty
} from "@/services/transaksi";
import { Anggota, Transaksi } from "@/types";
import { ProfileCard } from "@/components/anggota/detail/ProfileCard";
import { InfoCard } from "@/components/anggota/detail/InfoCard";
import { TransactionTabs } from "@/components/anggota/detail/TransactionTabs";
import { Badge } from "@/components/ui/badge";
import { KeluargaTable } from "@/components/anggota/detail/KeluargaTable";
import { DetailPageHeader } from "@/components/pos/detail/DetailPageHeader";

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
        <div className="flex justify-center items-center h-64">
          <p>Memuat data anggota...</p>
        </div>
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
      <DetailPageHeader title="Detail Anggota" backLink="/anggota" />
      
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">{anggota.nama}</h1>
        {keluargaCount > 0 && (
          <Badge variant="info" className="ml-2">
            {keluargaCount} Anggota Keluarga
          </Badge>
        )}
        {dokumenCount > 0 && (
          <Badge variant="success" className="ml-2">
            {dokumenCount} Dokumen
          </Badge>
        )}
        <div className="ml-auto">
          <Button asChild variant="outline" size="sm">
            <Link to={`/anggota/edit/${anggota.id}`}>
              <Edit size={16} className="mr-1.5" /> Edit
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-4">
          <ProfileCard anggota={anggota} />
        </div>
        
        <div className="lg:col-span-8">
          <InfoCard anggota={anggota} totalSimpanan={totalSimpanan} totalPinjaman={totalPinjaman} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Data Keluarga</CardTitle>
          </CardHeader>
          <CardContent>
            <KeluargaTable keluarga={anggota.keluarga || []} anggotaId={anggota.id} />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Histori Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTabs
            transaksi={transaksi}
            simpananTransaksi={simpananTransaksi}
            pinjamanTransaksi={pinjamanTransaksi}
            angsuranTransaksi={angsuranTransaksi}
            jatuhTempo={jatuhTempo}
            tunggakan={tunggakan}
            keluarga={anggota.keluarga || []}
            anggotaId={anggota.id}
          />
        </CardContent>
      </Card>
    </Layout>
  );
}

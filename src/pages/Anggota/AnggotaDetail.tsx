
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
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
} from "@/services/transaksiService";
import { Anggota, Transaksi } from "@/types";
import { ProfileCard } from "@/components/anggota/detail/ProfileCard";
import { InfoCard } from "@/components/anggota/detail/InfoCard";
import { TransactionTabs } from "@/components/anggota/detail/TransactionTabs";
import { Badge } from "@/components/ui/badge";

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
      const foundAnggota = getAnggotaById(id);
      if (foundAnggota) {
        setAnggota(foundAnggota);
        
        // Get all transactions for this member
        const anggotaTransaksi = getTransaksiByAnggotaId(id);
        setTransaksi(anggotaTransaksi);
        
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
      } else {
        toast({
          title: "Anggota tidak ditemukan",
          description: "Data anggota yang dicari tidak ditemukan",
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
      <div className="flex items-center gap-4 mb-6">
        <Link to="/anggota">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Detail Anggota</h1>
        <div className="ml-auto flex items-center gap-2">
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
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ProfileCard anggota={anggota} />
        <InfoCard anggota={anggota} totalSimpanan={totalSimpanan} totalPinjaman={totalPinjaman} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Histori Transaksi & Data Keluarga</CardTitle>
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
          />
        </CardContent>
      </Card>
    </Layout>
  );
}


import { useState, useEffect } from "react";
import { Anggota, Transaksi } from "@/types";
import { 
  getTransaksiByAnggotaId, 
  calculateTotalSimpanan, 
  calculateTotalPinjaman,
  getOverdueLoans,
  getUpcomingDueLoans,
  calculatePenalty,
  calculateSHU
} from "@/adapters/serviceAdapters";

import { AnggotaDetailHeader } from "./AnggotaDetailHeader";
import { MainInfoSection } from "./MainInfoSection";
import { TransactionSection } from "./TransactionSection";
import { KeluargaSection } from "./KeluargaSection";
import { AngsuranList } from "./AngsuranList";
import { FinancialSummaryCards } from "./FinancialSummaryCards";
import { PengajuanPinjamanButton } from "./pinjaman-form"; 
import { useAsync } from "@/hooks/useAsync";

interface AnggotaDetailContentProps {
  anggota: Anggota;
}

export function AnggotaDetailContent({ anggota }: AnggotaDetailContentProps) {
  // Get transaction data 
  const id = anggota.id;
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Financial data states
  const [financialData, setFinancialData] = useState({
    simpananTransaksi: [] as Transaksi[],
    pinjamanTransaksi: [] as Transaksi[],
    angsuranTransaksi: [] as Transaksi[],
    totalSimpanan: 0,
    totalPinjaman: 0,
    totalSHU: 0,
    jatuhTempo: [] as any[],
    tunggakan: [] as any[]
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load transaction data
        const transaksiData = await getTransaksiByAnggotaId(id);
        setTransaksi(transaksiData);
        
        // Calculate financial information
        const simpananTransaksi = transaksiData.filter(t => t.jenis === "Simpan");
        const pinjamanTransaksi = transaksiData.filter(t => t.jenis === "Pinjam");
        const angsuranTransaksi = transaksiData.filter(t => t.jenis === "Angsuran");
        
        const totalSimpanan = calculateTotalSimpanan(id);
        const totalPinjaman = calculateTotalPinjaman(id);
        const totalSHU = calculateSHU(id);
        
        // Get due dates and overdue information
        const jatuhTempo = getUpcomingDueLoans(id, 30);
        const rawTunggakan = getOverdueLoans(id);
        
        // Filter and process loan data
        const filteredJatuhTempo = jatuhTempo.filter(item => item.transaksi.anggotaId === id);
        const filteredTunggakan = rawTunggakan
          .filter(item => item.transaksi.anggotaId === id)
          .map(item => ({
            ...item,
            penalty: calculatePenalty(item.transaksi.jumlah, item.daysOverdue)
          }));
        
        // Set all financial data at once
        setFinancialData({
          simpananTransaksi,
          pinjamanTransaksi,
          angsuranTransaksi,
          totalSimpanan,
          totalPinjaman,
          totalSHU,
          jatuhTempo: filteredJatuhTempo,
          tunggakan: filteredTunggakan
        });
      } catch (error) {
        console.error("Error loading anggota data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  // Calculate additional financial metrics
  const totalAngsuran = financialData.angsuranTransaksi.reduce((sum, item) => sum + item.jumlah, 0);
  const totalTunggakan = financialData.tunggakan.reduce((sum, item) => sum + item.penalty, 0);
  
  const keluargaCount = anggota?.keluarga?.length || 0;
  const dokumenCount = anggota?.dokumen?.length || 0;

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  return (
    <>
      <AnggotaDetailHeader 
        nama={anggota.nama} 
        keluargaCount={keluargaCount}
        dokumenCount={dokumenCount}
        anggotaId={anggota.id}
      />
      
      <div className="mt-4 mb-6 flex justify-end">
        <PengajuanPinjamanButton anggotaId={anggota.id} anggotaNama={anggota.nama} />
      </div>
      
      <MainInfoSection anggota={anggota} />
      
      <div className="mt-6 mb-6">
        <KeluargaSection 
          anggota={anggota} 
          onAnggotaUpdate={() => {}}
        />
      </div>
      
      <FinancialSummaryCards 
        totalSimpanan={financialData.totalSimpanan}
        totalPinjaman={financialData.totalPinjaman}
        totalAngsuran={totalAngsuran}
        totalTunggakan={totalTunggakan}
        totalSHU={financialData.totalSHU}
      />
      
      <div className="mt-6">
        <TransactionSection 
          transaksi={transaksi} 
          simpananTransaksi={financialData.simpananTransaksi}
          pinjamanTransaksi={financialData.pinjamanTransaksi}
          angsuranTransaksi={financialData.angsuranTransaksi}
          jatuhTempo={financialData.jatuhTempo}
          tunggakan={financialData.tunggakan}
          anggotaId={anggota.id}
        />
      </div>
      
      {financialData.pinjamanTransaksi.length > 0 && (
        <AngsuranList 
          pinjamanTransaksi={financialData.pinjamanTransaksi} 
          disableSelfPayment={true}
        />
      )}
    </>
  );
}

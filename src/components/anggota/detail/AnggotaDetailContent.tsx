
import { Anggota } from "@/types";
import { 
  getTransaksiByAnggotaId, 
  calculateTotalSimpanan, 
  calculateTotalPinjaman,
  getOverdueLoans,
  getUpcomingDueLoans,
  calculatePenalty,
  calculateSHU // Import the new SHU calculation function
} from "@/services/transaksi";

import { AnggotaDetailHeader } from "./AnggotaDetailHeader";
import { MainInfoSection } from "./MainInfoSection";
import { TransactionSection } from "./TransactionSection";
import { KeluargaSection } from "./KeluargaSection";
import { AngsuranList } from "./AngsuranList";
import { FinancialSummaryCards } from "./FinancialSummaryCards";
import { PengajuanPinjamanButton } from "./PengajuanPinjamanButton"; // Import the new component

interface AnggotaDetailContentProps {
  anggota: Anggota;
}

export function AnggotaDetailContent({ anggota }: AnggotaDetailContentProps) {
  // Get transaction data and calculate financial information
  const id = anggota.id;
  const transaksi = getTransaksiByAnggotaId(id);
  const simpananTransaksi = transaksi.filter(t => t.jenis === "Simpan");
  const pinjamanTransaksi = transaksi.filter(t => t.jenis === "Pinjam");
  const angsuranTransaksi = transaksi.filter(t => t.jenis === "Angsuran");
  const totalSimpanan = calculateTotalSimpanan(id);
  const totalPinjaman = calculateTotalPinjaman(id);
  
  // Calculate SHU for this member
  const totalSHU = calculateSHU(id);
  
  // Pass member id as string to these functions
  const jatuhTempo = getUpcomingDueLoans(id, 30);
  const rawTunggakan = getOverdueLoans(id);
  
  // Filter data specific to this member and add penalty information
  const filteredJatuhTempo = jatuhTempo.filter(item => item.transaksi.anggotaId === id);
  const filteredTunggakan = rawTunggakan
    .filter(item => item.transaksi.anggotaId === id)
    .map(item => ({
      ...item,
      penalty: calculatePenalty(item.transaksi.jumlah, item.daysOverdue)
    }));
  
  // Calculate additional financial metrics
  const totalAngsuran = angsuranTransaksi.reduce((sum, item) => sum + item.jumlah, 0);
  const totalTunggakan = filteredTunggakan.reduce((sum, item) => sum + item.penalty, 0);
  
  const keluargaCount = anggota?.keluarga?.length || 0;
  const dokumenCount = anggota?.dokumen?.length || 0;

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
      
      <FinancialSummaryCards 
        totalSimpanan={totalSimpanan}
        totalPinjaman={totalPinjaman}
        totalAngsuran={totalAngsuran}
        totalTunggakan={totalTunggakan}
        totalSHU={totalSHU} // Added SHU to the financial summary
      />
      
      <div className="mt-6">
        <TransactionSection 
          transaksi={transaksi} 
          simpananTransaksi={simpananTransaksi}
          pinjamanTransaksi={pinjamanTransaksi}
          angsuranTransaksi={angsuranTransaksi}
          jatuhTempo={filteredJatuhTempo}
          tunggakan={filteredTunggakan}
          anggotaId={anggota.id}
        />
      </div>
      
      {pinjamanTransaksi.length > 0 && (
        <AngsuranList 
          pinjamanTransaksi={pinjamanTransaksi} 
          disableSelfPayment={true} // Disable self-payment option
        />
      )}
      
      <div className="mt-6">
        <KeluargaSection 
          anggota={anggota} 
          onAnggotaUpdate={() => {}}
        />
      </div>
    </>
  );
}

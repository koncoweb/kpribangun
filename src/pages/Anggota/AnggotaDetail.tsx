
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAnggotaById } from "@/services/anggotaService";
import { getCurrentUser } from "@/services/authService";
import { 
  getTransaksiByAnggotaId, 
  calculateTotalSimpanan, 
  calculateTotalPinjaman,
  getOverdueLoans,
  getUpcomingDueLoans,
  calculatePenalty
} from "@/services/transaksi";
import Layout from "@/components/layout/Layout";
import AnggotaLayout from "@/components/layout/AnggotaLayout";
import { AnggotaDetailHeader } from "@/components/anggota/detail/AnggotaDetailHeader";
import { MainInfoSection } from "@/components/anggota/detail/MainInfoSection";
import { TransactionSection } from "@/components/anggota/detail/TransactionSection";
import { KeluargaSection } from "@/components/anggota/detail/KeluargaSection";
import { LoadingState } from "@/components/anggota/detail/LoadingState";

export default function AnggotaDetail() {
  const { id } = useParams<{ id: string }>();
  const [anggota, setAnggota] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = getCurrentUser();
  const isAnggotaUser = currentUser?.roleId !== 'role_superadmin' && currentUser?.roleId !== 'role_admin';
  
  // Load anggota data
  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    const anggotaData = getAnggotaById(id);
    
    if (anggotaData) {
      setAnggota(anggotaData);
    }
    
    // Simulate loading delay for demo
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [id]);

  const Content = () => {
    // Get transaction data and calculate financial information
    const transaksi = id ? getTransaksiByAnggotaId(id) : [];
    const simpananTransaksi = transaksi.filter(t => t.jenis === "Simpan");
    const pinjamanTransaksi = transaksi.filter(t => t.jenis === "Pinjam");
    const angsuranTransaksi = transaksi.filter(t => t.jenis === "Angsuran");
    const totalSimpanan = id ? calculateTotalSimpanan(id) : 0;
    const totalPinjaman = id ? calculateTotalPinjaman(id) : 0;
    const jatuhTempo = id ? getUpcomingDueLoans(30) : [];
    const rawTunggakan = id ? getOverdueLoans() : [];
    
    // Filter data specific to this member and add penalty information
    const filteredJatuhTempo = jatuhTempo.filter(item => item.transaksi.anggotaId === id);
    const filteredTunggakan = rawTunggakan
      .filter(item => item.transaksi.anggotaId === id)
      .map(item => ({
        ...item,
        penalty: calculatePenalty(item.transaksi.jumlah, item.daysOverdue)
      }));
    
    const keluargaCount = anggota?.keluarga?.length || 0;
    const dokumenCount = anggota?.dokumen?.length || 0;
    
    return (
      <>
        {isLoading ? (
          <LoadingState />
        ) : anggota ? (
          <>
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
            
            <div className="mt-6">
              <KeluargaSection 
                anggota={anggota} 
                onAnggotaUpdate={setAnggota}
              />
            </div>
          </>
        ) : (
          <div className="text-center p-12">
            <h2 className="text-2xl font-bold text-gray-800">Data Anggota tidak ditemukan</h2>
            <p className="text-gray-600 mt-2">
              Anggota dengan ID {id} tidak terdaftar dalam sistem
            </p>
          </div>
        )}
      </>
    );
  };

  // Use appropriate layout based on user role
  if (isAnggotaUser) {
    return (
      <AnggotaLayout pageTitle="Profil Anggota">
        <Content />
      </AnggotaLayout>
    );
  }

  return (
    <Layout pageTitle="Detail Anggota">
      <Content />
    </Layout>
  );
}


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
import { AngsuranList } from "@/components/anggota/detail/AngsuranList";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, CreditCard, ArrowUpRight, AlertTriangle, Calculator } from "lucide-react";

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
    
    // Calculate additional financial metrics
    const totalAngsuran = angsuranTransaksi.reduce((sum, item) => sum + item.jumlah, 0);
    const totalTunggakan = filteredTunggakan.reduce((sum, item) => sum + item.penalty, 0);
    
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
            
            <MainInfoSection anggota={anggota} />
            
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Simpanan</p>
                      <p className="text-xl font-bold">Rp {totalSimpanan.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="rounded-full bg-green-100 p-3">
                      <Wallet className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Pinjaman</p>
                      <p className="text-xl font-bold">Rp {(totalPinjaman + totalAngsuran).toLocaleString("id-ID")}</p>
                    </div>
                    <div className="rounded-full bg-amber-100 p-3">
                      <CreditCard className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Sisa Pinjaman</p>
                      <p className="text-xl font-bold">Rp {totalPinjaman.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="rounded-full bg-blue-100 p-3">
                      <Calculator className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Angsuran</p>
                      <p className="text-xl font-bold">Rp {totalAngsuran.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="rounded-full bg-indigo-100 p-3">
                      <ArrowUpRight className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Tunggakan</p>
                      <p className="text-xl font-bold">Rp {totalTunggakan.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="rounded-full bg-red-100 p-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
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
            
            {/* Add Angsuran List here */}
            {pinjamanTransaksi.length > 0 && (
              <AngsuranList pinjamanTransaksi={pinjamanTransaksi} />
            )}
            
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

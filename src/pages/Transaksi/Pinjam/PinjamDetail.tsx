
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getTransaksiById } from "@/services/transaksiService";
import { getAnggotaById } from "@/services/anggotaService";
import { getPengaturan } from "@/services/pengaturanService";
import { Anggota, Transaksi } from "@/types";
import { Separator } from "@/components/ui/separator";

export default function PinjamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [anggota, setAnggota] = useState<Anggota | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const transaksiData = getTransaksiById(id);
      if (transaksiData && transaksiData.jenis === "Pinjam") {
        setTransaksi(transaksiData);
        
        // Load anggota data
        const anggotaData = getAnggotaById(transaksiData.anggotaId);
        if (anggotaData) {
          setAnggota(anggotaData);
        }
      } else {
        toast({
          title: "Data tidak ditemukan",
          description: `Pinjaman dengan ID ${id} tidak ditemukan`,
          variant: "destructive",
        });
        navigate("/transaksi/pinjam");
      }
    }
    setLoading(false);
  }, [id, navigate, toast]);

  // Parse loan details from keterangan
  const parseLoanDetails = () => {
    if (!transaksi?.keterangan) return null;

    try {
      // Extract tenor and bunga from keterangan string
      const tenorMatch = transaksi.keterangan.match(/Tenor: (\d+) bulan/);
      const bungaMatch = transaksi.keterangan.match(/Bunga: ([0-9.]+)%/);
      const tujuanMatch = transaksi.keterangan.match(/Tujuan: ([^,]+)/);
      
      const tenor = tenorMatch ? parseInt(tenorMatch[1]) : null;
      const bunga = bungaMatch ? parseFloat(bungaMatch[1]) : null;
      const tujuan = tujuanMatch ? tujuanMatch[1] : null;

      // Calculate installment amount
      if (tenor !== null && bunga !== null) {
        const pengaturan = getPengaturan();
        const metodeBunga = pengaturan.sukuBunga.metodeBunga;
        
        if (metodeBunga === "flat") {
          const totalBunga = transaksi.jumlah * (bunga / 100) * tenor;
          const totalBayar = transaksi.jumlah + totalBunga;
          const angsuranPerBulan = Math.round(totalBayar / tenor);
          
          return {
            tenor,
            bunga,
            tujuan,
            angsuranPerBulan,
            totalBayar
          };
        } else {
          // Calculate declining rate method (simplified)
          // This is a rough approximation, not exact financial calculation
          const bungaBulanan = bunga / 12 / 100;
          const pembilang = bungaBulanan * Math.pow((1 + bungaBulanan), tenor);
          const penyebut = Math.pow((1 + bungaBulanan), tenor) - 1;
          
          const angsuranPerBulan = Math.round(transaksi.jumlah * (pembilang / penyebut));
          const totalBayar = angsuranPerBulan * tenor;
          
          return {
            tenor,
            bunga,
            tujuan,
            angsuranPerBulan,
            totalBayar
          };
        }
      }
    } catch (error) {
      console.error("Failed to parse loan details", error);
    }
    
    return null;
  };

  const loanDetails = parseLoanDetails();

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Layout pageTitle="Detail Pinjaman">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Memuat data...</p>
        </div>
      </Layout>
    );
  }

  if (!transaksi) {
    return (
      <Layout pageTitle="Detail Pinjaman">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Data pinjaman tidak ditemukan</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Detail Pinjaman">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/transaksi/pinjam">
            <Button variant="outline" size="icon">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="page-title">Detail Pinjaman</h1>
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={() => navigate(`/transaksi/${id}/cetak`)}>
            <FileText size={16} className="mr-2" />
            Cetak Bukti
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Transaksi Pinjaman #{transaksi.id}</span>
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                  transaksi.status === "Sukses" ? "bg-green-100 text-green-800" : 
                  transaksi.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                  "bg-red-100 text-red-800"
                }`}>
                  {transaksi.status}
                </span>
              </CardTitle>
              <CardDescription>
                Tanggal Transaksi: {formatDate(transaksi.tanggal)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Informasi Pinjaman</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Jenis Transaksi</p>
                    <p className="font-medium">
                      <span className="inline-block mt-1 px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                        Pinjaman
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jumlah Pinjaman</p>
                    <p className="font-medium">
                      {formatCurrency(transaksi.jumlah)}
                    </p>
                  </div>
                  
                  {loanDetails && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Tenor</p>
                        <p className="font-medium">{loanDetails.tenor} bulan</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Suku Bunga</p>
                        <p className="font-medium">{loanDetails.bunga}% per tahun</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Angsuran per Bulan</p>
                        <p className="font-medium">{formatCurrency(loanDetails.angsuranPerBulan)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total yang Harus Dibayar</p>
                        <p className="font-medium">{formatCurrency(loanDetails.totalBayar)}</p>
                      </div>
                      {loanDetails.tujuan && (
                        <div className="col-span-2">
                          <p className="text-sm text-muted-foreground">Tujuan Pinjaman</p>
                          <p className="font-medium">{loanDetails.tujuan}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {anggota && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informasi Anggota</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nama Anggota</p>
                      <p className="font-medium">{anggota.nama}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ID Anggota</p>
                      <p className="font-medium">{anggota.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">No. Telepon</p>
                      <p className="font-medium">{anggota.noHp}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Alamat</p>
                      <p className="font-medium">{anggota.alamat}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Tambahan</CardTitle>
              <CardDescription>
                Detail transaksi pinjaman
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">ID Transaksi</p>
                  <p className="font-medium">{transaksi.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Dibuat</p>
                  <p className="font-medium">{formatDate(transaksi.createdAt)}</p>
                </div>
                {transaksi.createdAt !== transaksi.updatedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Terakhir Diubah</p>
                    <p className="font-medium">{formatDate(transaksi.updatedAt)}</p>
                  </div>
                )}
                <Separator className="my-2" />
                <div>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate("/transaksi/angsuran/tambah", { state: { pinjamanId: transaksi.id } })}
                  >
                    Bayar Angsuran
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

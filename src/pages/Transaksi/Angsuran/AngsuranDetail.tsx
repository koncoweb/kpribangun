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
import { ArrowLeft, FileText, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getTransaksiById, getAllTransaksi } from "@/services/transaksi";
import { getAnggotaById } from "@/services/anggotaService";
import { Anggota, Transaksi } from "@/types";
import { Separator } from "@/components/ui/separator";
import { ReceiptDialog } from "@/components/transaksi/receipt/ReceiptDialog";

export default function AngsuranDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [anggota, setAnggota] = useState<Anggota | null>(null);
  const [relatedPinjaman, setRelatedPinjaman] = useState<Transaksi | null>(null);
  const [angsuranInfo, setAngsuranInfo] = useState<{
    angsuranKe: number;
    totalAngsuran: number;
    sisaPinjaman: number;
    tenor: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const transaksiData = getTransaksiById(id);
      if (transaksiData && transaksiData.jenis === "Angsuran") {
        setTransaksi(transaksiData);
        
        // Load anggota data
        const anggotaData = getAnggotaById(transaksiData.anggotaId);
        if (anggotaData) {
          setAnggota(anggotaData);
        }
        
        // Try to find related pinjaman from keterangan
        const pinjamanMatch = transaksiData.keterangan?.match(/pinjaman #(TR\d+)/);
        const angsuranKeMatch = transaksiData.keterangan?.match(/Angsuran ke-(\d+)/);
        
        if (pinjamanMatch && pinjamanMatch[1]) {
          const pinjamanId = pinjamanMatch[1];
          const pinjaman = getTransaksiById(pinjamanId);
          
          if (pinjaman) {
            setRelatedPinjaman(pinjaman);
            
            // Extract angsuran ke- information
            let angsuranKe = 1;
            if (angsuranKeMatch && angsuranKeMatch[1]) {
              angsuranKe = parseInt(angsuranKeMatch[1]);
            }
            
            // Calculate tenor and total angsuran
            const allTransaksi = getAllTransaksi();
            const angsuranTransaksi = allTransaksi.filter(
              t => t.jenis === "Angsuran" && 
                   t.status === "Sukses" && 
                   t.anggotaId === transaksiData.anggotaId &&
                   t.keterangan?.includes(pinjamanId)
            );
            
            const totalAngsuran = angsuranTransaksi.reduce((total, t) => total + t.jumlah, 0);
            const sisaPinjaman = Math.max(0, pinjaman.jumlah - totalAngsuran);
            
            // Try to parse tenor from keterangan
            let tenor = 12; // Default tenor
            if (pinjaman.keterangan) {
              const tenorMatch = pinjaman.keterangan.match(/Tenor: (\d+) bulan/);
              if (tenorMatch && tenorMatch[1]) {
                tenor = parseInt(tenorMatch[1]);
              }
            }
            
            setAngsuranInfo({
              angsuranKe,
              totalAngsuran,
              sisaPinjaman,
              tenor
            });
          }
        }
      } else {
        toast({
          title: "Data tidak ditemukan",
          description: `Angsuran dengan ID ${id} tidak ditemukan`,
          variant: "destructive",
        });
        navigate("/transaksi/angsuran");
      }
    }
    setLoading(false);
  }, [id, navigate, toast]);

  const handlePrintReceipt = () => {
    navigate(`/transaksi/${id}/cetak`);
  };
  
  const handleShowReceipt = () => {
    setIsReceiptOpen(true);
  };

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
      <Layout pageTitle="Detail Angsuran">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Memuat data...</p>
        </div>
      </Layout>
    );
  }

  if (!transaksi) {
    return (
      <Layout pageTitle="Detail Angsuran">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Data angsuran tidak ditemukan</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Detail Angsuran">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/transaksi/angsuran">
            <Button variant="outline" size="icon">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="page-title">Detail Angsuran</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShowReceipt}>
            <FileText size={16} className="mr-2" />
            Lihat Bukti
          </Button>
          <Button size="sm" onClick={handlePrintReceipt}>
            <Printer size={16} className="mr-2" />
            Cetak Bukti
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Transaksi Angsuran #{transaksi.id}</span>
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
                <h3 className="text-lg font-semibold mb-2">Informasi Angsuran</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Jenis Transaksi</p>
                    <p className="font-medium">
                      <span className="inline-block mt-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Angsuran
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jumlah Bayar</p>
                    <p className="font-medium">
                      {formatCurrency(transaksi.jumlah)}
                    </p>
                  </div>
                  
                  {angsuranInfo && (
                    <div>
                      <p className="text-sm text-muted-foreground">Angsuran Ke-</p>
                      <p className="font-medium">{angsuranInfo.angsuranKe} dari {angsuranInfo.tenor}</p>
                    </div>
                  )}
                </div>
              </div>

              {relatedPinjaman && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Informasi Pinjaman Terkait</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">ID Pinjaman</p>
                        <p className="font-medium">{relatedPinjaman.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Jumlah Pinjaman</p>
                        <p className="font-medium">{formatCurrency(relatedPinjaman.jumlah)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tanggal Pinjaman</p>
                        <p className="font-medium">{formatDate(relatedPinjaman.tanggal)}</p>
                      </div>
                      
                      {angsuranInfo && (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground">Total Terbayar</p>
                            <p className="font-medium">{formatCurrency(angsuranInfo.totalAngsuran)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Sisa Pinjaman</p>
                            <p className="font-medium">{formatCurrency(angsuranInfo.sisaPinjaman)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="font-medium">
                              {angsuranInfo.sisaPinjaman <= 0 ? (
                                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                  Lunas
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                  Belum Lunas
                                </span>
                              )}
                            </p>
                          </div>
                        </>
                      )}
                      
                      <div>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto"
                          onClick={() => navigate(`/transaksi/${relatedPinjaman.id}`)}
                        >
                          Lihat Detail Pinjaman
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}

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

              {transaksi.keterangan && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Keterangan</h3>
                    <p className="text-gray-700">{transaksi.keterangan}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Tambahan</CardTitle>
              <CardDescription>
                Detail transaksi angsuran
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
                {angsuranInfo && angsuranInfo.sisaPinjaman <= 0 && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-800">
                      Pinjaman telah lunas
                    </p>
                  </div>
                )}
                {angsuranInfo && angsuranInfo.sisaPinjaman > 0 && (
                  <div className="mt-4">
                    <Button
                      onClick={() => navigate("/transaksi/angsuran/tambah", {
                        state: { pinjamanId: relatedPinjaman?.id }
                      })}
                    >
                      Bayar Angsuran Berikutnya
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {transaksi && (
        <ReceiptDialog 
          open={isReceiptOpen} 
          onOpenChange={setIsReceiptOpen} 
          transaksi={transaksi} 
        />
      )}
    </Layout>
  );
}

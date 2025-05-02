
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Transaksi } from "@/types";
import { getTransaksiById, getAllTransaksi } from "@/services/transaksi";
import { getRemainingLoanAmount } from "@/services/transaksi/loanOperations";
import { calculateTotalSimpanan } from "@/services/transaksi/financialOperations";
import { createTransaksi } from "@/services/transaksi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, CheckCircle2, XCircle, CreditCard, Wallet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AngsuranListProps {
  pinjamanTransaksi: Transaksi[];
}

interface AngsuranDetail {
  nomorAngsuran: number;
  tanggalJatuhTempo: string;
  nominal: number;
  status: "Terbayar" | "Belum Terbayar";
  transaksiId?: string;
}

export function AngsuranList({ pinjamanTransaksi }: AngsuranListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPinjaman, setSelectedPinjaman] = useState<string>(
    pinjamanTransaksi.length > 0 ? pinjamanTransaksi[0].id : ""
  );
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [currentAngsuran, setCurrentAngsuran] = useState<AngsuranDetail | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate angsuran details for a specific loan
  const calculateAngsuran = (pinjamanId: string): AngsuranDetail[] => {
    const pinjaman = getTransaksiById(pinjamanId);
    if (!pinjaman) return [];

    const angsuranDetails: AngsuranDetail[] = [];
    const pinjamanDate = new Date(pinjaman.tanggal);
    let tenor = 12; // Default tenor
    let angsuranPerBulan = Math.ceil(pinjaman.jumlah / tenor);

    // Try to parse tenor and angsuran per bulan from keterangan
    if (pinjaman.keterangan) {
      const tenorMatch = pinjaman.keterangan.match(/Tenor: (\d+) bulan/);
      const angsuranMatch = pinjaman.keterangan.match(/Angsuran per bulan: Rp ([0-9,.]+)/);
      
      if (tenorMatch && tenorMatch[1]) {
        tenor = parseInt(tenorMatch[1]);
      }
      
      if (angsuranMatch && angsuranMatch[1]) {
        angsuranPerBulan = parseInt(angsuranMatch[1].replace(/[,.]/g, ""));
      }
    }

    // Get all angsuran transactions for this pinjaman
    const allTransaksi = getAllTransaksi();
    const angsuranTransaksi = allTransaksi.filter(
      (t) => 
        t.jenis === "Angsuran" && 
        t.status === "Sukses" && 
        t.keterangan && 
        t.keterangan.includes(pinjamanId)
    );

    // Generate angsuran schedule
    let totalTerbayar = 0;
    for (let i = 0; i < tenor; i++) {
      const jatuhTempoDate = new Date(pinjamanDate);
      jatuhTempoDate.setMonth(jatuhTempoDate.getMonth() + i + 1);
      
      // Find if this angsuran has been paid
      const relatedAngsuran = angsuranTransaksi.find(t => {
        const match = t.keterangan?.match(/Angsuran ke-(\d+)/);
        return match && parseInt(match[1]) === (i + 1);
      });

      totalTerbayar += relatedAngsuran ? relatedAngsuran.jumlah : 0;
      
      angsuranDetails.push({
        nomorAngsuran: i + 1,
        tanggalJatuhTempo: jatuhTempoDate.toISOString(),
        nominal: i === tenor - 1 ? (pinjaman.jumlah - totalTerbayar) : angsuranPerBulan,
        status: relatedAngsuran ? "Terbayar" : "Belum Terbayar",
        transaksiId: relatedAngsuran?.id
      });
    }
    
    return angsuranDetails;
  };

  const handleBayarAngsuran = (pinjamanId: string) => {
    navigate("/transaksi/angsuran/tambah", { state: { pinjamanId } });
  };

  const handlePayWithSimpanan = (angsuran: AngsuranDetail) => {
    setCurrentAngsuran(angsuran);
    setIsPaymentDialogOpen(true);
  };

  const processPaymentWithSimpanan = async () => {
    if (!currentAngsuran || !selectedPinjaman) return;

    setIsProcessing(true);

    try {
      const pinjaman = getTransaksiById(selectedPinjaman);
      if (!pinjaman) throw new Error("Pinjaman tidak ditemukan");

      // Get anggota's simpanan balance
      const simpananBalance = calculateTotalSimpanan(pinjaman.anggotaId);

      // Check if balance is sufficient
      if (simpananBalance < currentAngsuran.nominal) {
        toast({
          title: "Saldo Simpanan Tidak Cukup",
          description: `Saldo simpanan anggota (Rp ${simpananBalance.toLocaleString("id-ID")}) tidak cukup untuk membayar angsuran (Rp ${currentAngsuran.nominal.toLocaleString("id-ID")})`,
          variant: "destructive",
        });
        setIsProcessing(false);
        setIsPaymentDialogOpen(false);
        return;
      }

      // Create angsuran transaction
      const keteranganPinjaman = `Angsuran ke-${currentAngsuran.nomorAngsuran} untuk pinjaman #${selectedPinjaman}`;
      
      const angsuranTransaksi = createTransaksi({
        tanggal: new Date().toISOString().split('T')[0],
        anggotaId: pinjaman.anggotaId,
        jenis: "Angsuran",
        jumlah: currentAngsuran.nominal,
        keterangan: `${keteranganPinjaman} (Dibayar dari simpanan)`,
        status: "Sukses"
      });

      // Create simpanan withdraw transaction
      const simpananTransaksi = createTransaksi({
        tanggal: new Date().toISOString().split('T')[0],
        anggotaId: pinjaman.anggotaId,
        jenis: "Simpan",
        jumlah: -currentAngsuran.nominal, // Negative for withdrawal
        keterangan: `Penarikan simpanan untuk ${keteranganPinjaman}`,
        status: "Sukses"
      });

      if (angsuranTransaksi && simpananTransaksi) {
        toast({
          title: "Pembayaran Berhasil",
          description: `Angsuran berhasil dibayarkan dari saldo simpanan anggota.`,
        });
      } else {
        throw new Error("Gagal menyimpan transaksi");
      }

    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: error instanceof Error ? error.message : "Gagal memproses pembayaran",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsPaymentDialogOpen(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  if (pinjamanTransaksi.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Riwayat Angsuran</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Anggota ini tidak memiliki pinjaman aktif.</p>
        </CardContent>
      </Card>
    );
  }

  const angsuranDetails = selectedPinjaman 
    ? calculateAngsuran(selectedPinjaman) 
    : [];
  
  const selectedLoan = getTransaksiById(selectedPinjaman);
  const remainingAmount = selectedPinjaman 
    ? getRemainingLoanAmount(selectedPinjaman) 
    : 0;
  
  // Calculate simpanan balance for payment option
  const simpananBalance = selectedLoan ? calculateTotalSimpanan(selectedLoan.anggotaId) : 0;

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Riwayat Angsuran</CardTitle>
      </CardHeader>
      <CardContent>
        {pinjamanTransaksi.length > 1 ? (
          <Tabs 
            defaultValue={selectedPinjaman} 
            onValueChange={setSelectedPinjaman} 
            className="mb-4"
          >
            <TabsList>
              {pinjamanTransaksi.map((pinjaman) => (
                <TabsTrigger key={pinjaman.id} value={pinjaman.id}>
                  {pinjaman.id} ({formatDate(pinjaman.tanggal)})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : null}

        {selectedLoan && (
          <div className="bg-muted/50 p-4 rounded-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Pinjaman</p>
                <p className="font-medium">Rp {selectedLoan.jumlah.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sisa Pinjaman</p>
                <p className="font-medium">Rp {remainingAmount.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Pinjam</p>
                <p className="font-medium">{formatDate(selectedLoan.tanggal)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo Simpanan</p>
                <p className="font-medium">Rp {simpananBalance.toLocaleString("id-ID")}</p>
              </div>
            </div>
            {remainingAmount > 0 && (
              <div className="mt-4">
                <Button
                  onClick={() => handleBayarAngsuran(selectedPinjaman)}
                  size="sm"
                  className="mr-2"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Bayar Angsuran
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {angsuranDetails.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    Tidak ada data angsuran yang ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                angsuranDetails.map((item) => (
                  <TableRow key={`angsuran-${item.nomorAngsuran}`}>
                    <TableCell>{item.nomorAngsuran}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Calendar size={16} className="text-muted-foreground" />
                      {formatDate(item.tanggalJatuhTempo)}
                    </TableCell>
                    <TableCell>Rp {item.nominal.toLocaleString("id-ID")}</TableCell>
                    <TableCell>
                      {item.status === "Terbayar" ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 size={16} className="text-green-600" />
                          <Badge variant="success">Terbayar</Badge>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <XCircle size={16} className="text-amber-600" />
                          <Badge variant="outline">Belum Terbayar</Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.status === "Terbayar" && item.transaksiId ? (
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto"
                          onClick={() => navigate(`/transaksi/${item.transaksiId}`)}
                        >
                          Lihat Detail
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="link" 
                            size="sm"
                            className="p-0 h-auto"
                            onClick={() => handleBayarAngsuran(selectedPinjaman)}
                            disabled={item.nomorAngsuran !== angsuranDetails.find(a => a.status === "Belum Terbayar")?.nomorAngsuran}
                          >
                            Bayar Manual
                          </Button>
                          <Button 
                            variant="link" 
                            size="sm"
                            className="p-0 h-auto text-emerald-600"
                            onClick={() => handlePayWithSimpanan(item)}
                            disabled={
                              item.nomorAngsuran !== angsuranDetails.find(a => a.status === "Belum Terbayar")?.nomorAngsuran ||
                              simpananBalance < item.nominal
                            }
                          >
                            Bayar dari Simpanan
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Payment Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Pembayaran dengan Simpanan</DialogTitle>
              <DialogDescription>
                Anda akan membayar angsuran dengan mengurangi saldo simpanan anggota.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Jumlah Angsuran:</span>
                <span className="font-medium">Rp {currentAngsuran?.nominal.toLocaleString("id-ID")}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Saldo Simpanan:</span>
                <span className="font-medium">Rp {simpananBalance.toLocaleString("id-ID")}</span>
              </div>
              
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-medium">Sisa Simpanan:</span>
                <span className="font-bold">
                  Rp {(simpananBalance - (currentAngsuran?.nominal || 0)).toLocaleString("id-ID")}
                </span>
              </div>
              
              {simpananBalance < (currentAngsuran?.nominal || 0) && (
                <div className="text-destructive text-sm font-medium">
                  Saldo simpanan tidak mencukupi untuk pembayaran ini
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                onClick={processPaymentWithSimpanan}
                disabled={isProcessing || simpananBalance < (currentAngsuran?.nominal || 0)}
                className="gap-2"
              >
                <Wallet size={16} />
                {isProcessing ? "Memproses..." : "Konfirmasi Pembayaran"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

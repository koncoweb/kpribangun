
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
import { Transaksi } from "@/types";
import { getTransaksiById, getAllTransaksi } from "@/services/transaksi";
import { getRemainingLoanAmount } from "@/services/transaksi/loanOperations";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";

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
  const [selectedPinjaman, setSelectedPinjaman] = useState<string>(
    pinjamanTransaksi.length > 0 ? pinjamanTransaksi[0].id : ""
  );

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
            {remainingAmount > 0 && (
              <div className="mt-4">
                <Button
                  onClick={() => handleBayarAngsuran(selectedPinjaman)}
                  size="sm"
                >
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
                        <Button 
                          variant="link" 
                          size="sm"
                          className="p-0 h-auto"
                          onClick={() => handleBayarAngsuran(selectedPinjaman)}
                          disabled={item.nomorAngsuran !== angsuranDetails.find(a => a.status === "Belum Terbayar")?.nomorAngsuran}
                        >
                          Bayar Sekarang
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

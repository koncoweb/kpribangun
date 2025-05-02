
import { useNavigate } from "react-router-dom";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AngsuranDetail } from "./types";
import { formatDate } from "./utils";

interface AngsuranTableProps {
  angsuranDetails: AngsuranDetail[];
  selectedPinjaman: string;
  onBayarAngsuran: (pinjamanId: string) => void;
  onPayWithSimpanan: (angsuran: AngsuranDetail) => void;
  simpananBalance: number;
}

export function AngsuranTable({
  angsuranDetails,
  selectedPinjaman,
  onBayarAngsuran,
  onPayWithSimpanan,
  simpananBalance,
}: AngsuranTableProps) {
  const navigate = useNavigate();

  return (
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
                        onClick={() => onBayarAngsuran(selectedPinjaman)}
                        disabled={item.nomorAngsuran !== angsuranDetails.find(a => a.status === "Belum Terbayar")?.nomorAngsuran}
                      >
                        Bayar Manual
                      </Button>
                      <Button 
                        variant="link" 
                        size="sm"
                        className="p-0 h-auto text-emerald-600"
                        onClick={() => onPayWithSimpanan(item)}
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
  );
}

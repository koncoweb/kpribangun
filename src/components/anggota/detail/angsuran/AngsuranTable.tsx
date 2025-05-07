
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import { AngsuranDetailItem } from "./types";

interface AngsuranTableProps {
  angsuranDetails: AngsuranDetailItem[];
  selectedPinjaman: string;
  onBayarAngsuran: (pinjamanId: string) => void;
  onPayWithSimpanan: (angsuran: AngsuranDetailItem) => void;
  simpananBalance: number;
  disableSelfPayment?: boolean;
}

export function AngsuranTable({
  angsuranDetails,
  selectedPinjaman,
  onBayarAngsuran,
  onPayWithSimpanan,
  simpananBalance,
  disableSelfPayment = false,
}: AngsuranTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  if (!angsuranDetails || angsuranDetails.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Tidak ada data angsuran untuk pinjaman ini</p>
      </div>
    );
  }

  // Get the first unpaid installment
  const unpaidInstallment = angsuranDetails.find(
    (item) => item.status === "belum-bayar" || item.status === "terlambat"
  );

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Daftar Angsuran</h3>
        
        {!disableSelfPayment && unpaidInstallment && (
          <Button 
            onClick={() => onBayarAngsuran(selectedPinjaman)}
            size="sm"
            variant="outline"
          >
            Bayar Angsuran
          </Button>
        )}
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Angsuran Ke</TableHead>
              <TableHead>Jatuh Tempo</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Bayar</TableHead>
              <TableHead>Petugas</TableHead>
              {!disableSelfPayment && <TableHead className="text-right">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {angsuranDetails.map((angsuran, index) => {
              const isLate = angsuran.status === "terlambat";
              const isPaid = angsuran.status === "lunas";
              const isDue = angsuran.status === "belum-bayar";
              const statusColor = isPaid ? "success" : isLate ? "destructive" : "warning";
              
              return (
                <TableRow 
                  key={index}
                  className={isLate ? "bg-red-50" : ""}
                >
                  <TableCell>{angsuran.angsuranKe}</TableCell>
                  <TableCell>
                    {angsuran.jatuhTempo ? formatDate(angsuran.jatuhTempo) : "-"}
                  </TableCell>
                  <TableCell>
                    {angsuran.jumlah !== undefined && angsuran.jumlah !== null 
                      ? `Rp ${angsuran.jumlah.toLocaleString("id-ID")}`
                      : "Rp 0"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColor} className="gap-1 items-center">
                      {isPaid ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : isLate ? (
                        <XCircle className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {isPaid ? "Lunas" : isLate ? "Terlambat" : "Belum Bayar"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isPaid && angsuran.tanggalBayar
                      ? formatDate(angsuran.tanggalBayar)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {isPaid && angsuran.petugas ? angsuran.petugas : "-"}
                  </TableCell>
                  {!disableSelfPayment && (
                    <TableCell className="text-right">
                      {!isPaid && 
                       simpananBalance !== undefined && 
                       angsuran.jumlah !== undefined &&
                       simpananBalance >= angsuran.jumlah && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onPayWithSimpanan(angsuran)}
                        >
                          Bayar dari Simpanan
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaksi } from "@/types";
import { AlertTriangle } from "lucide-react";

interface TunggakanTableProps {
  tunggakan: {
    transaksi: Transaksi;
    jatuhTempo: string;
    daysOverdue: number;
    penalty: number;
  }[];
}

export function TunggakanTable({ tunggakan }: TunggakanTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tanggal Pinjam</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Jatuh Tempo</TableHead>
            <TableHead>Keterlambatan</TableHead>
            <TableHead>Denda</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tunggakan.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                <div className="flex flex-col items-center justify-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-gray-400" />
                  <p>Tidak ada pinjaman yang menunggak</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            tunggakan.map((item) => (
              <TableRow key={item.transaksi.id}>
                <TableCell className="font-medium">{item.transaksi.id}</TableCell>
                <TableCell>{formatDate(item.transaksi.tanggal)}</TableCell>
                <TableCell>Rp {item.transaksi.jumlah.toLocaleString("id-ID")}</TableCell>
                <TableCell>{formatDate(item.jatuhTempo)}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800`}>
                    {item.daysOverdue} hari
                  </span>
                </TableCell>
                <TableCell>Rp {item.penalty.toLocaleString("id-ID")}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

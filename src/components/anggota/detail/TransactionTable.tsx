
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaksi } from "@/types";

interface TransactionTableProps {
  transaksi: Transaksi[];
}

export function TransactionTable({ transaksi }: TransactionTableProps) {
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
            <TableHead>Tanggal</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transaksi.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                Tidak ada data transaksi yang ditemukan
              </TableCell>
            </TableRow>
          ) : (
            transaksi.map((tr) => (
              <TableRow key={tr.id}>
                <TableCell className="font-medium">{tr.id}</TableCell>
                <TableCell>{formatDate(tr.tanggal)}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    tr.jenis === "Simpan" ? "bg-green-100 text-green-800" : 
                    tr.jenis === "Pinjam" ? "bg-amber-100 text-amber-800" : 
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {tr.jenis}
                  </span>
                </TableCell>
                <TableCell>Rp {tr.jumlah.toLocaleString("id-ID")}</TableCell>
                <TableCell>{tr.keterangan || "-"}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    tr.status === "Sukses" ? "bg-green-100 text-green-800" : 
                    tr.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                    "bg-red-100 text-red-800"
                  }`}>
                    {tr.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

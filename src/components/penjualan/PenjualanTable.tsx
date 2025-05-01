
import { Penjualan } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Receipt, Trash } from "lucide-react";
import { formatRupiah, formatDateTime } from "@/lib/utils";

interface PenjualanTableProps {
  penjualanList: Penjualan[];
  getKasirName: (kasirId: string) => string;
  onViewDetail: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export function PenjualanTable({
  penjualanList,
  getKasirName,
  onViewDetail,
  onDeleteClick
}: PenjualanTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No Transaksi</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Kasir</TableHead>
            <TableHead>Total Item</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Metode Pembayaran</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Opsi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {penjualanList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                Tidak ada data transaksi yang ditemukan
              </TableCell>
            </TableRow>
          ) : (
            penjualanList.map((penjualan) => (
              <TableRow key={penjualan.id}>
                <TableCell className="font-medium">{penjualan.nomorTransaksi}</TableCell>
                <TableCell>{formatDateTime(penjualan.tanggal)}</TableCell>
                <TableCell>{getKasirName(penjualan.kasirId)}</TableCell>
                <TableCell>{penjualan.items.reduce((sum, item) => sum + item.jumlah, 0)} items</TableCell>
                <TableCell>{formatRupiah(penjualan.total)}</TableCell>
                <TableCell>
                  {penjualan.metodePembayaran === "cash" ? "Tunai" :
                  penjualan.metodePembayaran === "debit" ? "Debit" :
                  penjualan.metodePembayaran === "kredit" ? "Kartu Kredit" : "QRIS"}
                </TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    penjualan.status === "sukses" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {penjualan.status === "sukses" ? "Sukses" : "Dibatalkan"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => onViewDetail(penjualan.id)}
                        className="flex items-center gap-2"
                      >
                        <Receipt size={16} /> Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteClick(penjualan.id)}
                        className="flex items-center gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash size={16} /> Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

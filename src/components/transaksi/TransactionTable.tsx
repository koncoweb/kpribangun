
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
import { FileText, Trash } from "lucide-react";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { formatRupiah } from "@/lib/utils";

interface TransactionTableProps {
  transactions: Penjualan[];
  formatPaymentMethod: (method: string) => string;
  onViewTransaction: (id: string) => void;
  onCancelTransaction: (id: string) => void;
  onDeleteTransaction: (id: string) => void;
}

export function TransactionTable({
  transactions,
  formatPaymentMethod,
  onViewTransaction,
  onCancelTransaction,
  onDeleteTransaction,
}: TransactionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nomor Transaksi</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Pembayaran</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10">
              Tidak ada data transaksi yang ditemukan
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.nomorTransaksi}</TableCell>
              <TableCell>
                {new Date(transaction.tanggal).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </TableCell>
              <TableCell>{formatRupiah(transaction.total)}</TableCell>
              <TableCell>{formatPaymentMethod(transaction.metodePembayaran)}</TableCell>
              <TableCell>
                <TransactionStatusBadge status={transaction.status} />
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onViewTransaction(transaction.id)}
                >
                  <FileText className="h-4 w-4 mr-1" /> Detail
                </Button>
                {transaction.status === "sukses" && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onCancelTransaction(transaction.id)}
                  >
                    Batalkan
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDeleteTransaction(transaction.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}


import React from 'react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PemasukanPengeluaran } from '@/types';
import { 
  Eye, 
  Pencil, 
  Trash2,
  FileUp,
  FileDown
} from 'lucide-react';

interface TransaksiTableProps {
  data: PemasukanPengeluaran[];
  onView?: (transaction: PemasukanPengeluaran) => void;
  onEdit?: (transaction: PemasukanPengeluaran) => void;
  onDelete?: (transaction: PemasukanPengeluaran) => void;
}

export default function TransaksiTable({ 
  data, 
  onView,
  onEdit,
  onDelete
}: TransaksiTableProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Belum ada data transaksi
                </TableCell>
              </TableRow>
            ) : (
              data.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>
                    {format(new Date(transaction.tanggal), 'dd MMM yyyy', { locale: idLocale })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.jenis === 'Pemasukan' ? 'success' : 'destructive'}>
                      {transaction.jenis === 'Pemasukan' ? (
                        <FileUp className="h-3 w-3 mr-1" />
                      ) : (
                        <FileDown className="h-3 w-3 mr-1" />
                      )}
                      {transaction.jenis}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.kategori}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(transaction.jumlah)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {transaction.keterangan || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {onView && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onView(transaction)}
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onEdit(transaction)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onDelete(transaction)}
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { PemasukanPengeluaran } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { FileUp, FileDown } from 'lucide-react';

interface TransaksiDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PemasukanPengeluaran | null;
}

export function TransaksiDetailDialog({
  isOpen,
  onClose,
  transaction
}: TransaksiDetailDialogProps) {
  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detail Transaksi</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">ID Transaksi:</span>
              <span>{transaction.id}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Jenis:</span>
              <Badge variant={transaction.jenis === 'Pemasukan' ? 'success' : 'destructive'}>
                {transaction.jenis === 'Pemasukan' ? (
                  <FileUp className="h-3 w-3 mr-1" />
                ) : (
                  <FileDown className="h-3 w-3 mr-1" />
                )}
                {transaction.jenis}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Tanggal:</span>
              <span>{format(new Date(transaction.tanggal), 'PPPP', { locale: id })}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Kategori:</span>
              <span>{transaction.kategori}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Jumlah:</span>
              <span className="font-semibold">{formatCurrency(transaction.jumlah)}</span>
            </div>
            
            <div className="border-t pt-2">
              <span className="font-medium">Keterangan:</span>
              <p className="mt-1 text-sm">{transaction.keterangan}</p>
            </div>
            
            {transaction.bukti && (
              <div className="border-t pt-2">
                <span className="font-medium">Bukti Transaksi:</span>
                <div className="mt-2">
                  {transaction.bukti.startsWith('data:image') ? (
                    <img src={transaction.bukti} alt="Bukti transaksi" className="max-w-full h-auto rounded-md" />
                  ) : (
                    <div className="p-4 border rounded-md bg-slate-100 text-sm">
                      Dokumen tersedia
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="border-t pt-2 text-xs text-muted-foreground">
              <div>Dibuat: {format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm')}</div>
              <div>Diperbarui: {format(new Date(transaction.updatedAt), 'dd/MM/yyyy HH:mm')}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

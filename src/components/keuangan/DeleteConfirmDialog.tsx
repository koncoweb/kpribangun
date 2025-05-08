
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PemasukanPengeluaran } from '@/types';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: PemasukanPengeluaran | null;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  transaction
}: DeleteConfirmDialogProps) {
  if (!transaction) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Transaksi</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus transaksi {transaction.jenis.toLowerCase()} ini?
            <br /><br />
            <strong>ID:</strong> {transaction.id}<br />
            <strong>Kategori:</strong> {transaction.kategori}<br />
            <strong>Tanggal:</strong> {new Date(transaction.tanggal).toLocaleDateString('id-ID')}
            <br /><br />
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground">
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

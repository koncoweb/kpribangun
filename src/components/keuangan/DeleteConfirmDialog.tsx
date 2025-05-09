
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
} from "@/components/ui/alert-dialog";
import { PemasukanPengeluaran } from '@/types';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction?: PemasukanPengeluaran | null;
  itemName?: string;
  itemType?: string;
}

export function DeleteConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  transaction, 
  itemName,
  itemType = "transaksi"
}: DeleteConfirmDialogProps) {
  // Get the name to display
  const displayName = transaction?.kategori || itemName || "item";
  const jenisLabel = transaction?.jenis === "Pemasukan" ? "pemasukan" : "pengeluaran";
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Konfirmasi Hapus {transaction?.jenis || itemType}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus {jenisLabel} <strong>"{displayName}"</strong>? <br />
            {transaction && <span className="text-sm">ID: {transaction.id}</span>}<br />
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-red-500 hover:bg-red-600"
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

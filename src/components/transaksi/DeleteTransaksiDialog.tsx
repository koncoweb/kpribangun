
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
import { Transaksi } from "@/types";

interface DeleteTransaksiDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaksi?: Transaksi | null;
}

export function DeleteTransaksiDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  transaksi 
}: DeleteTransaksiDialogProps) {
  // Get transaction type in Indonesian
  const getTransaksiType = (jenis: string | undefined) => {
    switch(jenis) {
      case "Simpan": return "simpanan";
      case "Pinjam": return "pinjaman";
      case "Angsuran": return "angsuran";
      default: return "transaksi";
    }
  };
  
  const transaksiType = transaksi ? getTransaksiType(transaksi.jenis) : "transaksi";
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Konfirmasi Hapus {transaksi?.jenis || "Transaksi"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus {transaksiType} <strong>{transaksi?.id}</strong>? <br />
            {transaksi && <span className="text-sm">Nama anggota: {transaksi.anggotaNama}</span>}<br />
            {transaksi && <span className="text-sm">Jumlah: Rp {transaksi.jumlah.toLocaleString("id-ID")}</span>}<br />
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-red-500 hover:bg-red-600"
            onClick={onConfirm}
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

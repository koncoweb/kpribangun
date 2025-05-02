
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Wallet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AngsuranDetail } from "./types";
import { getTransaksiById, createTransaksi } from "@/services/transaksi";

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentAngsuran: AngsuranDetail | null;
  selectedPinjaman: string;
  simpananBalance: number;
  onPaymentComplete: () => void;
}

export function PaymentDialog({
  isOpen,
  onOpenChange,
  currentAngsuran,
  selectedPinjaman,
  simpananBalance,
  onPaymentComplete,
}: PaymentDialogProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const processPaymentWithSimpanan = async () => {
    if (!currentAngsuran || !selectedPinjaman) return;

    setIsProcessing(true);

    try {
      const pinjaman = getTransaksiById(selectedPinjaman);
      if (!pinjaman) throw new Error("Pinjaman tidak ditemukan");

      // Check if balance is sufficient
      if (simpananBalance < currentAngsuran.nominal) {
        toast({
          title: "Saldo Simpanan Tidak Cukup",
          description: `Saldo simpanan anggota (Rp ${simpananBalance.toLocaleString("id-ID")}) tidak cukup untuk membayar angsuran (Rp ${currentAngsuran.nominal.toLocaleString("id-ID")})`,
          variant: "destructive",
        });
        setIsProcessing(false);
        onOpenChange(false);
        return;
      }

      // Create angsuran transaction
      const keteranganPinjaman = `Angsuran ke-${currentAngsuran.nomorAngsuran} untuk pinjaman #${selectedPinjaman}`;
      
      const angsuranTransaksi = createTransaksi({
        tanggal: new Date().toISOString().split('T')[0],
        anggotaId: pinjaman.anggotaId,
        jenis: "Angsuran",
        jumlah: currentAngsuran.nominal,
        keterangan: `${keteranganPinjaman} (Dibayar dari simpanan)`,
        status: "Sukses"
      });

      // Create simpanan withdraw transaction
      const simpananTransaksi = createTransaksi({
        tanggal: new Date().toISOString().split('T')[0],
        anggotaId: pinjaman.anggotaId,
        jenis: "Simpan",
        jumlah: -currentAngsuran.nominal, // Negative for withdrawal
        keterangan: `Penarikan simpanan untuk ${keteranganPinjaman}`,
        status: "Sukses"
      });

      if (angsuranTransaksi && simpananTransaksi) {
        toast({
          title: "Pembayaran Berhasil",
          description: `Angsuran berhasil dibayarkan dari saldo simpanan anggota.`,
        });
        onPaymentComplete();
      } else {
        throw new Error("Gagal menyimpan transaksi");
      }

    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: error instanceof Error ? error.message : "Gagal memproses pembayaran",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Pembayaran dengan Simpanan</DialogTitle>
          <DialogDescription>
            Anda akan membayar angsuran dengan mengurangi saldo simpanan anggota.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Jumlah Angsuran:</span>
            <span className="font-medium">Rp {currentAngsuran?.nominal.toLocaleString("id-ID")}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Saldo Simpanan:</span>
            <span className="font-medium">Rp {simpananBalance.toLocaleString("id-ID")}</span>
          </div>
          
          <div className="flex justify-between items-center border-t pt-2">
            <span className="font-medium">Sisa Simpanan:</span>
            <span className="font-bold">
              Rp {(simpananBalance - (currentAngsuran?.nominal || 0)).toLocaleString("id-ID")}
            </span>
          </div>
          
          {simpananBalance < (currentAngsuran?.nominal || 0) && (
            <div className="text-destructive text-sm font-medium">
              Saldo simpanan tidak mencukupi untuk pembayaran ini
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button 
            onClick={processPaymentWithSimpanan}
            disabled={isProcessing || simpananBalance < (currentAngsuran?.nominal || 0)}
            className="gap-2"
          >
            <Wallet size={16} />
            {isProcessing ? "Memproses..." : "Konfirmasi Pembayaran"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

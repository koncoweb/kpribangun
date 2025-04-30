
import { Check, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatRupiah } from "@/lib/utils";
import { Penjualan } from "@/types";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Penjualan | null;
}

export function SuccessDialog({ open, onOpenChange, sale }: SuccessDialogProps) {
  if (!sale) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <Check className="h-5 w-5" /> Pembayaran Berhasil
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="py-3 rounded-lg bg-muted">
            <div className="flex justify-center">
              <Receipt className="h-10 w-10 text-primary" />
            </div>
            <p className="text-center font-bold mt-2">{sale.nomorTransaksi}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Pembayaran</span>
              <span className="font-bold">{formatRupiah(sale.total)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Metode Pembayaran</span>
              <span>
                {sale.metodePembayaran === "cash" ? "Tunai" : 
                 sale.metodePembayaran === "debit" ? "Debit" :
                 sale.metodePembayaran === "kredit" ? "Kartu Kredit" : "QRIS"}
              </span>
            </div>
            
            {sale.metodePembayaran === "cash" && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dibayar</span>
                  <span>{formatRupiah(sale.dibayar)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kembalian</span>
                  <span>{formatRupiah(sale.kembalian)}</span>
                </div>
              </>
            )}
          </div>
          
          <div className="pt-3 border-t">
            <p className="text-center text-muted-foreground text-sm">
              Transaksi telah disimpan dan stok telah diperbarui
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            className="w-full" 
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

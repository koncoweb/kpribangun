
import { Check, Printer, Download, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatRupiah, formatDateTime } from "@/lib/utils";
import { Penjualan } from "@/types";
import { useState, useRef } from "react";
import { getProdukItemById } from "@/services/produk";
import { getKasirById } from "@/services/kasirService";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Penjualan | null;
}

export function SuccessDialog({ open, onOpenChange, sale }: SuccessDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  
  if (!sale) return null;
  
  const kasir = getKasirById(sale.kasirId);
  const kasirName = kasir ? kasir.nama : "Unknown";
  
  const handlePrint = useReactToPrint({
    documentTitle: `Receipt-${sale.nomorTransaksi}`,
    onAfterPrint: () => {
      console.log("Print completed");
    },
    // Instead of using content property, use this proper approach for React 18+
    contentRef: receiptRef
  });
  
  const handleDownload = async () => {
    if (!receiptRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Receipt-${sale.nomorTransaksi}.png`;
      link.click();
    } catch (error) {
      console.error("Error generating receipt image:", error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <Check className="h-5 w-5" /> Pembayaran Berhasil
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div 
            ref={receiptRef} 
            className="p-4 bg-white border rounded-lg shadow-sm max-h-[70vh] overflow-y-auto"
          >
            {/* Receipt Header */}
            <div className="text-center border-b pb-3">
              <h2 className="font-bold text-lg">Koperasi Sejahtera</h2>
              <p className="text-sm text-muted-foreground">Jl. Raya Utama No. 123, Jakarta</p>
              <p className="text-sm text-muted-foreground">Telp: 021-1234567</p>
            </div>
            
            {/* Transaction Info */}
            <div className="border-b py-2">
              <div className="flex justify-between text-sm">
                <span>No. Transaksi</span>
                <span className="font-medium">{sale.nomorTransaksi}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tanggal & Waktu</span>
                <span>{formatDateTime(sale.tanggal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Kasir</span>
                <span>{kasirName}</span>
              </div>
            </div>
            
            {/* Items */}
            <div className="border-b py-2">
              <p className="font-medium text-sm mb-1">Rincian Pembelian:</p>
              <div className="space-y-1">
                {sale.items.map((item, index) => {
                  const product = getProdukItemById(item.produkId);
                  return (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between">
                        <span>{product?.nama || "Product"}</span>
                        <span>{formatRupiah(item.total)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground pl-2">
                        {item.jumlah} x {formatRupiah(item.hargaSatuan)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Summary */}
            <div className="border-b py-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatRupiah(sale.subtotal)}</span>
              </div>
              
              {sale.diskon > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Diskon ({sale.diskon}%)</span>
                  <span>-{formatRupiah((sale.subtotal * sale.diskon) / 100)}</span>
                </div>
              )}
              
              {sale.pajak > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Pajak ({sale.pajak}%)</span>
                  <span>{formatRupiah((sale.subtotal * (1 - sale.diskon / 100) * sale.pajak) / 100)}</span>
                </div>
              )}
            </div>
            
            {/* Total */}
            <div className="border-b py-2">
              <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>{formatRupiah(sale.total)}</span>
              </div>
              
              {sale.metodePembayaran === "cash" && (
                <>
                  <div className="flex justify-between text-sm">
                    <span>Tunai</span>
                    <span>{formatRupiah(sale.dibayar)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Kembalian</span>
                    <span>{formatRupiah(sale.kembalian)}</span>
                  </div>
                </>
              )}
            </div>
            
            {/* Footer */}
            <div className="pt-3 text-center">
              <p className="text-sm font-medium">
                Metode Pembayaran: {" "}
                {sale.metodePembayaran === "cash" ? "TUNAI" :
                 sale.metodePembayaran === "debit" ? "KARTU DEBIT" :
                 sale.metodePembayaran === "kredit" ? "KARTU KREDIT" : "QRIS"}
              </p>
              <div className="text-xs text-muted-foreground mt-3">
                <p>Terima Kasih Atas Kunjungan Anda</p>
                <p>Barang yang sudah dibeli tidak dapat dikembalikan</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            className="w-full sm:w-auto gap-2" 
            variant="outline"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button 
            className="w-full sm:w-auto gap-2" 
            variant="outline"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download className="h-4 w-4" /> {isDownloading ? "Processing..." : "Download"}
          </Button>
          <Button 
            className="w-full sm:w-auto" 
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

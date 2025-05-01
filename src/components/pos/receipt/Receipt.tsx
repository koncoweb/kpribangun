
import { formatRupiah, formatDateTime } from "@/lib/utils";
import { getProdukItemById } from "@/services/produk";
import { Penjualan } from "@/types";
import React from "react";
import { Receipt as ReceiptIcon, Check } from "lucide-react";

interface ReceiptProps {
  sale: Penjualan;
  kasirName: string;
}

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(
  ({ sale, kasirName }, ref) => {
    return (
      <div 
        ref={ref} 
        className="p-4 bg-white border rounded-lg shadow-sm max-h-[70vh] overflow-y-auto"
      >
        {/* Receipt Header */}
        <div className="text-center mb-4">
          <div className="mb-2 flex justify-center">
            <div className="bg-green-100 rounded-full p-2">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h2 className="font-bold text-lg">Koperasi Sejahtera</h2>
          <p className="text-sm text-muted-foreground">Jl. Raya Utama No. 123, Jakarta</p>
          <p className="text-sm text-muted-foreground">Telp: 021-1234567</p>
        </div>
        
        {/* Transaction Info */}
        <div className="border-t border-b py-3 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">No. Transaksi</span>
            <span className="font-medium">{sale.nomorTransaksi}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tanggal & Waktu</span>
            <span>{formatDateTime(sale.tanggal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Kasir</span>
            <span>{kasirName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Metode Pembayaran</span>
            <span className="font-medium">
              {sale.metodePembayaran === "cash" ? "TUNAI" :
               sale.metodePembayaran === "debit" ? "KARTU DEBIT" :
               sale.metodePembayaran === "kredit" ? "KARTU KREDIT" : "QRIS"}
            </span>
          </div>
        </div>
        
        {/* Items */}
        <div className="mb-3">
          <p className="font-medium text-sm mb-2">Rincian Pembelian:</p>
          <div className="space-y-2">
            {sale.items.map((item, index) => {
              const product = getProdukItemById(item.produkId);
              return (
                <div key={index} className="flex justify-between items-start text-sm">
                  <div className="flex-1">
                    <div className="font-medium">{product?.nama || "Product"}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.jumlah} x {formatRupiah(item.hargaSatuan)}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    {formatRupiah(item.total)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Summary */}
        <div className="border-t border-dashed py-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatRupiah(sale.subtotal)}</span>
          </div>
          
          {sale.diskon > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Diskon ({sale.diskon}%)</span>
              <span>-{formatRupiah((sale.subtotal * sale.diskon) / 100)}</span>
            </div>
          )}
          
          {sale.pajak > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pajak ({sale.pajak}%)</span>
              <span>{formatRupiah((sale.subtotal * (1 - sale.diskon / 100) * sale.pajak) / 100)}</span>
            </div>
          )}
        </div>
        
        {/* Total */}
        <div className="border-t mt-2 pt-2">
          <div className="flex justify-between font-bold">
            <span>TOTAL</span>
            <span>{formatRupiah(sale.total)}</span>
          </div>
          
          {sale.metodePembayaran === "cash" && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tunai</span>
                <span>{formatRupiah(sale.dibayar)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kembalian</span>
                <span>{formatRupiah(sale.kembalian)}</span>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <ReceiptIcon className="h-4 w-4 text-muted-foreground mr-1" />
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>Terima Kasih Atas Kunjungan Anda</p>
            <p className="text-xs mt-1">Barang yang sudah dibeli tidak dapat dikembalikan</p>
          </div>
        </div>
      </div>
    );
  }
);

Receipt.displayName = "Receipt";

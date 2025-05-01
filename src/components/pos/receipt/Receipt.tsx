
import { formatRupiah, formatDateTime } from "@/lib/utils";
import { getProdukItemById } from "@/services/produk";
import { Penjualan } from "@/types";
import React from "react";

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
    );
  }
);

Receipt.displayName = "Receipt";

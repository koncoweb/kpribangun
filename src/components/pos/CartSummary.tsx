
import { useState } from "react";
import { PenjualanItem, Kasir } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRupiah } from "@/lib/utils";
import {
  CreditCard,
  Wallet,
  Receipt,
  QrCode,
  ArrowRight,
  Loader2
} from "lucide-react";

interface CartSummaryProps {
  items: PenjualanItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  onCheckout: (data: {
    kasirId: string;
    metodePembayaran: "cash" | "debit" | "kredit" | "qris";
    dibayar: number;
    kembalian: number;
    catatan: string;
  }) => void;
  kasirList: Kasir[];
  processing: boolean;
}

export function CartSummary({
  items,
  subtotal,
  tax,
  discount,
  total,
  onCheckout,
  kasirList,
  processing
}: CartSummaryProps) {
  const [kasirId, setKasirId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "debit" | "kredit" | "qris">("cash");
  const [amountPaid, setAmountPaid] = useState(total);
  const [notes, setNotes] = useState("");
  
  const change = amountPaid - total;
  
  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountPaid(parseFloat(e.target.value) || 0);
  };
  
  const handleCheckout = () => {
    if (items.length === 0) return;
    if (!kasirId) return;
    if (paymentMethod === "cash" && amountPaid < total) return;
    
    onCheckout({
      kasirId,
      metodePembayaran: paymentMethod,
      dibayar: amountPaid,
      kembalian: paymentMethod === "cash" ? Math.max(0, change) : 0,
      catatan: notes
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Subtotal</span>
          <span className="font-medium">{formatRupiah(subtotal)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between mb-2">
            <span className="text-sm">Diskon ({discount}%)</span>
            <span className="font-medium text-destructive">-{formatRupiah((subtotal * discount) / 100)}</span>
          </div>
        )}
        
        {tax > 0 && (
          <div className="flex justify-between mb-2">
            <span className="text-sm">Pajak ({tax}%)</span>
            <span className="font-medium">{formatRupiah((subtotal * (1 - discount / 100) * tax) / 100)}</span>
          </div>
        )}
        
        <div className="flex justify-between mt-3 pt-3 border-t">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg">{formatRupiah(total)}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="kasir">Kasir</Label>
          <Select value={kasirId} onValueChange={setKasirId}>
            <SelectTrigger id="kasir">
              <SelectValue placeholder="Pilih kasir" />
            </SelectTrigger>
            <SelectContent>
              {kasirList.filter(k => k.aktif).map((kasir) => (
                <SelectItem key={kasir.id} value={kasir.id}>
                  {kasir.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Metode Pembayaran</Label>
          <div className="grid grid-cols-4 gap-2 mt-1">
            <Button
              type="button"
              variant={paymentMethod === "cash" ? "default" : "outline"}
              className="flex flex-col h-auto py-2 items-center justify-center"
              onClick={() => setPaymentMethod("cash")}
            >
              <Wallet className="h-5 w-5 mb-1" />
              <span className="text-xs">Tunai</span>
            </Button>
            <Button
              type="button"
              variant={paymentMethod === "debit" ? "default" : "outline"}
              className="flex flex-col h-auto py-2 items-center justify-center"
              onClick={() => setPaymentMethod("debit")}
            >
              <Receipt className="h-5 w-5 mb-1" />
              <span className="text-xs">Debit</span>
            </Button>
            <Button
              type="button"
              variant={paymentMethod === "kredit" ? "default" : "outline"}
              className="flex flex-col h-auto py-2 items-center justify-center"
              onClick={() => setPaymentMethod("kredit")}
            >
              <CreditCard className="h-5 w-5 mb-1" />
              <span className="text-xs">Kredit</span>
            </Button>
            <Button
              type="button"
              variant={paymentMethod === "qris" ? "default" : "outline"}
              className="flex flex-col h-auto py-2 items-center justify-center"
              onClick={() => setPaymentMethod("qris")}
            >
              <QrCode className="h-5 w-5 mb-1" />
              <span className="text-xs">QRIS</span>
            </Button>
          </div>
        </div>
        
        {paymentMethod === "cash" && (
          <>
            <div>
              <Label htmlFor="amount-paid">Jumlah Dibayar</Label>
              <Input
                id="amount-paid"
                type="number"
                value={amountPaid}
                onChange={handleAmountPaidChange}
                min={total}
              />
            </div>
            
            <div>
              <Label>Kembalian</Label>
              <div className={`py-2 px-3 border rounded-md text-right font-medium ${change < 0 ? "text-destructive" : ""}`}>
                {formatRupiah(Math.max(0, change))}
              </div>
            </div>
          </>
        )}
        
        <div>
          <Label htmlFor="notes">Catatan</Label>
          <Input
            id="notes"
            placeholder="Tambahkan catatan (opsional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        
        <Button
          className="w-full gap-2 mt-4"
          size="lg"
          onClick={handleCheckout}
          disabled={
            items.length === 0 ||
            !kasirId ||
            (paymentMethod === "cash" && amountPaid < total) ||
            processing
          }
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Memproses...
            </>
          ) : (
            <>
              Bayar Sekarang <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

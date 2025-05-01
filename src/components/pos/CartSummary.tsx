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
import { calculateTotal } from "@/services/penjualan";
import { ArrowRight, Loader2 } from "lucide-react";
import { PaymentMethodSelector, PaymentMethod } from "./payment-methods/PaymentMethodSelector";
import { PaymentSummary } from "./payment-methods/PaymentSummary";
import { CashPaymentFields } from "./payment-methods/CashPaymentFields";

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [amountPaid, setAmountPaid] = useState(total);
  const [notes, setNotes] = useState("");
  
  const change = amountPaid - total;
  
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
      <PaymentSummary 
        subtotal={subtotal}
        discount={discount}
        tax={tax}
        total={total}
      />
      
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
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
          />
        </div>
        
        {paymentMethod === "cash" && (
          <CashPaymentFields
            amountPaid={amountPaid}
            total={total}
            onChange={setAmountPaid}
          />
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

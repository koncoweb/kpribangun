
import { useState, useEffect } from "react";
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
import { ArrowRight, Loader2 } from "lucide-react";
import { PaymentMethodSelector, PaymentMethod } from "./payment-methods/PaymentMethodSelector";
import { PaymentSummary } from "./payment-methods/PaymentSummary";
import { CashPaymentFields } from "./payment-methods/CashPaymentFields";
import { formatRupiah } from "@/lib/utils";

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
  
  // Update amount paid when total changes
  useEffect(() => {
    if (paymentMethod === "cash") {
      setAmountPaid(total);
    }
  }, [total, paymentMethod]);
  
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

  const formIsValid = 
    items.length > 0 &&
    kasirId !== "" &&
    (paymentMethod !== "cash" || amountPaid >= total);
  
  return (
    <div className="space-y-5">
      <PaymentSummary 
        subtotal={subtotal}
        discount={discount}
        tax={tax}
        total={total}
      />
      
      <div className="space-y-4 bg-white p-4 rounded-md border">
        <div>
          <Label htmlFor="kasir" className="text-sm font-medium">Nama Kasir</Label>
          <Select value={kasirId} onValueChange={setKasirId}>
            <SelectTrigger id="kasir" className="mt-1.5">
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
        
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Metode Pembayaran</Label>
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
          <Label htmlFor="notes" className="text-sm font-medium">Catatan</Label>
          <Input
            id="notes"
            placeholder="Tambahkan catatan (opsional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1.5"
          />
        </div>
        
        <Button
          className="w-full gap-2 mt-4 py-6 text-lg font-medium bg-primary hover:bg-primary/90"
          onClick={handleCheckout}
          disabled={!formIsValid || processing}
        >
          {processing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Memproses...
            </>
          ) : (
            <>
              Bayar {formatRupiah(total)} <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

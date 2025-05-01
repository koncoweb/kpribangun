
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";

interface CashPaymentFieldsProps {
  amountPaid: number;
  total: number;
  onChange: (amount: number) => void;
}

export function CashPaymentFields({
  amountPaid,
  total,
  onChange
}: CashPaymentFieldsProps) {
  const change = amountPaid - total;
  
  return (
    <>
      <div>
        <Label htmlFor="amount-paid">Jumlah Dibayar</Label>
        <Input
          id="amount-paid"
          type="number"
          value={amountPaid}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
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
  );
}


import React from "react";
import { formatRupiah } from "@/lib/utils";

interface PaymentSummaryProps {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export function PaymentSummary({
  subtotal,
  discount,
  tax,
  total
}: PaymentSummaryProps) {
  return (
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
  );
}

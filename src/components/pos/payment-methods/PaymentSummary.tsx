
import React from "react";
import { formatRupiah } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="border-none shadow-none bg-muted">
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatRupiah(subtotal)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Diskon ({discount}%)</span>
            <span className="text-destructive">-{formatRupiah((subtotal * discount) / 100)}</span>
          </div>
        )}
        
        {tax > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Pajak ({tax}%)</span>
            <span>{formatRupiah((subtotal * (1 - discount / 100) * tax) / 100)}</span>
          </div>
        )}
        
        <div className="flex justify-between pt-2 border-t mt-1">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg">{formatRupiah(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

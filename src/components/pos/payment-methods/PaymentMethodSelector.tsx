
import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, Receipt, QrCode } from "lucide-react";

export type PaymentMethod = "cash" | "debit" | "kredit" | "qris";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange
}: PaymentMethodSelectorProps) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mt-1">
        <Button
          type="button"
          variant={selectedMethod === "cash" ? "default" : "outline"}
          className="flex flex-col h-auto py-2 items-center justify-center"
          onClick={() => onMethodChange("cash")}
        >
          <Wallet className="h-5 w-5 mb-1" />
          <span className="text-xs">Tunai</span>
        </Button>
        <Button
          type="button"
          variant={selectedMethod === "debit" ? "default" : "outline"}
          className="flex flex-col h-auto py-2 items-center justify-center"
          onClick={() => onMethodChange("debit")}
        >
          <Receipt className="h-5 w-5 mb-1" />
          <span className="text-xs">Debit</span>
        </Button>
        <Button
          type="button"
          variant={selectedMethod === "kredit" ? "default" : "outline"}
          className="flex flex-col h-auto py-2 items-center justify-center"
          onClick={() => onMethodChange("kredit")}
        >
          <CreditCard className="h-5 w-5 mb-1" />
          <span className="text-xs">Kredit</span>
        </Button>
        <Button
          type="button"
          variant={selectedMethod === "qris" ? "default" : "outline"}
          className="flex flex-col h-auto py-2 items-center justify-center"
          onClick={() => onMethodChange("qris")}
        >
          <QrCode className="h-5 w-5 mb-1" />
          <span className="text-xs">QRIS</span>
        </Button>
      </div>
    </div>
  );
}

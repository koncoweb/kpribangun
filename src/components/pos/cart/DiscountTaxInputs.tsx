
import React from "react";
import { Input } from "@/components/ui/input";
import { CartLabel } from "./CartLabel";

interface DiscountTaxInputsProps {
  discount: number;
  tax: number;
  onDiscountChange: (value: number) => void;
  onTaxChange: (value: number) => void;
}

export function DiscountTaxInputs({
  discount,
  tax,
  onDiscountChange,
  onTaxChange
}: DiscountTaxInputsProps) {
  return (
    <div className="space-y-4">
      <div>
        <CartLabel htmlFor="discount">Diskon (%)</CartLabel>
        <Input
          id="discount"
          type="number"
          min="0"
          max="100"
          value={discount}
          onChange={(e) => onDiscountChange(Number(e.target.value) || 0)}
        />
      </div>
      
      <div>
        <CartLabel htmlFor="tax">Pajak (%)</CartLabel>
        <Input
          id="tax"
          type="number"
          min="0"
          max="100"
          value={tax}
          onChange={(e) => onTaxChange(Number(e.target.value) || 0)}
        />
      </div>
    </div>
  );
}

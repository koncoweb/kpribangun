
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface DiscountTaxInputsProps {
  discount: number;
  tax: number;
  onDiscountChange: (value: number) => void;
  onTaxChange: (value: number) => void;
  onComplete?: () => void;
}

export function DiscountTaxInputs({
  discount,
  tax,
  onDiscountChange,
  onTaxChange,
  onComplete
}: DiscountTaxInputsProps) {
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onDiscountChange(isNaN(value) ? 0 : Math.min(100, Math.max(0, value)));
  };

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onTaxChange(isNaN(value) ? 0 : Math.min(100, Math.max(0, value)));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="discount" className="text-sm">
          Diskon (%)
        </Label>
        <Input
          id="discount"
          type="number"
          min={0}
          max={100}
          value={discount}
          onChange={handleDiscountChange}
          className="mt-1.5"
        />
        
        <div className="grid grid-cols-4 gap-2 mt-2">
          {[0, 5, 10, 15].map((value) => (
            <Button
              key={value}
              type="button"
              variant={discount === value ? "default" : "outline"}
              size="sm"
              className={`text-xs ${discount === value ? 'bg-primary text-white' : ''}`}
              onClick={() => onDiscountChange(value)}
            >
              {value}%
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="tax" className="text-sm">
          Pajak (%)
        </Label>
        <Input
          id="tax"
          type="number"
          min={0}
          max={100}
          value={tax}
          onChange={handleTaxChange}
          className="mt-1.5"
        />
        
        <div className="grid grid-cols-4 gap-2 mt-2">
          {[0, 10, 11, 12].map((value) => (
            <Button
              key={value}
              type="button"
              variant={tax === value ? "default" : "outline"}
              size="sm"
              className={`text-xs ${tax === value ? 'bg-primary text-white' : ''}`}
              onClick={() => onTaxChange(value)}
            >
              {value}%
            </Button>
          ))}
        </div>
      </div>

      {onComplete && (
        <Button 
          onClick={onComplete}
          className="w-full mt-4 bg-primary hover:bg-primary/90"
        >
          Terapkan dan Lanjutkan <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

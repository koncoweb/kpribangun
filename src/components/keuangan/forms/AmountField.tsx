
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatNumberInput, cleanNumberInput } from '@/utils/formatters';
import { TransactionFormValues } from '../schema';

interface AmountFieldProps {
  control: Control<TransactionFormValues>;
  formattedJumlah: string;
  setFormattedJumlah: (value: string) => void;
}

export function AmountField({ 
  control, 
  formattedJumlah, 
  setFormattedJumlah 
}: AmountFieldProps) {
  // Handle amount input with formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove any non-numeric characters
    const numericValue = inputValue.replace(/[^\d]/g, '');
    
    if (!numericValue) {
      setFormattedJumlah("");
      return 0;
    }
    
    // Format the value with thousand separators
    const formatted = formatNumberInput(numericValue);
    setFormattedJumlah(formatted);
    
    // Return the cleaned numeric value
    return cleanNumberInput(formatted);
  };

  return (
    <FormField
      control={control}
      name="jumlah"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Jumlah (Rp)</FormLabel>
          <FormControl>
            <Input 
              value={formattedJumlah} 
              onChange={(e) => {
                const value = handleAmountChange(e);
                field.onChange(value);
              }}
              placeholder="Contoh: 1.000.000"
            />
          </FormControl>
          <p className="text-xs text-muted-foreground mt-1">
            Masukkan jumlah tanpa titik atau koma, pemisah ribuan akan otomatis ditampilkan
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

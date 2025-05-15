
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPinjamanCategories } from "@/services/transaksi/categories";
import { Pengaturan } from "@/types/pengaturan";

export interface KategoriSelectorProps {
  value: string;
  onChange: (kategori: string) => void;
  pengaturan: Pengaturan | null;
}

export function KategoriSelector({ value, onChange, pengaturan }: KategoriSelectorProps) {
  const categories = getPinjamanCategories();

  // Get interest rate for a specific category
  const getInterestRate = (category: string): number => {
    if (!pengaturan) return 0;
    
    if (
      pengaturan.sukuBunga?.pinjamanByCategory && 
      category in pengaturan.sukuBunga.pinjamanByCategory
    ) {
      return pengaturan.sukuBunga.pinjamanByCategory[category];
    }
    
    return pengaturan.sukuBunga?.pinjaman || 0;
  };

  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor="kategori" className="required">Kategori Pinjaman</Label>
      <Select value={value} onValueChange={onChange} required>
        <SelectTrigger id="kategori">
          <SelectValue placeholder="Pilih kategori pinjaman" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem key={category} value={category}>
              {category} {pengaturan && (
                <span className="text-xs">
                  (Bunga {getInterestRate(category)}%)
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

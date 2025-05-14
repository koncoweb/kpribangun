
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPinjamanCategories } from "@/services/transaksi/categories";
import { getPengaturan } from "@/adapters/serviceAdapters";
import { formatNumberInput, cleanNumberInput } from "@/utils/formatters";
import { PinjamanFormSummary } from "./PinjamanFormSummary";
import { PinjamanFormData } from "./types";
import { useAsync } from "@/hooks/useAsync";

interface PinjamanFormFieldsProps {
  formData: PinjamanFormData;
  setFormData: React.Dispatch<React.SetStateAction<PinjamanFormData>>;
  formattedJumlah: string;
  setFormattedJumlah: React.Dispatch<React.SetStateAction<string>>;
}

export function PinjamanFormFields({ 
  formData, 
  setFormData,
  formattedJumlah,
  setFormattedJumlah
}: PinjamanFormFieldsProps) {
  const pinjamanCategories = getPinjamanCategories();
  const { data: pengaturan, loading } = useAsync(() => getPengaturan(), null, []);
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove any non-numeric characters
    const numericValue = inputValue.replace(/[^\d]/g, '');
    
    if (!numericValue) {
      setFormattedJumlah('');
      setFormData(prev => ({ ...prev, jumlah: '' }));
      return;
    }
    
    // Format with thousand separators
    const formatted = formatNumberInput(numericValue);
    setFormattedJumlah(formatted);
    
    // Store the cleaned numeric value in state
    setFormData(prev => ({ 
      ...prev, 
      jumlah: String(cleanNumberInput(formatted))
    }));
  };

  const handleCategoryChange = (kategori: string) => {
    setFormData(prev => ({ ...prev, kategori }));
  };

  // Helper function to display interest rate for pinjaman categories
  const getInterestRateForCategory = (category: string): number => {
    if (!pengaturan) return 0;
    
    if (pengaturan.sukuBunga.pinjamanByCategory && 
        category in pengaturan.sukuBunga.pinjamanByCategory) {
      return pengaturan.sukuBunga.pinjamanByCategory[category];
    }
    return pengaturan.sukuBunga.pinjaman;
  };

  const currentInterestRate = pengaturan ? getInterestRateForCategory(formData.kategori) : 0;

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="kategori" className="required">Kategori Pinjaman</Label>
        <Select
          value={formData.kategori}
          onValueChange={handleCategoryChange}
          required
        >
          <SelectTrigger id="kategori">
            <SelectValue placeholder="Pilih kategori pinjaman" />
          </SelectTrigger>
          <SelectContent>
            {pinjamanCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat} - Bunga {getInterestRateForCategory(cat)}% per bulan
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Suku bunga untuk kategori ini: {currentInterestRate}% per bulan
        </p>
      </div>
      
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="jumlah" className="required">Jumlah Pinjaman (Rp)</Label>
        <Input
          id="jumlah"
          name="jumlah"
          placeholder="Contoh: 5.000.000"
          value={formattedJumlah}
          onChange={handleJumlahChange}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Masukkan jumlah tanpa titik atau koma, pemisah ribuan akan otomatis ditampilkan
        </p>
      </div>
      
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="keterangan">Keterangan</Label>
        <Textarea
          id="keterangan"
          name="keterangan"
          placeholder="Tujuan pinjaman (opsional)"
          value={formData.keterangan}
          onChange={handleTextareaChange}
          rows={3}
        />
      </div>
      
      {formData.jumlah && formData.kategori && pengaturan && (
        <PinjamanFormSummary 
          kategori={formData.kategori} 
          jumlah={formData.jumlah} 
          bunga={currentInterestRate}
          pengaturan={pengaturan}
        />
      )}
    </>
  );
}


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPengaturan } from "@/services/pengaturanService";
import { formatCurrency } from "@/utils/formatters";

interface PinjamanParametersProps {
  tenor: number;
  bunga: number;
  kategori: string;
  angsuran: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string | number) => void;
}

export function PinjamanParameters({ 
  tenor, 
  bunga, 
  kategori, 
  angsuran, 
  handleInputChange, 
  handleSelectChange 
}: PinjamanParametersProps) {
  const pengaturan = getPengaturan();
  const tenorOptions = pengaturan?.tenor?.tenorOptions || [3, 6, 12, 24, 36];
  const sukuBungaByCategory = pengaturan?.sukuBunga?.pinjamanByCategory || {};
  const defaultBunga = pengaturan?.sukuBunga?.pinjaman || 1.5;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="tenor" className="required">Tenor (Bulan)</Label>
        <Select 
          value={String(tenor)}
          onValueChange={(value) => handleSelectChange("tenor", parseInt(value))}
          required
        >
          <SelectTrigger id="tenor">
            <SelectValue placeholder="Pilih tenor" />
          </SelectTrigger>
          <SelectContent>
            {tenorOptions.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option} Bulan
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="bunga" className="required">Suku Bunga (%)</Label>
        <Input 
          id="bunga" 
          type="number" 
          min="0" 
          step="0.01"
          value={bunga}
          onChange={handleInputChange}
          required 
        />
        <p className="text-muted-foreground text-xs mt-1">
          Bunga default untuk {kategori}: {sukuBungaByCategory[kategori] || defaultBunga}%
        </p>
      </div>
      
      <div>
        <Label htmlFor="angsuran">Angsuran per Bulan</Label>
        <Input 
          id="angsuran" 
          value={formatCurrency(angsuran)}
          disabled
        />
      </div>
    </div>
  );
}

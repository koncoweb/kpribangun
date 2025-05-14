
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { formatCurrency } from "@/utils/formatters";
import { PinjamanCategory } from "@/services/transaksi/categories";
import { Pengaturan } from "@/types";

interface PinjamanParametersProps {
  tenor: number;
  bunga: number;
  kategori: string;
  angsuran: number;
  pengaturan?: Pengaturan;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string | number) => void;
}

export function PinjamanParameters({
  tenor,
  bunga,
  kategori,
  angsuran,
  pengaturan,
  handleInputChange,
  handleSelectChange
}: PinjamanParametersProps) {
  // Get tenor options from settings or use defaults
  const tenorOptions = pengaturan?.tenor?.tenorOptions || [3, 6, 12, 18, 24, 36];
  const categoryBungaMap = pengaturan?.sukuBunga?.pinjamanByCategory || {
    [PinjamanCategory.REGULER]: 1.5,
    [PinjamanCategory.SERTIFIKASI]: 1.0,
    [PinjamanCategory.MUSIMAN]: 2.0
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="tenor" className="required">Tenor (bulan)</Label>
        <Select
          value={String(tenor)}
          onValueChange={(value) => handleSelectChange("tenor", parseInt(value, 10))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih tenor" />
          </SelectTrigger>
          <SelectContent>
            {tenorOptions.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option} bulan
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
          step="0.1"
          value={bunga}
          onChange={handleInputChange}
          className="w-full"
          min="0"
          max="100"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {kategori && `Bunga default untuk ${kategori}: ${categoryBungaMap[kategori]}%`}
        </p>
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="angsuran" className="required">Angsuran per bulan</Label>
        <div className="relative">
          <Input
            id="angsuran"
            value={angsuran}
            readOnly
            className="w-full bg-muted"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {formatCurrency(angsuran)}
          </div>
        </div>
      </div>
    </div>
  );
}

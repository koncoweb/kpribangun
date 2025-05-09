
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPinjamanCategories } from "@/services/transaksi/categories";

interface KategoriSelectorProps {
  kategori: string;
  handleSelectChange: (name: string, value: string | number) => void;
}

export function KategoriSelector({ kategori, handleSelectChange }: KategoriSelectorProps) {
  const pinjamanCategories = getPinjamanCategories();
  
  return (
    <div>
      <Label htmlFor="kategori" className="required">Kategori Pinjaman</Label>
      <Select 
        value={kategori}
        onValueChange={(value) => handleSelectChange("kategori", value)}
        required
      >
        <SelectTrigger id="kategori">
          <SelectValue placeholder="Pilih kategori pinjaman" />
        </SelectTrigger>
        <SelectContent>
          {pinjamanCategories.map((category) => (
            <SelectItem key={category} value={category}>
              Pinjaman {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-muted-foreground text-xs mt-1">
        Setiap kategori memiliki suku bunga yang berbeda
      </p>
    </div>
  );
}

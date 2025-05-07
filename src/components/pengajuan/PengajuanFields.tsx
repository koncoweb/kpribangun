
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  getSimpananCategories, 
  getPinjamanCategories,
  SimpananCategory,
  PinjamanCategory
} from "@/services/transaksi/categories";
import { getPengaturan } from "@/services/pengaturanService";

interface PengajuanFieldsProps {
  jenis: "Simpan" | "Pinjam";
  kategori: string;
  jumlah: number;
  onJenisChange: (value: string) => void;
  onKategoriChange: (value: string) => void;
  onJumlahChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PengajuanFields({ 
  jenis, 
  kategori,
  jumlah, 
  onJenisChange, 
  onKategoriChange,
  onJumlahChange 
}: PengajuanFieldsProps) {
  const simpananCategories = getSimpananCategories();
  const pinjamanCategories = getPinjamanCategories();
  const pengaturan = getPengaturan();

  // Helper function to display interest rate for pinjaman categories
  const getInterestRateForCategory = (category: string): string => {
    if (pengaturan.sukuBunga.pinjamanByCategory && 
        category in pengaturan.sukuBunga.pinjamanByCategory) {
      return `${pengaturan.sukuBunga.pinjamanByCategory[category]}%`;
    }
    return `${pengaturan.sukuBunga.pinjaman}%`;
  };

  return (
    <>
      <div>
        <Label htmlFor="jenis" className="required">Jenis Pengajuan</Label>
        <Select 
          value={jenis}
          onValueChange={onJenisChange}
          required
        >
          <SelectTrigger id="jenis">
            <SelectValue placeholder="Pilih jenis pengajuan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Simpan">Simpanan</SelectItem>
            <SelectItem value="Pinjam">Pinjaman</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {jenis && (
        <div>
          <Label htmlFor="kategori" className="required">Kategori {jenis === "Simpan" ? "Simpanan" : "Pinjaman"}</Label>
          <Select 
            value={kategori}
            onValueChange={onKategoriChange}
            required
          >
            <SelectTrigger id="kategori">
              <SelectValue placeholder={`Pilih kategori ${jenis === "Simpan" ? "simpanan" : "pinjaman"}`} />
            </SelectTrigger>
            <SelectContent>
              {jenis === "Simpan" ? (
                simpananCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))
              ) : (
                pinjamanCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat} - Bunga {getInterestRateForCategory(cat)} per bulan
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          
          {jenis === "Pinjam" && kategori && (
            <p className="text-muted-foreground text-xs mt-1">
              Suku bunga untuk pinjaman {kategori}: {getInterestRateForCategory(kategori)} per bulan
            </p>
          )}
        </div>
      )}
      
      <div>
        <Label htmlFor="jumlah" className="required">Jumlah (Rp)</Label>
        <Input 
          id="jumlah" 
          placeholder="Contoh: 500000" 
          type="number" 
          min="0" 
          value={jumlah || ""}
          onChange={onJumlahChange}
          required 
        />
        <p className="text-muted-foreground text-xs mt-1">
          Masukkan jumlah tanpa titik atau koma. Contoh: 500000 untuk Rp 500,000
        </p>
      </div>
    </>
  );
}

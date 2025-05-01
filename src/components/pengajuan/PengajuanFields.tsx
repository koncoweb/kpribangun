
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PengajuanFieldsProps {
  jenis: "Simpan" | "Pinjam";
  jumlah: number;
  onJenisChange: (value: string) => void;
  onJumlahChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PengajuanFields({ 
  jenis, 
  jumlah, 
  onJenisChange, 
  onJumlahChange 
}: PengajuanFieldsProps) {
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

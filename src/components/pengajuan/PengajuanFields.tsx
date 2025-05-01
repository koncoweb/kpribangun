
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
  jenis: "Simpan" | "Pinjam" | "";
  jumlah: number;
  onJenisChange: (value: "Simpan" | "Pinjam") => void;
  onJumlahChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PengajuanFields({ 
  jenis, 
  jumlah, 
  onJenisChange, 
  onJumlahChange 
}: PengajuanFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="jenis" className="required">Jenis Pengajuan</Label>
        <Select 
          value={jenis || undefined}
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
          placeholder="Contoh: 5000000" 
          type="number" 
          min="0" 
          value={jumlah || ""}
          onChange={onJumlahChange}
          required 
        />
      </div>
    </div>
  );
}


import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Anggota } from "@/types";

interface AnggotaFieldProps {
  value: string;
  onChange: (value: string) => void;
  anggotaList: Anggota[];
}

export function AnggotaField({ value, onChange, anggotaList }: AnggotaFieldProps) {
  return (
    <div>
      <Label htmlFor="anggota" className="required">Pilih Anggota</Label>
      <Select 
        value={value}
        onValueChange={onChange}
        required
      >
        <SelectTrigger id="anggota">
          <SelectValue placeholder="Pilih anggota" />
        </SelectTrigger>
        <SelectContent>
          {anggotaList.map((anggota) => (
            <SelectItem key={anggota.id} value={anggota.id}>
              {anggota.nama} ({anggota.id})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

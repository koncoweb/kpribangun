
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Anggota } from "@/types";

interface AnggotaSelectorProps {
  anggotaId: string;
  anggotaList: Anggota[];
  handleSelectChange: (name: string, value: string | number) => void;
}

export function AnggotaSelector({ anggotaId, anggotaList, handleSelectChange }: AnggotaSelectorProps) {
  return (
    <div>
      <Label htmlFor="anggotaId" className="required">Anggota</Label>
      <Select 
        value={anggotaId}
        onValueChange={(value) => handleSelectChange("anggotaId", value)}
        required
      >
        <SelectTrigger id="anggotaId">
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

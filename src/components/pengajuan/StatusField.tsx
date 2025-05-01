
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusFieldProps {
  value: "Menunggu" | "Disetujui" | "Ditolak";
  onChange: (value: "Menunggu" | "Disetujui" | "Ditolak") => void;
  disabled?: boolean;
}

export function StatusField({ value, onChange, disabled }: StatusFieldProps) {
  return (
    <div>
      <Label htmlFor="status">Status</Label>
      <Select 
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger id="status">
          <SelectValue placeholder="Pilih status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Menunggu">Menunggu</SelectItem>
          <SelectItem value="Disetujui">Disetujui</SelectItem>
          <SelectItem value="Ditolak">Ditolak</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

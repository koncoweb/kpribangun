
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JumlahInputProps {
  jumlah: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function JumlahInput({ jumlah, handleInputChange }: JumlahInputProps) {
  return (
    <div>
      <Label htmlFor="jumlah" className="required">Jumlah Pinjaman (Rp)</Label>
      <Input 
        id="jumlah" 
        placeholder="Contoh: 5000000" 
        type="number" 
        min="0" 
        value={jumlah || ""}
        onChange={handleInputChange}
        required 
      />
    </div>
  );
}

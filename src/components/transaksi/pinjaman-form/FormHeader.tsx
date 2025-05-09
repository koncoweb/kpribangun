
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormHeaderProps {
  tanggal: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormHeader({ tanggal, handleInputChange }: FormHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="tanggal" className="required">Tanggal</Label>
        <Input 
          id="tanggal" 
          type="date"
          value={tanggal}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="idTransaksi">ID Transaksi</Label>
        <Input id="idTransaksi" placeholder="ID akan digenerate otomatis" disabled />
      </div>
    </div>
  );
}

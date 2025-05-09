
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface KeteranganInputProps {
  keterangan: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function KeteranganInput({ keterangan, handleInputChange }: KeteranganInputProps) {
  return (
    <div>
      <Label htmlFor="keterangan">Keterangan</Label>
      <Textarea 
        id="keterangan" 
        placeholder="Masukkan keterangan (opsional)" 
        rows={3}
        value={keterangan}
        onChange={handleInputChange}
      />
    </div>
  );
}

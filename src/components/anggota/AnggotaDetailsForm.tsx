
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AnggotaFormData {
  nama: string;
  nip?: string; // Changed to optional
  alamat: string;
  noHp: string;
  jenisKelamin: "L" | "P";
  agama: string;
  unitKerja: string; // Changed from array to string
}

interface AnggotaDetailsFormProps {
  formData: AnggotaFormData;
  anggotaId?: string;
  isEditMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

// Available unit kerja options
const unitKerjaOptions = [
  "SDN Jatilor 01", 
  "SDN Bringin", 
  "SDN Klampok 01"
];

export function AnggotaDetailsForm({
  formData,
  anggotaId,
  isEditMode,
  onInputChange,
  onSelectChange,
}: AnggotaDetailsFormProps) {
  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="id">ID Anggota</Label>
              <Input 
                id="id" 
                placeholder={isEditMode ? anggotaId : "ID akan digenerate otomatis"} 
                disabled 
              />
            </div>
            <div>
              <Label htmlFor="nip">NIP</Label>
              <Input 
                id="nip" 
                placeholder="Masukkan NIP (opsional)" 
                value={formData.nip || ''} 
                onChange={onInputChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="nama" className="required">Nama Lengkap</Label>
            <Input 
              id="nama" 
              placeholder="Masukkan nama lengkap" 
              value={formData.nama} 
              onChange={onInputChange} 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="alamat" className="required">Alamat</Label>
            <Textarea 
              id="alamat" 
              placeholder="Masukkan alamat lengkap" 
              rows={3} 
              value={formData.alamat} 
              onChange={onInputChange} 
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="noHp" className="required">No HP / WA</Label>
              <Input 
                id="noHp" 
                placeholder="Contoh: 081234567890" 
                value={formData.noHp} 
                onChange={onInputChange} 
                required 
              />
            </div>
            
            <div>
              <Label className="required">Jenis Kelamin</Label>
              <RadioGroup 
                value={formData.jenisKelamin} 
                onValueChange={(value) => onSelectChange("jenisKelamin", value)} 
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="L" id="L" />
                  <Label htmlFor="L">Laki-laki</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="P" id="P" />
                  <Label htmlFor="P">Perempuan</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agama" className="required">Agama</Label>
              <Select 
                value={formData.agama} 
                onValueChange={(value) => onSelectChange("agama", value)} 
                required
              >
                <SelectTrigger id="agama">
                  <SelectValue placeholder="Pilih agama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Islam">Islam</SelectItem>
                  <SelectItem value="Kristen">Kristen</SelectItem>
                  <SelectItem value="Katolik">Katolik</SelectItem>
                  <SelectItem value="Hindu">Hindu</SelectItem>
                  <SelectItem value="Budha">Budha</SelectItem>
                  <SelectItem value="Kepercayaan">Kepercayaan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="unitKerja" className="required">Unit Kerja</Label>
              <Select 
                value={formData.unitKerja} 
                onValueChange={(value) => onSelectChange("unitKerja", value)} 
                required
              >
                <SelectTrigger id="unitKerja">
                  <SelectValue placeholder="Pilih unit kerja" />
                </SelectTrigger>
                <SelectContent>
                  {unitKerjaOptions.map((unit) => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

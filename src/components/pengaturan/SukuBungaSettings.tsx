
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Percent, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pengaturan } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { updatePengaturan } from "@/services/pengaturanService";

interface SukuBungaSettingsProps {
  settings: Pengaturan;
  setSettings: React.Dispatch<React.SetStateAction<Pengaturan>>;
}

export function SukuBungaSettings({ settings, setSettings }: SukuBungaSettingsProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSukuBungaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      sukuBunga: {
        ...prev.sukuBunga,
        [name]: parseFloat(value)
      }
    }));
  };
  
  const handleSelectChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      sukuBunga: {
        ...prev.sukuBunga,
        metodeBunga: value as "flat" | "menurun"
      }
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      updatePengaturan(settings);
      
      toast({
        title: "Pengaturan berhasil disimpan",
        description: "Perubahan pengaturan suku bunga telah berhasil diterapkan",
      });
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan pengaturan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Percent size={18} className="text-koperasi-blue" />
          Pengaturan Suku Bunga
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="pinjaman">Bunga Pinjaman (% per bulan)</Label>
              <Input 
                id="pinjaman"
                name="pinjaman"
                type="number" 
                value={settings.sukuBunga.pinjaman}
                onChange={handleSukuBungaChange}
                step="0.1" 
                min="0" 
                max="5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Bunga yang diterapkan untuk pinjaman anggota
              </p>
            </div>
            <div>
              <Label htmlFor="simpanan">Bunga Simpanan (% per tahun)</Label>
              <Input 
                id="simpanan"
                name="simpanan"
                type="number"
                value={settings.sukuBunga.simpanan}
                onChange={handleSukuBungaChange}
                step="0.1" 
                min="0" 
                max="2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Bunga yang diberikan untuk simpanan anggota
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="metodeBunga">Metode Perhitungan Bunga Pinjaman</Label>
            <Select 
              value={settings.sukuBunga.metodeBunga}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="metodeBunga">
                <SelectValue placeholder="Pilih metode bunga" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="menurun">Menurun (Sliding)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Metode perhitungan bunga yang digunakan untuk pinjaman
            </p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg mt-6">
            <h3 className="font-medium text-sm mb-2">Contoh Perhitungan</h3>
            <p className="text-sm mb-2">
              Untuk pinjaman Rp 5.000.000 dengan tenor 12 bulan:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Bunga per bulan: Rp {(5000000 * settings.sukuBunga.pinjaman / 100).toLocaleString("id-ID")} ({settings.sukuBunga.pinjaman}%)</li>
              <li>Total bunga: Rp {(5000000 * settings.sukuBunga.pinjaman / 100 * 12).toLocaleString("id-ID")}</li>
              <li>Angsuran per bulan: Rp {((5000000 + (5000000 * settings.sukuBunga.pinjaman / 100 * 12)) / 12).toLocaleString("id-ID", { maximumFractionDigits: 0 })}</li>
              <li>Total yang harus dibayar: Rp {(5000000 + (5000000 * settings.sukuBunga.pinjaman / 100 * 12)).toLocaleString("id-ID")}</li>
            </ul>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button type="submit" className="gap-2" disabled={isSubmitting}>
              <Save size={16} /> Simpan Pengaturan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

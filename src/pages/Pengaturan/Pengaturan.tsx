
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Clock, 
  Percent, 
  AlertTriangle,
  Save
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getPengaturan, updatePengaturan } from "@/services/pengaturanService";
import { Pengaturan as PengaturanType } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

export default function Pengaturan() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<PengaturanType>(getPengaturan());
  
  // Temporary state for tenor options checkboxes
  const [tenorOptions, setTenorOptions] = useState<{ [key: number]: boolean }>({
    3: false,
    6: false,
    12: false,
    24: false,
    36: false
  });
  
  // Initialize tenor options from settings
  useEffect(() => {
    const options = { ...tenorOptions };
    settings.tenor.tenorOptions.forEach(tenor => {
      options[tenor] = true;
    });
    setTenorOptions(options);
  }, []);
  
  const handleTenorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      tenor: {
        ...prev.tenor,
        [name]: parseInt(value)
      }
    }));
  };
  
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
  
  const handleDendaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      denda: {
        ...prev.denda,
        [name]: name === "gracePeriod" ? parseInt(value) : parseFloat(value)
      }
    }));
  };
  
  const handleSelectChange = (section: string, field: string, value: string) => {
    if (section === "tenor") {
      setSettings(prev => ({
        ...prev,
        tenor: {
          ...prev.tenor,
          [field]: parseInt(value)
        }
      }));
    } else if (section === "sukuBunga") {
      setSettings(prev => ({
        ...prev,
        sukuBunga: {
          ...prev.sukuBunga,
          [field]: value
        }
      }));
    } else if (section === "denda") {
      setSettings(prev => ({
        ...prev,
        denda: {
          ...prev.denda,
          [field]: value
        }
      }));
    }
  };
  
  const handleTenorOptionChange = (tenor: number, checked: boolean) => {
    setTenorOptions(prev => ({
      ...prev,
      [tenor]: checked
    }));
  };
  
  const handleSubmit = (e: React.FormEvent, section: string) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let updatedSettings = { ...settings };
      
      // If tenor section, update tenor options based on checkboxes
      if (section === "tenor") {
        const selectedOptions = Object.entries(tenorOptions)
          .filter(([_, isSelected]) => isSelected)
          .map(([tenor]) => parseInt(tenor));
          
        updatedSettings = {
          ...updatedSettings,
          tenor: {
            ...updatedSettings.tenor,
            tenorOptions: selectedOptions
          }
        };
      }
      
      updatePengaturan(updatedSettings);
      setSettings(updatedSettings);
      
      toast({
        title: "Pengaturan berhasil disimpan",
        description: "Perubahan pengaturan telah berhasil diterapkan",
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
    <Layout pageTitle="Pengaturan">
      <h1 className="page-title">Pengaturan Koperasi</h1>
      
      <Tabs defaultValue="tenor" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="tenor" className="gap-2">
            <Clock size={16} /> Tenor
          </TabsTrigger>
          <TabsTrigger value="bunga" className="gap-2">
            <Percent size={16} /> Suku Bunga
          </TabsTrigger>
          <TabsTrigger value="denda" className="gap-2">
            <AlertTriangle size={16} /> Denda
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tenor">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Clock size={18} className="text-koperasi-blue" />
                Pengaturan Tenor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={(e) => handleSubmit(e, "tenor")}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="minTenor">Tenor Minimum (bulan)</Label>
                    <Input 
                      id="minTenor"
                      name="minTenor"
                      type="number" 
                      value={settings.tenor.minTenor}
                      onChange={handleTenorChange}
                      min={1}
                      max={12}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Tenor pinjaman terendah yang diizinkan
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="maxTenor">Tenor Maximum (bulan)</Label>
                    <Input 
                      id="maxTenor"
                      name="maxTenor"
                      type="number" 
                      value={settings.tenor.maxTenor}
                      onChange={handleTenorChange}
                      min={12}
                      max={60}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Tenor pinjaman tertinggi yang diizinkan
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="defaultTenor">Tenor Default (bulan)</Label>
                    <Select 
                      value={settings.tenor.defaultTenor.toString()}
                      onValueChange={(value) => handleSelectChange("tenor", "defaultTenor", value)}
                    >
                      <SelectTrigger id="defaultTenor">
                        <SelectValue placeholder="Pilih tenor default" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Bulan</SelectItem>
                        <SelectItem value="6">6 Bulan</SelectItem>
                        <SelectItem value="12">12 Bulan</SelectItem>
                        <SelectItem value="24">24 Bulan</SelectItem>
                        <SelectItem value="36">36 Bulan</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tenor yang dipilih secara default saat membuat pinjaman baru
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Label>Opsi Tenor yang Tersedia</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tenor3"
                        checked={tenorOptions[3]}
                        onCheckedChange={(checked) => handleTenorOptionChange(3, checked === true)}
                      />
                      <label htmlFor="tenor3" className="text-sm">3 Bulan</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tenor6"
                        checked={tenorOptions[6]}
                        onCheckedChange={(checked) => handleTenorOptionChange(6, checked === true)}
                      />
                      <label htmlFor="tenor6" className="text-sm">6 Bulan</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tenor12"
                        checked={tenorOptions[12]}
                        onCheckedChange={(checked) => handleTenorOptionChange(12, checked === true)}
                      />
                      <label htmlFor="tenor12" className="text-sm">12 Bulan</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tenor24"
                        checked={tenorOptions[24]}
                        onCheckedChange={(checked) => handleTenorOptionChange(24, checked === true)}
                      />
                      <label htmlFor="tenor24" className="text-sm">24 Bulan</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tenor36"
                        checked={tenorOptions[36]}
                        onCheckedChange={(checked) => handleTenorOptionChange(36, checked === true)}
                      />
                      <label htmlFor="tenor36" className="text-sm">36 Bulan</label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button type="submit" className="gap-2" disabled={isSubmitting}>
                    <Save size={16} /> Simpan Pengaturan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bunga">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Percent size={18} className="text-koperasi-blue" />
                Pengaturan Suku Bunga
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={(e) => handleSubmit(e, "bunga")}>
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
                    onValueChange={(value) => handleSelectChange("sukuBunga", "metodeBunga", value)}
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
        </TabsContent>
        
        <TabsContent value="denda">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <AlertTriangle size={18} className="text-koperasi-blue" />
                Pengaturan Denda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={(e) => handleSubmit(e, "denda")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="persentase">Persentase Denda (% dari angsuran)</Label>
                    <Input 
                      id="persentase"
                      name="persentase"
                      type="number" 
                      value={settings.denda.persentase}
                      onChange={handleDendaChange}
                      step="0.1" 
                      min="0" 
                      max="1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Persentase denda yang diterapkan pada keterlambatan pembayaran
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="gracePeriod">Grace Period (hari)</Label>
                    <Input 
                      id="gracePeriod"
                      name="gracePeriod"
                      type="number" 
                      value={settings.denda.gracePeriod}
                      onChange={handleDendaChange}
                      min="0" 
                      max="10"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Jumlah hari tenggang sebelum denda diterapkan
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Label htmlFor="metodeDenda">Metode Perhitungan Denda</Label>
                  <Select 
                    value={settings.denda.metodeDenda}
                    onValueChange={(value) => handleSelectChange("denda", "metodeDenda", value)}
                  >
                    <SelectTrigger id="metodeDenda">
                      <SelectValue placeholder="Pilih metode denda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="harian">Harian (dihitung per hari keterlambatan)</SelectItem>
                      <SelectItem value="bulanan">Bulanan (flat per bulan keterlambatan)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Metode yang digunakan untuk menghitung denda keterlambatan
                  </p>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg mt-6">
                  <h3 className="font-medium text-sm mb-2">Contoh Perhitungan Denda</h3>
                  <p className="text-sm mb-2">
                    Untuk angsuran Rp 500.000 yang terlambat 10 hari:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      Perhitungan: Rp 500.000 x {settings.denda.persentase}% x 
                      ({10} - {settings.denda.gracePeriod} [grace period]) = 
                      Rp {(500000 * settings.denda.persentase / 100 * Math.max(0, 10 - settings.denda.gracePeriod)).toLocaleString("id-ID")}
                    </li>
                    <li>
                      Total yang harus dibayar: 
                      Rp {(500000 + (500000 * settings.denda.persentase / 100 * Math.max(0, 10 - settings.denda.gracePeriod))).toLocaleString("id-ID")}
                    </li>
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
        </TabsContent>
      </Tabs>
    </Layout>
  );
}

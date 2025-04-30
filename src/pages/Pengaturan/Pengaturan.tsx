
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
  Settings, 
  Clock, 
  Percent, 
  AlertTriangle,
  Save
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Pengaturan() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Simulasi data pengaturan saat ini
  const [settings, setSettings] = useState({
    tenor: {
      minTenor: 3,
      maxTenor: 36,
      defaultTenor: 12,
      tenorOptions: [3, 6, 12, 24, 36],
    },
    sukuBunga: {
      pinjaman: 1.5,
      simpanan: 0.5,
      metodeBunga: "flat", // flat atau menurun
    },
    denda: {
      persentase: 0.1,
      gracePeriod: 3,
      metodeDenda: "harian" // harian atau bulanan
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi proses penyimpanan
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Pengaturan berhasil disimpan",
        description: "Perubahan pengaturan telah berhasil diterapkan",
      });
    }, 1000);
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
        
        <form onSubmit={handleSubmit}>
          <TabsContent value="tenor">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Clock size={18} className="text-koperasi-blue" />
                  Pengaturan Tenor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <FormLabel htmlFor="minTenor">Tenor Minimum (bulan)</FormLabel>
                    <Input 
                      id="minTenor" 
                      type="number" 
                      defaultValue={settings.tenor.minTenor.toString()} 
                      min={1}
                      max={12}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Tenor pinjaman terendah yang diizinkan
                    </p>
                  </div>
                  <div>
                    <FormLabel htmlFor="maxTenor">Tenor Maximum (bulan)</FormLabel>
                    <Input 
                      id="maxTenor" 
                      type="number" 
                      defaultValue={settings.tenor.maxTenor.toString()}
                      min={12}
                      max={60}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Tenor pinjaman tertinggi yang diizinkan
                    </p>
                  </div>
                  <div>
                    <FormLabel htmlFor="defaultTenor">Tenor Default (bulan)</FormLabel>
                    <Select defaultValue={settings.tenor.defaultTenor.toString()}>
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
                
                <div>
                  <FormLabel>Opsi Tenor yang Tersedia</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="tenor3" defaultChecked className="rounded border-gray-300" />
                      <label htmlFor="tenor3" className="text-sm">3 Bulan</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="tenor6" defaultChecked className="rounded border-gray-300" />
                      <label htmlFor="tenor6" className="text-sm">6 Bulan</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="tenor12" defaultChecked className="rounded border-gray-300" />
                      <label htmlFor="tenor12" className="text-sm">12 Bulan</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="tenor24" defaultChecked className="rounded border-gray-300" />
                      <label htmlFor="tenor24" className="text-sm">24 Bulan</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="tenor36" defaultChecked className="rounded border-gray-300" />
                      <label htmlFor="tenor36" className="text-sm">36 Bulan</label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="gap-2" disabled={isSubmitting}>
                    <Save size={16} /> Simpan Pengaturan
                  </Button>
                </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel htmlFor="bungaPinjaman">Bunga Pinjaman (% per bulan)</FormLabel>
                    <Input 
                      id="bungaPinjaman" 
                      type="number" 
                      defaultValue={settings.sukuBunga.pinjaman.toString()} 
                      step="0.1" 
                      min="0" 
                      max="5"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Bunga yang diterapkan untuk pinjaman anggota
                    </p>
                  </div>
                  <div>
                    <FormLabel htmlFor="bungaSimpanan">Bunga Simpanan (% per tahun)</FormLabel>
                    <Input 
                      id="bungaSimpanan" 
                      type="number" 
                      defaultValue={settings.sukuBunga.simpanan.toString()} 
                      step="0.1" 
                      min="0" 
                      max="2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Bunga yang diberikan untuk simpanan anggota
                    </p>
                  </div>
                </div>
                
                <div>
                  <FormLabel htmlFor="metodeBunga">Metode Perhitungan Bunga Pinjaman</FormLabel>
                  <Select defaultValue={settings.sukuBunga.metodeBunga}>
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
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium text-sm mb-2">Contoh Perhitungan</h3>
                  <p className="text-sm mb-2">
                    Untuk pinjaman Rp 5.000.000 dengan tenor 12 bulan:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Bunga per bulan: Rp 75.000 (1.5%)</li>
                    <li>Total bunga: Rp 900.000</li>
                    <li>Angsuran per bulan: Rp 491.667</li>
                    <li>Total yang harus dibayar: Rp 5.900.000</li>
                  </ul>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="gap-2" disabled={isSubmitting}>
                    <Save size={16} /> Simpan Pengaturan
                  </Button>
                </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel htmlFor="persentaseDenda">Persentase Denda (% dari angsuran)</FormLabel>
                    <Input 
                      id="persentaseDenda" 
                      type="number" 
                      defaultValue={settings.denda.persentase.toString()} 
                      step="0.1" 
                      min="0" 
                      max="1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Persentase denda yang diterapkan pada keterlambatan pembayaran
                    </p>
                  </div>
                  <div>
                    <FormLabel htmlFor="gracePeriod">Grace Period (hari)</FormLabel>
                    <Input 
                      id="gracePeriod" 
                      type="number" 
                      defaultValue={settings.denda.gracePeriod.toString()} 
                      min="0" 
                      max="10"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Jumlah hari tenggang sebelum denda diterapkan
                    </p>
                  </div>
                </div>
                
                <div>
                  <FormLabel htmlFor="metodeDenda">Metode Perhitungan Denda</FormLabel>
                  <Select defaultValue={settings.denda.metodeDenda}>
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
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium text-sm mb-2">Contoh Perhitungan Denda</h3>
                  <p className="text-sm mb-2">
                    Untuk angsuran Rp 500.000 yang terlambat 10 hari:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Perhitungan: Rp 500.000 x 0.1% x (10 - 3 [grace period]) = Rp 3.500</li>
                    <li>Total yang harus dibayar: Rp 503.500</li>
                  </ul>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="gap-2" disabled={isSubmitting}>
                    <Save size={16} /> Simpan Pengaturan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </Layout>
  );
}

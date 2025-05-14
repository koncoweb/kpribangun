import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { createTransaksi } from "@/adapters/serviceAdapters";
import { Anggota } from "@/types";
import { formatNumberInput, cleanNumberInput } from "@/utils/formatters";

interface SimpananFormProps {
  anggota: Anggota;
}

export function SimpananForm({ anggota }: SimpananFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formValues, setFormValues] = useState({
    tanggal: format(new Date(), "yyyy-MM-dd"),
    jumlah: "",
    jenis: "masuk", // "masuk" or "keluar"
    keterangan: ""
  });
  
  // Formatted amount for display
  const [formattedJumlah, setFormattedJumlah] = useState("");
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove any non-numeric characters
    const numericValue = inputValue.replace(/[^\d]/g, '');
    
    if (!numericValue) {
      setFormattedJumlah('');
      setFormValues(prev => ({ ...prev, jumlah: '' }));
      return;
    }
    
    // Format with thousand separators
    const formatted = formatNumberInput(numericValue);
    setFormattedJumlah(formatted);
    
    // Store the cleaned numeric value in state
    setFormValues(prev => ({ 
      ...prev, 
      jumlah: String(cleanNumberInput(formatted))
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValues.jumlah || parseInt(formValues.jumlah) <= 0) {
      toast({
        title: "Jumlah tidak valid",
        description: "Masukkan jumlah simpanan yang valid",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare transaction data
      const jumlah = formValues.jenis === "masuk" 
        ? parseInt(formValues.jumlah) 
        : -parseInt(formValues.jumlah); // Negative for withdrawal
      
      const transaksiData = {
        tanggal: formValues.tanggal,
        anggotaId: anggota.id,
        anggotaNama: anggota.nama,
        jenis: "Simpan",
        jumlah,
        keterangan: formValues.keterangan || 
          (formValues.jenis === "masuk" ? "Setor simpanan" : "Tarik simpanan"),
        status: "Sukses"
      };
      
      const transaksi = await createTransaksi(transaksiData);
      
      if (transaksi && transaksi.id) {
        toast({
          title: "Transaksi Berhasil",
          description: `Transaksi simpanan telah berhasil disimpan`,
        });
        
        // Navigate to the created transaction
        navigate(`/transaksi/${transaksi.id}`);
      } else {
        throw new Error("Gagal membuat transaksi");
      }
    } catch (error) {
      console.error("Error creating simpanan:", error);
      toast({
        title: "Gagal Menyimpan Transaksi",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan transaksi",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Form Simpanan</CardTitle>
              <CardDescription>
                Masukkan informasi simpanan untuk anggota {anggota.nama}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="jenis">Jenis Transaksi</Label>
                <Select
                  value={formValues.jenis}
                  onValueChange={(value) => handleSelectChange("jenis", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis transaksi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masuk">Setor (Masuk)</SelectItem>
                    <SelectItem value="keluar">Tarik (Keluar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="tanggal">Tanggal</Label>
                <Input
                  id="tanggal"
                  name="tanggal"
                  type="date"
                  value={formValues.tanggal}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="jumlah">Jumlah (Rp)</Label>
                <Input
                  id="jumlah"
                  name="jumlah"
                  placeholder="Contoh: 1.000.000"
                  value={formattedJumlah}
                  onChange={handleJumlahChange}
                  required
                />
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
                <Textarea
                  id="keterangan"
                  name="keterangan"
                  placeholder="Keterangan tambahan"
                  value={formValues.keterangan}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Anggota</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama</p>
                <p className="font-medium">{anggota.nama}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID Anggota</p>
                <p className="font-medium">{anggota.id}</p>
              </div>
              {anggota.noHp && (
                <div>
                  <p className="text-sm text-muted-foreground">No. Telepon</p>
                  <p className="font-medium">{anggota.noHp}</p>
                </div>
              )}
              
              <div className="pt-4 flex flex-col gap-2">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Memproses..." : "Simpan Transaksi"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

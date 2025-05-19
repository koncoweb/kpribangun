
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  getSimpananCategories, 
  getPinjamanCategories,
} from "@/services/transaksi/categories";
import { getPengaturan } from "@/adapters/serviceAdapters";
import { formatNumberInput, cleanNumberInput } from "@/utils/formatters";

interface PengajuanFieldsProps {
  jenis: "Simpanan" | "Pinjaman";
  kategori: string;
  jumlah: number;
  onJenisChange: (value: string) => void;
  onKategoriChange: (value: string) => void;
  onJumlahChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PengajuanFields({ 
  jenis, 
  kategori,
  jumlah, 
  onJenisChange, 
  onKategoriChange,
  onJumlahChange 
}: PengajuanFieldsProps) {
  const simpananCategories = getSimpananCategories();
  const pinjamanCategories = getPinjamanCategories();
  const [pengaturan, setPengaturan] = useState<any>(null);
  const [formattedJumlah, setFormattedJumlah] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  
  // Load pengaturan data
  useEffect(() => {
    const loadPengaturan = async () => {
      try {
        const data = await getPengaturan();
        setPengaturan(data);
      } catch (error) {
        console.error("Error loading pengaturan:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPengaturan();
  }, []);

  // Initialize formatted amount when component loads or jumlah changes from outside
  useEffect(() => {
    if (jumlah) {
      setFormattedJumlah(formatNumberInput(jumlah));
    } else {
      setFormattedJumlah("");
    }
  }, [jumlah]);

  // Handle the input change with formatting
  const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove any non-numeric characters for processing
    const numericValue = inputValue.replace(/[^\d]/g, '');
    
    if (!numericValue) {
      setFormattedJumlah("");
      
      // Create a synthetic event with value 0
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: "0" }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onJumlahChange(syntheticEvent);
      return;
    }
    
    // Format the value with thousand separators
    const formatted = formatNumberInput(numericValue);
    setFormattedJumlah(formatted);
    
    // Create a synthetic event with the cleaned numeric value
    const numericAmount = cleanNumberInput(formatted);
    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: String(numericAmount) }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onJumlahChange(syntheticEvent);
  };

  // Helper function to display interest rate for pinjaman categories
  const getInterestRateForCategory = (category: string): string => {
    if (!pengaturan) return "0%";
    
    if (pengaturan.sukuBunga.pinjamanByCategory && 
        category in pengaturan.sukuBunga.pinjamanByCategory) {
      return `${pengaturan.sukuBunga.pinjamanByCategory[category]}%`;
    }
    return `${pengaturan.sukuBunga.pinjaman}%`;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div>
        <Label htmlFor="jenis" className="required">Jenis Pengajuan</Label>
        <Select 
          value={jenis}
          onValueChange={onJenisChange}
          required
        >
          <SelectTrigger id="jenis">
            <SelectValue placeholder="Pilih jenis pengajuan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Simpan">Simpanan</SelectItem>
            <SelectItem value="Pinjam">Pinjaman</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {jenis && (
        <div>
          <Label htmlFor="kategori" className="required">Kategori {jenis === "Simpanan" ? "Simpanan" : "Pinjaman"}</Label>
          <Select 
            value={kategori}
            onValueChange={onKategoriChange}
            required
          >
            <SelectTrigger id="kategori">
              <SelectValue placeholder={`Pilih kategori ${jenis === "Simpanan" ? "simpanan" : "pinjaman"}`} />
            </SelectTrigger>
            <SelectContent>
              {jenis === "Simpanan" ? (
                simpananCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))
              ) : (
                pinjamanCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat} - Bunga {pengaturan && getInterestRateForCategory(cat)} per bulan
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          
          {jenis === "Pinjaman" && kategori && pengaturan && (
            <p className="text-muted-foreground text-xs mt-1">
              Suku bunga untuk pinjaman {kategori}: {getInterestRateForCategory(kategori)} per bulan
            </p>
          )}
        </div>
      )}
      
      <div>
        <Label htmlFor="jumlah" className="required">Jumlah (Rp)</Label>
        <Input 
          id="jumlah" 
          placeholder="Contoh: 500.000" 
          value={formattedJumlah}
          onChange={handleJumlahChange}
          required 
        />
        <p className="text-muted-foreground text-xs mt-1">
          Masukkan jumlah tanpa titik atau koma, pemisah ribuan akan otomatis ditampilkan
        </p>
      </div>
    </>
  );
}

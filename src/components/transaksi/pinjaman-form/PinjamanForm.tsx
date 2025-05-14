
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getPengaturan } from "@/adapters/serviceAdapters";
import { createTransaksi } from "@/adapters/serviceAdapters";
import { PinjamanCategory } from "@/services/transaksi/categories";
import { PinjamanFormProps, PinjamanFormData } from "./types";
import { FormHeader } from "./FormHeader";
import { AnggotaSelector } from "./AnggotaSelector";
import { KategoriSelector } from "./KategoriSelector";
import { JumlahInput } from "./JumlahInput";
import { PinjamanParameters } from "./PinjamanParameters";
import { KeteranganInput } from "./KeteranganInput";
import { LoanSummary } from "./LoanSummary";
import { FormActions } from "./FormActions";
import { calculateAngsuran } from "./utils";
import { Pengaturan } from "@/types";

export function PinjamanForm({ anggotaList }: PinjamanFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pengaturan, setPengaturan] = useState<Pengaturan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Default values (will be updated after settings are loaded)
  const defaultCategory = PinjamanCategory.REGULER;
  const defaultBunga = 1.5;
  
  const [formData, setFormData] = useState<PinjamanFormData>({
    tanggal: new Date().toISOString().split('T')[0],
    anggotaId: "",
    jumlah: 0,
    tenor: 12, 
    kategori: defaultCategory,
    bunga: defaultBunga,
    angsuran: 0,
    keterangan: ""
  });
  
  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getPengaturan();
        setPengaturan(settings);
        
        // Update form data with loaded settings
        const categoryBunga = settings.sukuBunga.pinjamanByCategory[defaultCategory] || settings.sukuBunga.pinjaman;
        
        setFormData(prevData => ({
          ...prevData,
          bunga: categoryBunga,
          tenor: settings.tenor.defaultTenor || 12
        }));
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load pengaturan:", error);
        toast({
          title: "Error",
          description: "Gagal memuat pengaturan. Menggunakan nilai default.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    let newFormData = {
      ...formData,
      [id]: id === "jumlah" || id === "bunga" || id === "tenor" ? Number(value) : value
    };
    
    // If jumlah, tenor, or bunga changes, recalculate angsuran
    if (id === "jumlah" || id === "tenor" || id === "bunga") {
      const calculatedAngsuran = calculateAngsuran(
        id === "jumlah" ? Number(value) : formData.jumlah,
        id === "tenor" ? Number(value) : formData.tenor,
        id === "bunga" ? Number(value) : formData.bunga
      );
      
      newFormData.angsuran = calculatedAngsuran;
    }
    
    setFormData(newFormData);
  };
  
  const handleSelectChange = (name: string, value: string | number) => {
    let newFormData = { ...formData, [name]: value };
    
    // If kategori changes, update the bunga
    if (name === "kategori" && pengaturan) {
      const categoryBunga = pengaturan.sukuBunga.pinjamanByCategory[value as string] || pengaturan.sukuBunga.pinjaman;
      newFormData = {
        ...newFormData,
        bunga: categoryBunga
      };
    }
    
    // If anggotaId, tenor, or kategori changes, recalculate angsuran
    if (name === "tenor" || name === "kategori") {
      const bungaToUse = name === "kategori" && pengaturan 
        ? (pengaturan.sukuBunga.pinjamanByCategory[value as string] || pengaturan.sukuBunga.pinjaman) 
        : formData.bunga;
        
      const calculatedAngsuran = calculateAngsuran(
        formData.jumlah, 
        name === "tenor" ? Number(value) : formData.tenor,
        bungaToUse
      );
      newFormData.angsuran = calculatedAngsuran;
    }
    
    setFormData(newFormData);
  };
  
  const validateForm = () => {
    if (!formData.tanggal) {
      toast({
        title: "Tanggal wajib diisi",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.anggotaId) {
      toast({
        title: "Anggota wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.jumlah || formData.jumlah <= 0) {
      toast({
        title: "Jumlah pinjaman harus lebih dari 0",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.kategori) {
      toast({
        title: "Kategori pinjaman wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create keterangan with loan details
      const totalBunga = formData.angsuran * formData.tenor - formData.jumlah;
      const detailKeterangan = 
        `Pinjaman ${formData.kategori}, ${formData.tenor} bulan dengan bunga ${formData.bunga}%. ` +
        `Tenor: ${formData.tenor} bulan. ` +
        `Angsuran per bulan: Rp ${formData.angsuran.toLocaleString("id-ID")}. ` +
        `Total bunga: Rp ${totalBunga.toLocaleString("id-ID")}. ` +
        (formData.keterangan ? `Catatan: ${formData.keterangan}` : "");
      
      const newTransaksi = await createTransaksi({
        tanggal: formData.tanggal,
        anggotaId: formData.anggotaId,
        jenis: "Pinjam",
        kategori: formData.kategori,
        jumlah: formData.jumlah,
        keterangan: detailKeterangan,
        status: "Sukses"
      });
      
      if (newTransaksi) {
        toast({
          title: "Pinjaman berhasil disimpan",
          description: `Pinjaman dengan ID ${newTransaksi.id} telah berhasil disimpan`,
        });
        window.location.href = "/transaksi/pinjam";
      } else {
        throw new Error("Gagal menyimpan pinjaman");
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan pinjaman. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <FormHeader 
          tanggal={formData.tanggal}
          handleInputChange={handleInputChange}
        />
        
        <AnggotaSelector
          anggotaId={formData.anggotaId}
          anggotaList={anggotaList}
          handleSelectChange={handleSelectChange}
        />
        
        <KategoriSelector
          kategori={formData.kategori}
          handleSelectChange={handleSelectChange}
        />
        
        <JumlahInput
          jumlah={formData.jumlah}
          handleInputChange={handleInputChange}
        />
        
        {pengaturan && (
          <PinjamanParameters
            tenor={formData.tenor}
            bunga={formData.bunga}
            kategori={formData.kategori}
            angsuran={formData.angsuran}
            pengaturan={pengaturan}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
        )}
        
        <KeteranganInput
          keterangan={formData.keterangan}
          handleInputChange={handleInputChange}
        />
        
        <LoanSummary
          kategori={formData.kategori}
          jumlah={formData.jumlah}
          bunga={formData.bunga}
          tenor={formData.tenor}
          angsuran={formData.angsuran}
        />
        
        <FormActions isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}

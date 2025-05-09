
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getPengaturan } from "@/services/pengaturanService";
import { createTransaksi } from "@/services/transaksi";
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

export function PinjamanForm({ anggotaList }: PinjamanFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get pengaturan for bunga options
  const pengaturan = getPengaturan();
  const defaultCategory = PinjamanCategory.REGULER;
  
  // Get category-specific interest rates
  const sukuBungaByCategory = pengaturan?.sukuBunga?.pinjamanByCategory || {};
  const defaultBunga = pengaturan?.sukuBunga?.pinjaman || 1.5;
  
  const [formData, setFormData] = useState<PinjamanFormData>({
    tanggal: new Date().toISOString().split('T')[0],
    anggotaId: "",
    jumlah: 0,
    tenor: 12, // Default tenor
    kategori: defaultCategory,
    bunga: sukuBungaByCategory[defaultCategory] || defaultBunga,
    angsuran: 0,
    keterangan: ""
  });
  
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
    if (name === "kategori") {
      const categoryBunga = sukuBungaByCategory[value as string] || defaultBunga;
      newFormData = {
        ...newFormData,
        bunga: categoryBunga
      };
    }
    
    // If anggotaId, tenor, or kategori changes, recalculate angsuran
    if (name === "tenor" || name === "kategori") {
      const calculatedAngsuran = calculateAngsuran(
        formData.jumlah, 
        name === "tenor" ? Number(value) : formData.tenor,
        name === "kategori" ? (sukuBungaByCategory[value as string] || defaultBunga) : formData.bunga
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
  
  const handleSubmit = (e: React.FormEvent) => {
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
      
      const newTransaksi = createTransaksi({
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
        
        <PinjamanParameters
          tenor={formData.tenor}
          bunga={formData.bunga}
          kategori={formData.kategori}
          angsuran={formData.angsuran}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
        
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

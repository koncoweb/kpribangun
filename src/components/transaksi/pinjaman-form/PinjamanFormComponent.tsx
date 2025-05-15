
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getPengaturan } from "@/adapters/serviceAdapters";
import { formatNumberInput, cleanNumberInput } from "@/utils/formatters";
import { createTransaksi } from "@/services/transaksi";
import { useAsync } from "@/hooks/useAsync";
import "@/styles/form-styles.css";
import { calculateAngsuran } from "./utils";

// Import components
import { FormHeader } from "./FormHeader";
import { AnggotaSelector } from "./AnggotaSelector";
import { KategoriSelector } from "./KategoriSelector";
import { JumlahInput } from "./JumlahInput";
import { KeteranganInput } from "./KeteranganInput";
import { LoanSummary } from "./LoanSummary";
import { FormActions } from "./FormActions";
import { PinjamanFormProps } from "./types";

export function PinjamanFormComponent({ anggotaList = [] }: PinjamanFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAnggota, setSelectedAnggota] = useState("");
  const [selectedAnggotaNama, setSelectedAnggotaNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [formattedJumlah, setFormattedJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenor, setTenor] = useState(12); // Default tenor

  // Get pengaturan data using useAsync hook
  const { data: pengaturan, loading: loadingPengaturan } = useAsync(
    () => getPengaturan(),
    null,
    []
  );

  // Handle jumlah (amount) input changes
  const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Clean and format the input value
    const cleanValue = inputValue.replace(/[^\d]/g, "");
    
    if (!cleanValue) {
      setFormattedJumlah("");
      setJumlah("");
      return;
    }
    
    const formatted = formatNumberInput(cleanValue);
    setFormattedJumlah(formatted);
    setJumlah(cleanNumberInput(formatted).toString());
  };

  // Handle anggota (member) selection
  const handleAnggotaChange = (anggotaId: string) => {
    setSelectedAnggota(anggotaId);
    
    // Find the selected anggota name
    const selected = anggotaList.find((a: any) => a.id === anggotaId);
    if (selected) {
      setSelectedAnggotaNama(selected.nama);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAnggota || !kategori || !jumlah) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create new transaksi
      const newTransaksi = await createTransaksi({
        tanggal: new Date().toISOString().split("T")[0],
        anggotaId: selectedAnggota,
        anggotaNama: selectedAnggotaNama,
        jenis: "Pinjam",
        kategori: kategori,
        jumlah: Number(jumlah),
        keterangan: keterangan || "Pinjaman baru",
        status: "Sukses",
      });

      toast({
        title: "Transaksi Berhasil",
        description: "Pinjaman telah berhasil dicatat",
      });

      // Navigate to transaksi list
      navigate("/transaksi");
    } catch (error: any) {
      toast({
        title: "Transaksi Gagal",
        description: error.message || "Terjadi kesalahan saat mencatat pinjaman",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if we can show the loan summary
  const canShowSummary = kategori && jumlah && pengaturan;
  
  // Get interest rate based on selected category
  const getInterestRate = () => {
    if (!pengaturan || !kategori) return 0;
    
    if (
      pengaturan.sukuBunga?.pinjamanByCategory && 
      kategori in pengaturan.sukuBunga.pinjamanByCategory
    ) {
      return pengaturan.sukuBunga.pinjamanByCategory[kategori];
    }
    
    return pengaturan.sukuBunga?.pinjaman || 0;
  };
  
  // Calculate monthly installment amount
  const calculateInstallment = () => {
    if (!jumlah || !kategori || !pengaturan) return 0;
    
    const bungaRate = getInterestRate();
    return calculateAngsuran(Number(jumlah), tenor, bungaRate);
  };

  if (loadingPengaturan) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormHeader title="Formulir Pinjaman Baru" />
      
      <AnggotaSelector
        anggotaList={anggotaList}
        value={selectedAnggota}
        onChange={handleAnggotaChange}
      />
      
      <KategoriSelector 
        value={kategori} 
        onChange={setKategori} 
        pengaturan={pengaturan}
      />
      
      <JumlahInput
        value={formattedJumlah}
        onChange={handleJumlahChange}
      />
      
      <KeteranganInput
        value={keterangan}
        onChange={(e) => setKeterangan(e.target.value)}
      />
      
      {canShowSummary && (
        <LoanSummary
          jumlah={Number(jumlah)}
          kategori={kategori}
          bunga={getInterestRate()}
          tenor={tenor}
          angsuran={calculateInstallment()}
        />
      )}
      
      <FormActions 
        cancelAction={() => navigate("/transaksi")}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}

export default PinjamanFormComponent;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Anggota } from "@/types";
import { PengajuanFormContent } from "./PengajuanFormContent";

// Import necessary functions from service
import { createPengajuanInSupabase } from "@/services/pengajuan/adapter";

interface PengajuanPinjamanFormProps {
  anggotaList: Anggota[];
}

export function PengajuanPinjamanForm({ anggotaList }: PengajuanPinjamanFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initial form data for Pinjaman type
  const initialFormData = {
    tanggal: new Date().toISOString().split('T')[0],
    anggotaId: "",
    jenis: "Pinjaman" as const,
    kategori: "Reguler",
    jumlah: 0,
    keterangan: "",
    status: "Menunggu" as const,
    dokumen: []
  };
  
  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      // Find the complete anggota object to get the name
      const anggota = anggotaList.find(a => a.id === formData.anggotaId);
      if (!anggota) {
        throw new Error("Anggota tidak ditemukan");
      }
      
      // Add anggota name to the form data
      const submissionData = {
        ...formData,
        anggotaNama: anggota.nama
      };
      
      // Create the pengajuan in Supabase
      await createPengajuanInSupabase(submissionData);
      
      toast({
        title: "Berhasil",
        description: "Pengajuan pinjaman berhasil dibuat",
      });
      
      // Navigate back to pengajuan list
      navigate("/transaksi/pengajuan");
      
    } catch (error) {
      console.error("Error creating pengajuan:", error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat membuat pengajuan pinjaman",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <PengajuanFormContent
      isEditMode={false}
      initialFormData={initialFormData}
      anggotaList={anggotaList}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}

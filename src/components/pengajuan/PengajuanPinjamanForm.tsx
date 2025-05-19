
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Anggota } from "@/types";
import { PengajuanFormContent } from "./PengajuanFormContent";

// Import necessary functions from service
import { createPengajuanInSupabase } from "@/services/pengajuan/adapter";
import { PengajuanStatus } from "@/services/pengajuan/types";

interface PengajuanPinjamanFormProps {
  anggotaList: Anggota[];
  activeTab: string;
}

export function PengajuanPinjamanForm({ anggotaList, activeTab }: PengajuanPinjamanFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initial form data for Pinjaman type
  const initialFormData = {
    tanggal: new Date().toISOString().split('T')[0],
    anggotaId: "",
    jenis: "Pinjaman" as const, // This must match the enum in the database
    kategori: "Reguler",
    jumlah: 1000000, // Set a default amount to avoid validation errors
    keterangan: "",
    status: "Diajukan" as PengajuanStatus, // Match the default status in the database
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
      
      // Log the form data for debugging
      console.log('Form data before submission:', formData);
      
      // Check for any unexpected properties
      const expectedProps = ['tanggal', 'anggotaId', 'jenis', 'kategori', 'jumlah', 'keterangan', 'status', 'dokumen'];
      const unexpectedProps = Object.keys(formData).filter(key => !expectedProps.includes(key));
      
      if (unexpectedProps.length > 0) {
        console.warn('Unexpected properties in form data:', unexpectedProps);
      }
      
      // Validate jumlah
      const jumlah = Number(formData.jumlah);
      if (isNaN(jumlah) || jumlah <= 0) {
        throw new Error("Jumlah pinjaman harus lebih dari 0");
      }
      
      // Clean up the form data to ensure it only contains expected properties
      const cleanedFormData = {
        tanggal: formData.tanggal,
        anggotaId: formData.anggotaId,
        anggotaNama: anggota.nama,
        jenis: "Pinjaman" as const, // Must be exactly "Pinjaman" to match the enum
        kategori: formData.kategori,
        jumlah: jumlah, // Use the validated jumlah value
        keterangan: formData.keterangan || "",
        status: "Diajukan" as PengajuanStatus, // Match the default status in the database
        dokumen: formData.dokumen || []
      };
      
      console.log('Cleaned submission data:', cleanedFormData);
      
      // Validate required documents
      const requiredDocTypes = ["KTP", "KK", "Buku Rekening"];
      
      // Add category-specific required documents
      if (cleanedFormData.kategori === "Reguler") {
        requiredDocTypes.push("Sertifikat Tanah");
      } else if (cleanedFormData.kategori === "Sertifikasi") {
        requiredDocTypes.push("Sertifikat Sertifikasi");
      }
      
      // Check if all required documents are uploaded
      for (const docType of requiredDocTypes) {
        const hasDoc = cleanedFormData.dokumen?.some(doc => doc.jenis === docType);
        if (!hasDoc) {
          throw new Error(`Dokumen ${docType} wajib diunggah`);
        }
      }
      
      // Create the pengajuan in Supabase
      const result = await createPengajuanInSupabase(cleanedFormData);
      
      if (!result) {
        throw new Error("Gagal menyimpan data pengajuan");
      }
      
      console.log('Pengajuan created successfully:', result);
      
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
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : "Terjadi kesalahan saat membuat pengajuan pinjaman",
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

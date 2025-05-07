
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Anggota } from "@/types";
import { FormActions } from "@/components/anggota/FormActions";
import { StatusField } from "./StatusField";
import { AnggotaField } from "./AnggotaField";
import { PengajuanFields } from "./PengajuanFields";
import { KeteranganField } from "./KeteranganField";
import { DateField } from "./DateField";
import { DokumenPersyaratanUpload, PersyaratanDokumen } from "./DokumenPersyaratanUpload";
import { getSimpananCategories, getPinjamanCategories } from "@/services/transaksi/categories";

interface PengajuanFormContentProps {
  isEditMode: boolean;
  id?: string;
  initialFormData: {
    tanggal: string;
    anggotaId: string;
    jenis: "Simpan" | "Pinjam";
    kategori: string;
    jumlah: number;
    keterangan: string;
    status: "Menunggu" | "Disetujui" | "Ditolak";
    dokumen?: PersyaratanDokumen[];
  };
  anggotaList: Anggota[];
  onSubmit: (formData: any) => void;
  isSubmitting: boolean;
}

export function PengajuanFormContent({
  isEditMode,
  initialFormData,
  anggotaList,
  onSubmit,
  isSubmitting
}: PengajuanFormContentProps) {
  // Local form state
  const [formData, setFormData] = useState({
    ...initialFormData,
    dokumen: initialFormData.dokumen || []
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === "jumlah" ? Number(value) : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === "jenis") {
      // When jenis changes, we need to reset kategori and set it to a valid default based on the new type
      const defaultCategory = value === "Simpan" 
        ? getSimpananCategories()[0] 
        : getPinjamanCategories()[0];
      
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as "Simpan" | "Pinjam",
        kategori: defaultCategory,
        dokumen: [] // Reset documents when changing application type
      }));
    } else if (name === "status") {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as "Menunggu" | "Disetujui" | "Ditolak" 
      }));
    } else if (name === "kategori") {
      // Reset documents when changing category
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        dokumen: []
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleDokumenChange = (dokumen: PersyaratanDokumen[]) => {
    setFormData(prev => ({
      ...prev,
      dokumen
    }));
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
    
    if (!formData.jenis) {
      toast({
        title: "Jenis pengajuan wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.kategori) {
      toast({
        title: `Kategori ${formData.jenis === "Simpan" ? "simpanan" : "pinjaman"} wajib dipilih`,
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.jumlah || formData.jumlah <= 0) {
      toast({
        title: "Jumlah harus lebih dari 0",
        variant: "destructive",
      });
      return false;
    }
    
    // Check required documents for loan applications
    if (formData.jenis === "Pinjam") {
      const requiredDocTypes = ["KTP", "KK", "Buku Rekening"];
      
      // Add category-specific required documents
      if (formData.kategori === "Reguler") {
        requiredDocTypes.push("Sertifikat Tanah");
      } else if (formData.kategori === "Sertifikasi") {
        requiredDocTypes.push("Sertifikat Sertifikasi");
      }
      
      // Check if all required documents are uploaded
      for (const docType of requiredDocTypes) {
        const hasDoc = formData.dokumen?.some(doc => doc.jenis === docType);
        if (!hasDoc) {
          toast({
            title: `Dokumen ${docType} wajib diunggah`,
            description: "Mohon unggah semua dokumen persyaratan yang wajib",
            variant: "destructive",
          });
          return false;
        }
      }
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit(formData);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateField 
                value={formData.tanggal} 
                onChange={handleInputChange} 
              />
              
              <StatusField 
                value={formData.status}
                onChange={(value) => handleSelectChange("status", value)}
                disabled={!isEditMode}
              />
            </div>
            
            <AnggotaField 
              value={formData.anggotaId}
              onChange={(value) => handleSelectChange("anggotaId", value)}
              anggotaList={anggotaList}
            />
            
            <PengajuanFields 
              jenis={formData.jenis} 
              kategori={formData.kategori}
              jumlah={formData.jumlah}
              onJenisChange={(value) => handleSelectChange("jenis", value)}
              onKategoriChange={(value) => handleSelectChange("kategori", value)}
              onJumlahChange={handleInputChange}
            />
            
            <KeteranganField 
              value={formData.keterangan}
              onChange={handleInputChange}
            />
            
            {formData.jenis === "Pinjam" && formData.kategori && (
              <DokumenPersyaratanUpload
                selectedKategori={formData.kategori}
                dokumenList={formData.dokumen || []}
                onChange={handleDokumenChange}
              />
            )}
            
            <FormActions 
              isSubmitting={isSubmitting} 
              isEditMode={isEditMode}
              cancelHref="/transaksi/pengajuan"
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

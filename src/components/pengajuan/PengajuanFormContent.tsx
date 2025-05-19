
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
import { PengajuanStatus } from "@/services/pengajuan/types";

interface PengajuanFormContentProps {
  isEditMode: boolean;
  id?: string;
  initialFormData: {
    tanggal: string;
    anggotaId: string;
    jenis: "Simpanan" | "Pinjaman";
    kategori: string;
    jumlah: number;
    keterangan: string;
    status: PengajuanStatus;
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
    dokumen: initialFormData.dokumen || [],
    jumlah: initialFormData.jumlah || 0 // Ensure jumlah is initialized properly
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    console.log(`Input change - id: ${id}, value: ${value}`);
    
    if (!id) {
      console.warn('Input change event with no id:', e);
      return;
    }
    
    // Handle jumlah field specially to ensure it's a number
    if (id === "jumlah") {
      // Remove any non-numeric characters
      const numericValue = value.replace(/[^0-9]/g, '');
      const numberValue = numericValue ? Number(numericValue) : 0;
      console.log(`Converted jumlah value: ${numberValue}`);
      
      setFormData(prev => {
        const newData = { ...prev, jumlah: numberValue };
        return newData;
      });
    } else {
      setFormData(prev => {
        const newData = { ...prev, [id]: value };
        return newData;
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === "jenis") {
      // When jenis changes, we need to reset kategori and set it to a valid default based on the new type
      const defaultCategory = value === "Simpanan" 
        ? getSimpananCategories()[0] 
        : getPinjamanCategories()[0];
      
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as "Simpanan" | "Pinjaman",
        kategori: defaultCategory,
        dokumen: [] // Reset documents when changing application type
      }));
    } else if (name === "status") {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as PengajuanStatus 
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
    console.log('Validating form with data:', formData);
    
    // Check for any unexpected properties in the form data
    const expectedProps = ['tanggal', 'anggotaId', 'jenis', 'kategori', 'jumlah', 'keterangan', 'status', 'dokumen'];
    const unexpectedProps = Object.keys(formData).filter(key => !expectedProps.includes(key));
    
    if (unexpectedProps.length > 0) {
      console.warn('Unexpected properties in form data:', unexpectedProps);
      // Remove unexpected properties
      const cleanedFormData = { ...formData };
      unexpectedProps.forEach(prop => delete cleanedFormData[prop]);
      setFormData(cleanedFormData);
      
      // Return false to prevent form submission with unexpected properties
      return false;
    }
    
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
    
    // Validate jenis - make sure it's exactly "Simpanan" or "Pinjaman"
    if (formData.jenis !== "Simpanan" && formData.jenis !== "Pinjaman") {
      toast({
        title: "Jenis pengajuan tidak valid",
        description: "Jenis harus 'Simpanan' atau 'Pinjaman'",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.kategori) {
      toast({
        title: `Kategori ${formData.jenis === "Simpanan" ? "simpanan" : "pinjaman"} wajib dipilih`,
        variant: "destructive",
      });
      return false;
    }
    
    // Ensure jumlah is a valid number greater than 0
    const jumlah = Number(formData.jumlah);
    if (isNaN(jumlah) || jumlah <= 0) {
      toast({
        title: "Jumlah harus lebih dari 0",
        variant: "destructive",
      });
      return false;
    }
    
    // Check required documents for loan applications
    if (formData.jenis === "Pinjaman") {
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
    console.log('Form submission started');
    e.preventDefault();
    
    console.log('Form data before validation:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    
    console.log('Form validation passed, calling onSubmit with data:', formData);
    onSubmit(formData);
  };

  // Add a direct click handler for debugging
  const handleFormSubmitClick = () => {
    console.log('Manual form submit triggered');
    
    // First, clean up any unexpected properties
    const expectedProps = ['tanggal', 'anggotaId', 'jenis', 'kategori', 'jumlah', 'keterangan', 'status', 'dokumen'];
    
    // Create a properly typed cleaned form data object
    const cleanedFormData = {
      tanggal: formData.tanggal,
      anggotaId: formData.anggotaId,
      jenis: formData.jenis,
      kategori: formData.kategori,
      jumlah: Number(formData.jumlah) || 0, // Ensure jumlah is a number
      keterangan: formData.keterangan,
      status: formData.status,
      dokumen: formData.dokumen || []
    };
    
    // Update the form data with the cleaned version
    setFormData(cleanedFormData);
    
    console.log('Cleaned form data:', cleanedFormData);
    
    // Manually validate and submit the form
    if (validateForm()) {
      console.log('Manual validation passed, submitting form data:', cleanedFormData);
      onSubmit(cleanedFormData);
    } else {
      console.log('Manual validation failed');
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form 
          onSubmit={handleSubmit}
          // Add this to ensure the form is properly set up
          action="#"
          method="post"
        >
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
              disableJenisField={true} // Disable jenis field to match the active tab
            />
            
            <KeteranganField 
              value={formData.keterangan}
              onChange={handleInputChange}
            />
            
            {formData.jenis === "Pinjaman" && formData.kategori && (
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

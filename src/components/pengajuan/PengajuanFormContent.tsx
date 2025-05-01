
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

interface PengajuanFormContentProps {
  isEditMode: boolean;
  id?: string;
  initialFormData: {
    tanggal: string;
    anggotaId: string;
    jenis: "Simpan" | "Pinjam";
    jumlah: number;
    keterangan: string;
    status: "Menunggu" | "Disetujui" | "Ditolak";
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
  const [formData, setFormData] = useState(initialFormData);
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
      // Ensure jenis is always a valid value
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as "Simpan" | "Pinjam" 
      }));
    } else if (name === "status") {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as "Menunggu" | "Disetujui" | "Ditolak" 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
    
    if (!formData.jumlah || formData.jumlah <= 0) {
      toast({
        title: "Jumlah harus lebih dari 0",
        variant: "destructive",
      });
      return false;
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
              jumlah={formData.jumlah}
              onJenisChange={(value) => handleSelectChange("jenis", value)}
              onJumlahChange={handleInputChange}
            />
            
            <KeteranganField 
              value={formData.keterangan}
              onChange={handleInputChange}
            />
            
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

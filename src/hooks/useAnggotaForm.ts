
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { createAnggota, getAnggotaById, updateAnggota } from "@/services/anggotaService";
import { Anggota, AnggotaKeluarga, AnggotaDokumen } from "@/types";

export const useAnggotaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  
  // Form state with properly typed jenisKelamin
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    alamat: "",
    noHp: "",
    jenisKelamin: "L" as "L" | "P", 
    agama: "",
    pekerjaan: "",
    foto: ""
  });
  
  const [dokumen, setDokumen] = useState<AnggotaDokumen[]>([]);
  const [initialDokumenCount, setInitialDokumenCount] = useState(0);
  const [keluarga, setKeluarga] = useState<AnggotaKeluarga[]>([]);
  const [initialKeluargaCount, setInitialKeluargaCount] = useState(0);
  
  const isEditMode = !!id;

  // Handle browser back/navigation warning if form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isFormDirty]);
  
  // Load data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const anggota = getAnggotaById(id);
      if (anggota) {
        setFormData({
          nama: anggota.nama,
          nik: anggota.nik,
          alamat: anggota.alamat,
          noHp: anggota.noHp,
          jenisKelamin: anggota.jenisKelamin,
          agama: anggota.agama,
          pekerjaan: anggota.pekerjaan,
          foto: anggota.foto || ""
        });
        
        if (anggota.foto) {
          setPreviewImage(anggota.foto);
        }
        
        if (anggota.dokumen) {
          setDokumen(anggota.dokumen);
          setInitialDokumenCount(anggota.dokumen.length);
        }
        
        if (anggota.keluarga) {
          setKeluarga(anggota.keluarga);
          setInitialKeluargaCount(anggota.keluarga.length);
        }
      } else {
        toast({
          title: "Anggota tidak ditemukan",
          description: "Data anggota yang ingin diubah tidak ditemukan",
          variant: "destructive",
        });
        navigate("/anggota");
      }
    }
    
    // Reset form dirty state after initial load
    setIsFormDirty(false);
  }, [id, isEditMode, navigate, toast]);
  
  // Track changes to mark form as dirty
  useEffect(() => {
    if (isEditMode) {
      const isDokumenChanged = dokumen.length !== initialDokumenCount;
      const isKeluargaChanged = keluarga.length !== initialKeluargaCount;
      
      if (isDokumenChanged || isKeluargaChanged) {
        setIsFormDirty(true);
      }
    }
  }, [dokumen, keluarga, isEditMode, initialDokumenCount, initialKeluargaCount]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setIsFormDirty(true);
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === "jenisKelamin") {
      // For jenisKelamin, ensure it's either "L" or "P"
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as "L" | "P" 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setIsFormDirty(true);
  };
  
  const handleImageChange = (imageDataUrl: string) => {
    setPreviewImage(imageDataUrl);
    setFormData(prev => ({ ...prev, foto: imageDataUrl }));
    setIsFormDirty(true);
  };
  
  const handleDokumenChange = (updatedDokumen: AnggotaDokumen[]) => {
    setDokumen(updatedDokumen);
    setIsFormDirty(true);
  };
  
  const handleKeluargaChange = (updatedKeluarga: AnggotaKeluarga[]) => {
    setKeluarga(updatedKeluarga);
    setIsFormDirty(true);
  };
  
  const handleCancel = () => {
    if (isFormDirty) {
      if (window.confirm("Perubahan yang belum disimpan akan hilang. Lanjutkan?")) {
        navigate("/anggota");
      }
    } else {
      navigate("/anggota");
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.nama || !formData.nik || !formData.alamat || !formData.noHp || !formData.agama || !formData.pekerjaan) {
      toast({
        title: "Data tidak lengkap",
        description: "Harap lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const anggotaData = {
        ...formData,
        dokumen,
        keluarga
      };
      
      if (isEditMode && id) {
        // Update existing anggota
        const updatedAnggota = updateAnggota(id, anggotaData);
        
        if (updatedAnggota) {
          toast({
            title: "Anggota berhasil diperbarui",
            description: "Data anggota telah berhasil diperbarui",
          });
          navigate(`/anggota/${id}`);
        } else {
          throw new Error("Gagal memperbarui anggota");
        }
      } else {
        // Create new anggota
        const newAnggota = createAnggota(anggotaData);
        
        toast({
          title: "Anggota berhasil ditambahkan",
          description: `Anggota baru dengan ID ${newAnggota.id} telah berhasil disimpan`,
        });
        navigate(`/anggota/${newAnggota.id}`);
      }
      
      // Reset form dirty state after successful submit
      setIsFormDirty(false);
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan data anggota. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEditMode,
    formData,
    previewImage,
    dokumen,
    keluarga,
    isSubmitting,
    isFormDirty,
    handleChange,
    handleSelectChange,
    handleImageChange,
    handleDokumenChange,
    handleKeluargaChange,
    handleCancel,
    handleSubmit,
    id
  };
};

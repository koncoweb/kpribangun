
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getAnggotaById } from "@/services/anggotaService";
import { AnggotaKeluarga, AnggotaDokumen } from "@/types";

export const useAnggotaFormState = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state with properly typed jenisKelamin and added email field
  const [formData, setFormData] = useState({
    nama: "",
    nip: "", // Now optional
    alamat: "",
    noHp: "",
    jenisKelamin: "L" as "L" | "P", 
    agama: "",
    foto: "",
    email: "",
    unitKerja: "" // Changed from array to string
  });
  
  const [dokumen, setDokumen] = useState<AnggotaDokumen[]>([]);
  const [initialDokumenCount, setInitialDokumenCount] = useState(0);
  const [keluarga, setKeluarga] = useState<AnggotaKeluarga[]>([]);
  const [initialKeluargaCount, setInitialKeluargaCount] = useState(0);
  
  const isEditMode = !!id;

  // Load data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const loadData = async () => {
        try {
          setLoading(true);
          const anggota = await getAnggotaById(id);
          
          if (anggota) {
            setFormData({
              nama: anggota.nama,
              nip: anggota.nip || "", 
              alamat: anggota.alamat,
              noHp: anggota.noHp,
              jenisKelamin: anggota.jenisKelamin,
              agama: anggota.agama,
              foto: anggota.foto || "",
              email: anggota.email || "",
              unitKerja: anggota.unitKerja || "" // Changed from array to string
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
          }
        } catch (error) {
          console.error("Error loading anggota data:", error);
          toast({
            title: "Error",
            description: "Terjadi kesalahan saat memuat data anggota",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }
    
    // Reset form dirty state after initial load
    setIsFormDirty(false);
  }, [id, isEditMode, toast]);
  
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

  return {
    id,
    isEditMode,
    isSubmitting,
    setIsSubmitting,
    formData,
    setFormData,
    previewImage, 
    setPreviewImage,
    dokumen,
    setDokumen,
    keluarga,
    setKeluarga,
    isFormDirty,
    setIsFormDirty,
    loading
  };
};

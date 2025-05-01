
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllAnggota } from "@/services/anggotaService";
import { Anggota } from "@/types";
import { createPengajuan, getPengajuanById, updatePengajuan } from "@/services/pengajuanService";
import { PengajuanFormContent } from "@/components/pengajuan/PengajuanFormContent";

export default function PengajuanForm() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  
  // Initialize form data with default values
  const [formData, setFormData] = useState<{
    tanggal: string;
    anggotaId: string;
    jenis: "Simpan" | "Pinjam" | "";
    jumlah: number;
    keterangan: string;
    status: "Menunggu" | "Disetujui" | "Ditolak";
  }>({
    tanggal: new Date().toISOString().split('T')[0],
    anggotaId: "",
    jenis: "",
    jumlah: 0,
    keterangan: "",
    status: "Menunggu"
  });
  
  useEffect(() => {
    // Load anggota list
    const loadedAnggota = getAllAnggota();
    setAnggotaList(loadedAnggota);
    
    // If in edit mode, load the existing pengajuan data
    if (isEditMode && id) {
      const pengajuan = getPengajuanById(id);
      if (pengajuan) {
        setFormData({
          tanggal: pengajuan.tanggal,
          anggotaId: pengajuan.anggotaId,
          jenis: pengajuan.jenis,
          jumlah: pengajuan.jumlah,
          keterangan: pengajuan.keterangan || "",
          status: pengajuan.status
        });
      } else {
        // Handle case where pengajuan with ID is not found
        toast({
          title: "Data tidak ditemukan",
          description: `Pengajuan dengan ID ${id} tidak ditemukan`,
          variant: "destructive",
        });
        navigate("/transaksi/pengajuan");
      }
    }
  }, [id, isEditMode, navigate, toast]);
  
  const handleSubmit = (submittedData: typeof formData) => {
    setIsSubmitting(true);
    
    try {
      if (isEditMode && id) {
        // Update existing pengajuan with properly typed data
        const updated = updatePengajuan(id, {
          tanggal: submittedData.tanggal,
          anggotaId: submittedData.anggotaId,
          jenis: submittedData.jenis,
          jumlah: submittedData.jumlah,
          keterangan: submittedData.keterangan,
          status: submittedData.status
        });
        
        if (updated) {
          toast({
            title: "Pengajuan berhasil diperbarui",
            description: `Pengajuan dengan ID ${id} telah berhasil diperbarui`,
          });
          navigate("/transaksi/pengajuan");
        } else {
          throw new Error("Gagal memperbarui pengajuan");
        }
      } else {
        // Create new pengajuan with properly typed data
        const newPengajuan = createPengajuan({
          tanggal: submittedData.tanggal,
          anggotaId: submittedData.anggotaId,
          jenis: submittedData.jenis,
          jumlah: submittedData.jumlah,
          keterangan: submittedData.keterangan,
          status: submittedData.status
        });
        
        if (newPengajuan) {
          toast({
            title: "Pengajuan berhasil dibuat",
            description: `Pengajuan baru dengan ID ${newPengajuan.id} telah berhasil dibuat`,
          });
          navigate("/transaksi/pengajuan");
        } else {
          throw new Error("Gagal membuat pengajuan baru");
        }
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan data pengajuan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout pageTitle={isEditMode ? "Edit Pengajuan" : "Tambah Pengajuan"}>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi/pengajuan">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">
          {isEditMode ? "Edit Pengajuan" : "Tambah Pengajuan"}
        </h1>
      </div>
      
      <PengajuanFormContent
        isEditMode={isEditMode}
        id={id}
        initialFormData={formData}
        anggotaList={anggotaList}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </Layout>
  );
}

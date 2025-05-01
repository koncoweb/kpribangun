
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllAnggota } from "@/services/anggotaService";
import { FormActions } from "@/components/anggota/FormActions";
import { Anggota, Pengajuan } from "@/types";
import { createPengajuan, getPengajuanById, updatePengajuan } from "@/services/pengajuanService";

export default function PengajuanForm() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  
  // Use proper typed state
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === "jumlah" ? Number(value) : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === "jenis") {
      setFormData(prev => ({ ...prev, [name]: value as "Simpan" | "Pinjam" }));
    } else if (name === "status") {
      setFormData(prev => ({ ...prev, [name]: value as "Menunggu" | "Disetujui" | "Ditolak" }));
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
    if (!formData.jenis) return; // Additional type safety check
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode && id) {
        // Update existing pengajuan with properly typed data
        const updated = updatePengajuan(id, {
          tanggal: formData.tanggal,
          anggotaId: formData.anggotaId,
          jenis: formData.jenis,
          jumlah: formData.jumlah,
          keterangan: formData.keterangan,
          status: formData.status
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
          tanggal: formData.tanggal,
          anggotaId: formData.anggotaId,
          jenis: formData.jenis,
          jumlah: formData.jumlah,
          keterangan: formData.keterangan,
          status: formData.status
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
      
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tanggal" className="required">Tanggal</Label>
                  <Input 
                    id="tanggal" 
                    type="date"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status}
                    onValueChange={(value: "Menunggu" | "Disetujui" | "Ditolak") => handleSelectChange("status", value)}
                    disabled={!isEditMode}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Menunggu">Menunggu</SelectItem>
                      <SelectItem value="Disetujui">Disetujui</SelectItem>
                      <SelectItem value="Ditolak">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="anggota" className="required">Pilih Anggota</Label>
                <Select 
                  value={formData.anggotaId}
                  onValueChange={(value) => handleSelectChange("anggotaId", value)}
                  required
                >
                  <SelectTrigger id="anggota">
                    <SelectValue placeholder="Pilih anggota" />
                  </SelectTrigger>
                  <SelectContent>
                    {anggotaList.map((anggota) => (
                      <SelectItem key={anggota.id} value={anggota.id}>
                        {anggota.nama} ({anggota.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jenis" className="required">Jenis Pengajuan</Label>
                  <Select 
                    value={formData.jenis || undefined}
                    onValueChange={(value: "Simpan" | "Pinjam") => handleSelectChange("jenis", value)}
                    required
                  >
                    <SelectTrigger id="jenis">
                      <SelectValue placeholder="Pilih jenis pengajuan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Simpan">Simpanan</SelectItem>
                      <SelectItem value="Pinjam">Pinjaman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="jumlah" className="required">Jumlah (Rp)</Label>
                  <Input 
                    id="jumlah" 
                    placeholder="Contoh: 5000000" 
                    type="number" 
                    min="0" 
                    value={formData.jumlah || ""}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="keterangan">Keterangan</Label>
                <Textarea 
                  id="keterangan" 
                  placeholder="Masukkan keterangan (opsional)" 
                  rows={3}
                  value={formData.keterangan}
                  onChange={handleInputChange}
                />
              </div>
              
              <FormActions 
                isSubmitting={isSubmitting} 
                isEditMode={isEditMode}
                cancelHref="/transaksi/pengajuan"
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
}

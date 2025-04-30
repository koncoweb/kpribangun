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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createAnggota, getAnggotaById, updateAnggota } from "@/services/anggotaService";
import { Anggota } from "@/types";

export default function AnggotaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Form state with properly typed jenisKelamin
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    alamat: "",
    noHp: "",
    jenisKelamin: "L" as "L" | "P", // Explicitly type as "L" | "P"
    agama: "",
    pekerjaan: "",
    foto: ""
  });
  
  const isEditMode = !!id;
  
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
      } else {
        toast({
          title: "Anggota tidak ditemukan",
          description: "Data anggota yang ingin diubah tidak ditemukan",
          variant: "destructive",
        });
        navigate("/anggota");
      }
    }
  }, [id, isEditMode, navigate, toast]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
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
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Ukuran file terlalu besar",
          description: "Ukuran file maksimum adalah 2MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewImage(result);
        setFormData(prev => ({ ...prev, foto: result }));
      };
      reader.readAsDataURL(file);
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
      if (isEditMode && id) {
        // Update existing anggota
        const updatedAnggota = updateAnggota(id, formData);
        
        if (updatedAnggota) {
          toast({
            title: "Anggota berhasil diperbarui",
            description: "Data anggota telah berhasil diperbarui",
          });
          navigate("/anggota");
        } else {
          throw new Error("Gagal memperbarui anggota");
        }
      } else {
        // Create new anggota
        const newAnggota = createAnggota(formData);
        
        toast({
          title: "Anggota berhasil ditambahkan",
          description: `Anggota baru dengan ID ${newAnggota.id} telah berhasil disimpan`,
        });
        navigate("/anggota");
      }
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

  return (
    <Layout pageTitle={isEditMode ? "Edit Anggota" : "Tambah Anggota Baru"}>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/anggota">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">{isEditMode ? "Edit Anggota" : "Tambah Anggota Baru"}</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-4 relative">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-dashed border-gray-300">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <Upload className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <div className="w-full">
                  <Label htmlFor="photo" className="block mb-2 text-center">
                    Foto Anggota
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Ukuran maksimum 2MB. Format: JPG, PNG
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="id">ID Anggota</Label>
                    <Input 
                      id="id" 
                      placeholder={isEditMode ? id : "ID akan digenerate otomatis"} 
                      disabled 
                    />
                  </div>
                  <div>
                    <Label htmlFor="nik" className="required">NIK</Label>
                    <Input 
                      id="nik" 
                      placeholder="Masukkan NIK" 
                      value={formData.nik} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="nama" className="required">Nama Lengkap</Label>
                  <Input 
                    id="nama" 
                    placeholder="Masukkan nama lengkap" 
                    value={formData.nama} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="alamat" className="required">Alamat</Label>
                  <Textarea 
                    id="alamat" 
                    placeholder="Masukkan alamat lengkap" 
                    rows={3} 
                    value={formData.alamat} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="noHp" className="required">No HP / WA</Label>
                    <Input 
                      id="noHp" 
                      placeholder="Contoh: 081234567890" 
                      value={formData.noHp} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label className="required">Jenis Kelamin</Label>
                    <RadioGroup 
                      value={formData.jenisKelamin} 
                      onValueChange={(value) => handleSelectChange("jenisKelamin", value)} 
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="L" id="L" />
                        <Label htmlFor="L">Laki-laki</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="P" id="P" />
                        <Label htmlFor="P">Perempuan</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="agama" className="required">Agama</Label>
                    <Select 
                      value={formData.agama} 
                      onValueChange={(value) => handleSelectChange("agama", value)} 
                      required
                    >
                      <SelectTrigger id="agama">
                        <SelectValue placeholder="Pilih agama" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Islam">Islam</SelectItem>
                        <SelectItem value="Kristen">Kristen</SelectItem>
                        <SelectItem value="Katolik">Katolik</SelectItem>
                        <SelectItem value="Hindu">Hindu</SelectItem>
                        <SelectItem value="Budha">Budha</SelectItem>
                        <SelectItem value="Kepercayaan">Kepercayaan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="pekerjaan" className="required">Pekerjaan</Label>
                    <Select 
                      value={formData.pekerjaan} 
                      onValueChange={(value) => handleSelectChange("pekerjaan", value)} 
                      required
                    >
                      <SelectTrigger id="pekerjaan">
                        <SelectValue placeholder="Pilih pekerjaan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PNS">PNS</SelectItem>
                        <SelectItem value="Pedagang">Pedagang</SelectItem>
                        <SelectItem value="Petani">Petani</SelectItem>
                        <SelectItem value="Wiraswasta">Wiraswasta</SelectItem>
                        <SelectItem value="Buruh">Buruh</SelectItem>
                        <SelectItem value="Guru">Guru</SelectItem>
                        <SelectItem value="Dosen">Dosen</SelectItem>
                        <SelectItem value="Polisi">Polisi</SelectItem>
                        <SelectItem value="TNI">TNI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex items-center justify-end gap-2">
          <Link to="/anggota">
            <Button type="button" variant="outline">
              Batal
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : isEditMode ? "Update Data" : "Simpan Data"}
          </Button>
        </div>
      </form>
    </Layout>
  );
}

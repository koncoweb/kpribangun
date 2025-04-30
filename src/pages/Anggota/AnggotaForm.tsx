
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function AnggotaForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi proses penyimpanan
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Anggota berhasil ditambahkan",
        description: "Data anggota baru telah berhasil disimpan",
      });
      navigate("/anggota");
    }, 1000);
  };

  return (
    <Layout pageTitle="Tambah Anggota Baru">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/anggota">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Tambah Anggota Baru</h1>
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
                    <Input id="id" placeholder="ID akan digenerate otomatis" disabled />
                  </div>
                  <div>
                    <Label htmlFor="nik" className="required">NIK</Label>
                    <Input id="nik" placeholder="Masukkan NIK" required />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="nama" className="required">Nama Lengkap</Label>
                  <Input id="nama" placeholder="Masukkan nama lengkap" required />
                </div>
                
                <div>
                  <Label htmlFor="alamat" className="required">Alamat</Label>
                  <Textarea id="alamat" placeholder="Masukkan alamat lengkap" rows={3} required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="noHP" className="required">No HP / WA</Label>
                    <Input id="noHP" placeholder="Contoh: 081234567890" required />
                  </div>
                  
                  <div>
                    <Label className="required">Jenis Kelamin</Label>
                    <RadioGroup defaultValue="L" className="flex gap-4 mt-2">
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
                    <Select required>
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
                    <Select required>
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
            {isSubmitting ? "Menyimpan..." : "Simpan Data"}
          </Button>
        </div>
      </form>
    </Layout>
  );
}


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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

type Anggota = {
  id: string;
  nama: string;
};

export default function TransaksiForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transaksiType, setTransaksiType] = useState<string>("simpan");
  
  // Data contoh
  const anggotaList: Anggota[] = [
    { id: "AG0001", nama: "Budi Santoso" },
    { id: "AG0002", nama: "Dewi Lestari" },
    { id: "AG0003", nama: "Ahmad Hidayat" },
    { id: "AG0004", nama: "Sri Wahyuni" },
    { id: "AG0005", nama: "Agus Setiawan" },
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi proses penyimpanan
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Transaksi berhasil",
        description: `Data transaksi ${transaksiType === "simpan" ? "simpanan" : "pinjaman"} telah berhasil disimpan`,
      });
      navigate("/transaksi");
    }, 1000);
  };

  return (
    <Layout pageTitle="Transaksi Baru">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Buat Transaksi Baru</h1>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Tabs 
            defaultValue="simpan" 
            onValueChange={(value) => setTransaksiType(value)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="simpan">Simpanan</TabsTrigger>
              <TabsTrigger value="pinjam">Pinjaman</TabsTrigger>
            </TabsList>
            
            <TabsContent value="simpan">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tanggal" className="required">Tanggal</Label>
                      <Input id="tanggal" type="date" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="idTransaksi">ID Transaksi</Label>
                      <Input id="idTransaksi" placeholder="ID akan digenerate otomatis" disabled />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="anggota" className="required">Pilih Anggota</Label>
                    <Select required>
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
                      <Label htmlFor="jenisSimpanan" className="required">Jenis Simpanan</Label>
                      <Select required>
                        <SelectTrigger id="jenisSimpanan">
                          <SelectValue placeholder="Pilih jenis simpanan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pokok">Simpanan Pokok</SelectItem>
                          <SelectItem value="wajib">Simpanan Wajib</SelectItem>
                          <SelectItem value="sukarela">Simpanan Sukarela</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="jumlahSimpanan" className="required">Jumlah (Rp)</Label>
                      <Input 
                        id="jumlahSimpanan" 
                        placeholder="Contoh: 500000" 
                        type="number" 
                        min="0" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="keterangan">Keterangan</Label>
                    <Textarea id="keterangan" placeholder="Masukkan keterangan (opsional)" rows={3} />
                  </div>
                  
                  <div className="flex items-center justify-end gap-2 pt-4">
                    <Link to="/transaksi">
                      <Button type="button" variant="outline">
                        Batal
                      </Button>
                    </Link>
                    <Button type="submit" className="bg-koperasi-green hover:bg-green-600" disabled={isSubmitting}>
                      {isSubmitting ? "Memproses..." : "Simpan Transaksi"}
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="pinjam">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tanggalPinjam" className="required">Tanggal</Label>
                      <Input id="tanggalPinjam" type="date" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="idTransaksiPinjam">ID Transaksi</Label>
                      <Input id="idTransaksiPinjam" placeholder="ID akan digenerate otomatis" disabled />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="anggotaPinjam" className="required">Pilih Anggota</Label>
                    <Select required>
                      <SelectTrigger id="anggotaPinjam">
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
                      <Label htmlFor="jumlahPinjaman" className="required">Jumlah Pinjaman (Rp)</Label>
                      <Input 
                        id="jumlahPinjaman" 
                        placeholder="Contoh: 5000000" 
                        type="number" 
                        min="0" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tenorPinjaman" className="required">Tenor (Bulan)</Label>
                      <Select required>
                        <SelectTrigger id="tenorPinjaman">
                          <SelectValue placeholder="Pilih tenor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 Bulan</SelectItem>
                          <SelectItem value="6">6 Bulan</SelectItem>
                          <SelectItem value="12">12 Bulan</SelectItem>
                          <SelectItem value="24">24 Bulan</SelectItem>
                          <SelectItem value="36">36 Bulan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sukuBunga">Suku Bunga (%)</Label>
                      <Input id="sukuBunga" placeholder="1.5" type="number" step="0.1" disabled defaultValue="1.5" />
                      <p className="text-xs text-muted-foreground mt-1">
                        *Suku bunga mengikuti pengaturan sistem
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="tujuanPinjaman" className="required">Tujuan Pinjaman</Label>
                      <Select required>
                        <SelectTrigger id="tujuanPinjaman">
                          <SelectValue placeholder="Pilih tujuan pinjaman" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modal">Modal Usaha</SelectItem>
                          <SelectItem value="pendidikan">Pendidikan</SelectItem>
                          <SelectItem value="renovasi">Renovasi Rumah</SelectItem>
                          <SelectItem value="kesehatan">Biaya Kesehatan</SelectItem>
                          <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="keteranganPinjaman">Keterangan</Label>
                    <Textarea id="keteranganPinjaman" placeholder="Masukkan keterangan (opsional)" rows={3} />
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium text-sm mb-2">Informasi Angsuran</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Angsuran per bulan</p>
                        <p className="font-medium">Rp 875.000</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total yang harus dibayar</p>
                        <p className="font-medium">Rp 5.250.000</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2 pt-4">
                    <Link to="/transaksi">
                      <Button type="button" variant="outline">
                        Batal
                      </Button>
                    </Link>
                    <Button type="submit" className="bg-koperasi-blue hover:bg-blue-600" disabled={isSubmitting}>
                      {isSubmitting ? "Memproses..." : "Simpan Transaksi"}
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
}

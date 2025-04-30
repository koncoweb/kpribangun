
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { useToast } from "@/components/ui/use-toast";
import { getAllAnggota } from "@/services/anggotaService";
import { createTransaksi } from "@/services/transaksiService";
import { calculateAngsuran, getPengaturan } from "@/services/pengaturanService";
import { Anggota } from "@/types";

export default function TransaksiForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transaksiType, setTransaksiType] = useState<string>("simpan");
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [pengaturan, setPengaturan] = useState(getPengaturan());
  
  // Form state for simpanan
  const [simpananForm, setSimpananForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    anggotaId: "",
    jenisSimpanan: "",
    jumlah: 0,
    keterangan: ""
  });
  
  // Form state for pinjaman
  const [pinjamanForm, setPinjamanForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    anggotaId: "",
    jumlah: 0,
    tenor: pengaturan.tenor.defaultTenor.toString(),
    sukuBunga: pengaturan.sukuBunga.pinjaman,
    tujuanPinjaman: "",
    keterangan: ""
  });
  
  // Calculated values for pinjaman preview
  const [pinjamanPreview, setPinjamanPreview] = useState({
    angsuranPerBulan: 0,
    totalBayar: 0
  });
  
  useEffect(() => {
    // Load anggota from local storage
    const loadedAnggota = getAllAnggota();
    setAnggotaList(loadedAnggota);
    
    // Load pengaturan
    const loadedPengaturan = getPengaturan();
    setPengaturan(loadedPengaturan);
    
    // Set default tenor
    setPinjamanForm(prev => ({
      ...prev,
      tenor: loadedPengaturan.tenor.defaultTenor.toString(),
      sukuBunga: loadedPengaturan.sukuBunga.pinjaman
    }));
  }, []);
  
  // Calculate pinjaman preview when amount or tenor changes
  useEffect(() => {
    if (pinjamanForm.jumlah > 0 && pinjamanForm.tenor) {
      const result = calculateAngsuran(
        pinjamanForm.jumlah, 
        parseInt(pinjamanForm.tenor)
      );
      setPinjamanPreview(result);
    }
  }, [pinjamanForm.jumlah, pinjamanForm.tenor]);
  
  const handleSimpananChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSimpananForm(prev => ({ ...prev, [id]: id === "jumlah" ? Number(value) : value }));
  };
  
  const handlePinjamanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setPinjamanForm(prev => ({ ...prev, [id]: id === "jumlah" ? Number(value) : value }));
  };
  
  const handleSelectChange = (formType: "simpanan" | "pinjaman", name: string, value: string) => {
    if (formType === "simpanan") {
      setSimpananForm(prev => ({ ...prev, [name]: value }));
    } else {
      setPinjamanForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const validateSimpananForm = () => {
    if (!simpananForm.tanggal) {
      toast({
        title: "Tanggal wajib diisi",
        variant: "destructive",
      });
      return false;
    }
    
    if (!simpananForm.anggotaId) {
      toast({
        title: "Anggota wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    if (!simpananForm.jenisSimpanan) {
      toast({
        title: "Jenis simpanan wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    if (!simpananForm.jumlah || simpananForm.jumlah <= 0) {
      toast({
        title: "Jumlah harus lebih dari 0",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const validatePinjamanForm = () => {
    if (!pinjamanForm.tanggal) {
      toast({
        title: "Tanggal wajib diisi",
        variant: "destructive",
      });
      return false;
    }
    
    if (!pinjamanForm.anggotaId) {
      toast({
        title: "Anggota wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    if (!pinjamanForm.jumlah || pinjamanForm.jumlah <= 0) {
      toast({
        title: "Jumlah pinjaman harus lebih dari 0",
        variant: "destructive",
      });
      return false;
    }
    
    if (!pinjamanForm.tenor) {
      toast({
        title: "Tenor wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    if (!pinjamanForm.tujuanPinjaman) {
      toast({
        title: "Tujuan pinjaman wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmitSimpanan = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSimpananForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const newTransaksi = createTransaksi({
        tanggal: simpananForm.tanggal,
        anggotaId: simpananForm.anggotaId,
        jenis: "Simpan",
        jumlah: simpananForm.jumlah,
        keterangan: `${simpananForm.jenisSimpanan} - ${simpananForm.keterangan || ""}`.trim(),
        status: "Sukses"
      });
      
      if (newTransaksi) {
        toast({
          title: "Transaksi simpanan berhasil",
          description: `Transaksi simpanan dengan ID ${newTransaksi.id} telah berhasil disimpan`,
        });
        navigate("/transaksi");
      } else {
        throw new Error("Gagal membuat transaksi simpanan");
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan transaksi simpanan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmitPinjaman = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePinjamanForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const newTransaksi = createTransaksi({
        tanggal: pinjamanForm.tanggal,
        anggotaId: pinjamanForm.anggotaId,
        jenis: "Pinjam",
        jumlah: pinjamanForm.jumlah,
        keterangan: `Tenor: ${pinjamanForm.tenor} bulan, Bunga: ${pinjamanForm.sukuBunga}%, Tujuan: ${pinjamanForm.tujuanPinjaman}${pinjamanForm.keterangan ? `, ${pinjamanForm.keterangan}` : ''}`,
        status: "Sukses"
      });
      
      if (newTransaksi) {
        toast({
          title: "Transaksi pinjaman berhasil",
          description: `Transaksi pinjaman dengan ID ${newTransaksi.id} telah berhasil disimpan`,
        });
        navigate("/transaksi");
      } else {
        throw new Error("Gagal membuat transaksi pinjaman");
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan transaksi pinjaman. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              <form onSubmit={handleSubmitSimpanan}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tanggal" className="required">Tanggal</Label>
                      <Input 
                        id="tanggal" 
                        type="date"
                        value={simpananForm.tanggal}
                        onChange={handleSimpananChange}
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="idTransaksi">ID Transaksi</Label>
                      <Input id="idTransaksi" placeholder="ID akan digenerate otomatis" disabled />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="anggota" className="required">Pilih Anggota</Label>
                    <Select 
                      value={simpananForm.anggotaId}
                      onValueChange={(value) => handleSelectChange("simpanan", "anggotaId", value)}
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
                      <Label htmlFor="jenisSimpanan" className="required">Jenis Simpanan</Label>
                      <Select 
                        value={simpananForm.jenisSimpanan}
                        onValueChange={(value) => handleSelectChange("simpanan", "jenisSimpanan", value)}
                        required
                      >
                        <SelectTrigger id="jenisSimpanan">
                          <SelectValue placeholder="Pilih jenis simpanan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Simpanan Pokok">Simpanan Pokok</SelectItem>
                          <SelectItem value="Simpanan Wajib">Simpanan Wajib</SelectItem>
                          <SelectItem value="Simpanan Sukarela">Simpanan Sukarela</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="jumlah" className="required">Jumlah (Rp)</Label>
                      <Input 
                        id="jumlah" 
                        placeholder="Contoh: 500000" 
                        type="number" 
                        min="0" 
                        value={simpananForm.jumlah || ""}
                        onChange={handleSimpananChange}
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
                      value={simpananForm.keterangan}
                      onChange={handleSimpananChange}
                    />
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
              <form onSubmit={handleSubmitPinjaman}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tanggal" className="required">Tanggal</Label>
                      <Input 
                        id="tanggal" 
                        type="date"
                        value={pinjamanForm.tanggal}
                        onChange={handlePinjamanChange}
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="idTransaksi">ID Transaksi</Label>
                      <Input id="idTransaksi" placeholder="ID akan digenerate otomatis" disabled />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="anggotaId" className="required">Pilih Anggota</Label>
                    <Select 
                      value={pinjamanForm.anggotaId}
                      onValueChange={(value) => handleSelectChange("pinjaman", "anggotaId", value)}
                      required
                    >
                      <SelectTrigger id="anggotaId">
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
                      <Label htmlFor="jumlah" className="required">Jumlah Pinjaman (Rp)</Label>
                      <Input 
                        id="jumlah" 
                        placeholder="Contoh: 5000000" 
                        type="number" 
                        min="0"
                        value={pinjamanForm.jumlah || ""}
                        onChange={handlePinjamanChange}
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tenor" className="required">Tenor (Bulan)</Label>
                      <Select 
                        value={pinjamanForm.tenor}
                        onValueChange={(value) => handleSelectChange("pinjaman", "tenor", value)}
                        required
                      >
                        <SelectTrigger id="tenor">
                          <SelectValue placeholder="Pilih tenor" />
                        </SelectTrigger>
                        <SelectContent>
                          {pengaturan.tenor.tenorOptions.map((option) => (
                            <SelectItem key={option} value={option.toString()}>
                              {option} Bulan
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sukuBunga">Suku Bunga (%)</Label>
                      <Input 
                        id="sukuBunga" 
                        type="number" 
                        step="0.1" 
                        disabled 
                        value={pinjamanForm.sukuBunga}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        *Suku bunga mengikuti pengaturan sistem
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="tujuanPinjaman" className="required">Tujuan Pinjaman</Label>
                      <Select 
                        value={pinjamanForm.tujuanPinjaman}
                        onValueChange={(value) => handleSelectChange("pinjaman", "tujuanPinjaman", value)}
                        required
                      >
                        <SelectTrigger id="tujuanPinjaman">
                          <SelectValue placeholder="Pilih tujuan pinjaman" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Modal Usaha">Modal Usaha</SelectItem>
                          <SelectItem value="Pendidikan">Pendidikan</SelectItem>
                          <SelectItem value="Renovasi Rumah">Renovasi Rumah</SelectItem>
                          <SelectItem value="Biaya Kesehatan">Biaya Kesehatan</SelectItem>
                          <SelectItem value="Lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="keterangan">Keterangan</Label>
                    <Textarea 
                      id="keterangan" 
                      placeholder="Masukkan keterangan (opsional)" 
                      rows={3}
                      value={pinjamanForm.keterangan}
                      onChange={handlePinjamanChange}
                    />
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium text-sm mb-2">Informasi Angsuran</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Angsuran per bulan</p>
                        <p className="font-medium">
                          Rp {pinjamanPreview.angsuranPerBulan.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total yang harus dibayar</p>
                        <p className="font-medium">
                          Rp {pinjamanPreview.totalBayar.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                        </p>
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


import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllAnggota } from "@/services/anggotaService";
import { Anggota, Transaksi } from "@/types";
import { FormActions } from "@/components/anggota/FormActions";
import { 
  calculateTotalPinjaman, 
  calculateTotalSimpanan,
  createTransaksi, 
  getAllTransaksi, 
  getTransaksiById 
} from "@/services/transaksi";

export default function AngsuranForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [pinjamanList, setPinjamanList] = useState<Transaksi[]>([]);
  
  // Get pinjamanId from location state if available
  const initialPinjamanId = location.state?.pinjamanId || "";
  const [selectedAnggotaId, setSelectedAnggotaId] = useState<string>("");
  
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    anggotaId: "",
    pinjamanId: initialPinjamanId,
    jumlah: 0,
    keterangan: "",
    angsuranKe: 1,
    useSimnpanan: false
  });
  
  const [pinjamanInfo, setPinjamanInfo] = useState({
    total: 0,
    terbayar: 0,
    sisaPinjaman: 0,
    angsuranPerBulan: 0,
    angsuranKe: 1,
    tenor: 12,
    simpananBalance: 0
  });
  
  useEffect(() => {
    // Load anggota list
    const loadedAnggota = getAllAnggota();
    setAnggotaList(loadedAnggota);
    
    // Load all transaksi for pinjaman options
    const allTransaksi = getAllTransaksi();
    const pinjamanTransaksi = allTransaksi.filter(t => t.jenis === "Pinjam" && t.status === "Sukses");
    setPinjamanList(pinjamanTransaksi);
    
    // If pinjamanId is provided from state, load the pinjaman details
    if (initialPinjamanId) {
      const pinjaman = getTransaksiById(initialPinjamanId);
      if (pinjaman) {
        setFormData(prev => ({
          ...prev,
          anggotaId: pinjaman.anggotaId,
        }));
        setSelectedAnggotaId(pinjaman.anggotaId);
        loadPinjamanInfo(pinjaman.anggotaId, initialPinjamanId);
      }
    }
  }, [initialPinjamanId]);
  
  // Load pinjaman info when anggota changes
  const loadPinjamanInfo = (anggotaId: string, selectedPinjamanId?: string) => {
    const totalPinjaman = calculateTotalPinjaman(anggotaId);
    const simpananBalance = calculateTotalSimpanan(anggotaId);
    const allTransaksi = getAllTransaksi();
    
    // Filter pinjaman list to only show this anggota's pinjaman
    const anggotaPinjaman = allTransaksi.filter(
      p => p.anggotaId === anggotaId && p.jenis === "Pinjam" && p.status === "Sukses"
    );
    setPinjamanList(anggotaPinjaman);
    
    // If there's a selected pinjaman or only one pinjaman, get its details
    const pinjamanToLoad = selectedPinjamanId || (anggotaPinjaman.length === 1 ? anggotaPinjaman[0].id : null);
    
    if (pinjamanToLoad) {
      const pinjaman = getTransaksiById(pinjamanToLoad);
      if (pinjaman) {
        // Calculate total angsuran already paid for this pinjaman
        const angsuranTransaksi = allTransaksi.filter(
          t => t.jenis === "Angsuran" && 
               t.status === "Sukses" && 
               t.anggotaId === anggotaId && 
               t.keterangan?.includes(pinjamanToLoad)
        );
        
        const totalAngsuran = angsuranTransaksi.reduce((total, t) => total + t.jumlah, 0);
        const sisaPinjaman = Math.max(0, pinjaman.jumlah - totalAngsuran);
        
        // Try to parse tenor and angsuran per bulan from keterangan
        let tenor = 12; // Default tenor
        let angsuranPerBulan = Math.ceil(pinjaman.jumlah / tenor);
        
        if (pinjaman.keterangan) {
          const tenorMatch = pinjaman.keterangan.match(/Tenor: (\d+) bulan/);
          const angsuranMatch = pinjaman.keterangan.match(/Angsuran per bulan: Rp ([0-9,.]+)/);
          
          if (tenorMatch && tenorMatch[1]) {
            tenor = parseInt(tenorMatch[1]);
          }
          
          if (angsuranMatch && angsuranMatch[1]) {
            angsuranPerBulan = parseInt(angsuranMatch[1].replace(/[,.]/g, ""));
          }
        }
        
        // Calculate which angsuran number this would be
        const angsuranKe = angsuranTransaksi.length + 1;
        
        setPinjamanInfo({
          total: pinjaman.jumlah,
          terbayar: totalAngsuran,
          sisaPinjaman,
          angsuranPerBulan,
          angsuranKe,
          tenor,
          simpananBalance
        });
        
        // Update formData with suggested angsuran amount
        setFormData(prev => ({ 
          ...prev, 
          pinjamanId: pinjamanToLoad,
          jumlah: Math.min(angsuranPerBulan, sisaPinjaman), // Don't exceed remaining loan amount
          angsuranKe
        }));
      }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === "jumlah" ? Number(value) : value
    }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      useSimnpanan: checked
    }));
  };
  
  const handleSelectAnggota = (anggotaId: string) => {
    setSelectedAnggotaId(anggotaId);
    setFormData(prev => ({ 
      ...prev, 
      anggotaId,
      pinjamanId: "" // Reset pinjamanId when anggota changes
    }));
    
    loadPinjamanInfo(anggotaId);
  };
  
  const handleSelectPinjaman = (pinjamanId: string) => {
    setFormData(prev => ({ ...prev, pinjamanId }));
    loadPinjamanInfo(selectedAnggotaId, pinjamanId);
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
    
    if (!formData.pinjamanId) {
      toast({
        title: "Pinjaman wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.jumlah || formData.jumlah <= 0) {
      toast({
        title: "Jumlah angsuran harus lebih dari 0",
        variant: "destructive",
      });
      return false;
    }
    
    if (formData.jumlah > pinjamanInfo.sisaPinjaman) {
      toast({
        title: "Jumlah angsuran melebihi sisa pinjaman",
        description: `Sisa pinjaman yang harus dibayar adalah Rp ${pinjamanInfo.sisaPinjaman.toLocaleString("id-ID")}`,
        variant: "destructive",
      });
      return false;
    }

    // Validate if using simpanan payment
    if (formData.useSimnpanan && formData.jumlah > pinjamanInfo.simpananBalance) {
      toast({
        title: "Saldo simpanan tidak mencukupi",
        description: `Saldo simpanan anggota adalah Rp ${pinjamanInfo.simpananBalance.toLocaleString("id-ID")}`,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Get pinjaman details for reference
      const pinjaman = getTransaksiById(formData.pinjamanId);
      const keteranganPinjaman = `Angsuran ke-${pinjamanInfo.angsuranKe} untuk pinjaman #${formData.pinjamanId}`;
      
      // Create angsuran transaksi
      const newTransaksi = createTransaksi({
        tanggal: formData.tanggal,
        anggotaId: formData.anggotaId,
        jenis: "Angsuran",
        jumlah: formData.jumlah,
        keterangan: formData.useSimnpanan 
          ? `${keteranganPinjaman} (Dibayar dari simpanan)${formData.keterangan ? ': ' + formData.keterangan : ''}`
          : `${keteranganPinjaman}${formData.keterangan ? ': ' + formData.keterangan : ''}`,
        status: "Sukses"
      });
      
      // If using simpanan for payment, create a withdraw transaction
      if (formData.useSimnpanan) {
        const simpananTransaksi = createTransaksi({
          tanggal: formData.tanggal,
          anggotaId: formData.anggotaId,
          jenis: "Simpan",
          jumlah: -formData.jumlah, // Negative for withdrawal
          keterangan: `Penarikan simpanan untuk ${keteranganPinjaman}`,
          status: "Sukses"
        });

        if (!simpananTransaksi) {
          throw new Error("Gagal membuat transaksi penarikan simpanan");
        }
      }

      if (newTransaksi) {
        toast({
          title: "Angsuran berhasil disimpan",
          description: formData.useSimnpanan 
            ? `Angsuran dengan ID ${newTransaksi.id} telah berhasil disimpan dengan menggunakan saldo simpanan` 
            : `Angsuran dengan ID ${newTransaksi.id} telah berhasil disimpan`,
        });
        navigate("/transaksi/angsuran");
      } else {
        throw new Error("Gagal menyimpan angsuran");
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: error instanceof Error ? error.message : "Gagal menyimpan angsuran. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <Layout pageTitle="Tambah Angsuran">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi/angsuran">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Tambah Angsuran</h1>
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
                  <Label htmlFor="idTransaksi">ID Transaksi</Label>
                  <Input id="idTransaksi" placeholder="ID akan digenerate otomatis" disabled />
                </div>
              </div>
              
              <div>
                <Label htmlFor="anggotaId" className="required">Pilih Anggota</Label>
                <Select 
                  value={formData.anggotaId}
                  onValueChange={handleSelectAnggota}
                  required
                  disabled={!!initialPinjamanId} // Disable if pinjamanId is provided
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
              
              {selectedAnggotaId && pinjamanInfo.sisaPinjaman > 0 && (
                <div className="bg-amber-50 p-4 rounded-md">
                  <p className="font-semibold mb-2">Informasi Pinjaman</p>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Pinjaman:</p>
                      <p className="font-medium">{formatCurrency(pinjamanInfo.total)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Terbayar:</p>
                      <p className="font-medium">{formatCurrency(pinjamanInfo.terbayar)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sisa Pinjaman:</p>
                      <p className="font-medium">{formatCurrency(pinjamanInfo.sisaPinjaman)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Angsuran ke-:</p>
                      <p className="font-medium">{pinjamanInfo.angsuranKe} dari {pinjamanInfo.tenor}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Saldo Simpanan:</p>
                      <p className="font-medium">{formatCurrency(pinjamanInfo.simpananBalance)}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedAnggotaId && pinjamanInfo.sisaPinjaman <= 0 && (
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-green-800">
                    Anggota ini tidak memiliki pinjaman yang perlu dibayar.
                  </p>
                </div>
              )}
              
              {selectedAnggotaId && pinjamanList.length > 0 && (
                <>
                  <div>
                    <Label htmlFor="pinjamanId" className="required">Pilih Pinjaman</Label>
                    <Select 
                      value={formData.pinjamanId}
                      onValueChange={handleSelectPinjaman}
                      required
                      disabled={pinjamanList.length === 0}
                    >
                      <SelectTrigger id="pinjamanId">
                        <SelectValue placeholder="Pilih pinjaman" />
                      </SelectTrigger>
                      <SelectContent>
                        {pinjamanList.map((pinjaman) => (
                          <SelectItem key={pinjaman.id} value={pinjaman.id}>
                            {pinjaman.id} - {formatCurrency(pinjaman.jumlah)} ({new Date(pinjaman.tanggal).toLocaleDateString("id-ID")})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="angsuranKe">Angsuran Ke</Label>
                      <Input 
                        id="angsuranKe" 
                        value={pinjamanInfo.angsuranKe}
                        disabled
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Angsuran ke-{pinjamanInfo.angsuranKe} dari {pinjamanInfo.tenor}
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="jumlah" className="required">Jumlah Angsuran (Rp)</Label>
                      <Input 
                        id="jumlah" 
                        placeholder="Contoh: 500000" 
                        type="number" 
                        min="0" 
                        max={pinjamanInfo.sisaPinjaman}
                        value={formData.jumlah || ""}
                        onChange={handleInputChange}
                        required 
                      />
                      {pinjamanInfo.angsuranPerBulan > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Angsuran yang disarankan: {formatCurrency(Math.min(pinjamanInfo.angsuranPerBulan, pinjamanInfo.sisaPinjaman))}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="useSimnpanan" 
                      checked={formData.useSimnpanan}
                      onCheckedChange={handleCheckboxChange}
                      disabled={pinjamanInfo.simpananBalance < formData.jumlah}
                    />
                    <label
                      htmlFor="useSimnpanan"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Bayar menggunakan dana simpanan
                    </label>
                  </div>
                  
                  {formData.useSimnpanan && (
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-sm">
                        Pembayaran akan menggunakan dana simpanan anggota sebesar {formatCurrency(formData.jumlah)}.
                        Saldo simpanan setelah pembayaran: {formatCurrency(pinjamanInfo.simpananBalance - formData.jumlah)}
                      </p>
                    </div>
                  )}
                  
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
                    isEditMode={false}
                    cancelHref="/transaksi/angsuran"
                  />
                </>
              )}
              
              {selectedAnggotaId && pinjamanList.length === 0 && (
                <div className="bg-yellow-50 p-4 rounded-md">
                  <p className="text-yellow-800">
                    Anggota ini tidak memiliki catatan pinjaman aktif. Silakan pilih anggota lain atau buat pinjaman terlebih dahulu.
                  </p>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/transaksi/pinjam/tambah")}
                    >
                      Buat Pinjaman Baru
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
}

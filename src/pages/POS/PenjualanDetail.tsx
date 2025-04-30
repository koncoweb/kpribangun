
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Pencil, Printer, Receipt, Ban, Check } from "lucide-react";
import { Penjualan, ProdukItem } from "@/types";
import { getPenjualanById, updatePenjualan } from "@/services/penjualanService";
import { getProdukItemById } from "@/services/produkService";
import { getKasirById, getAllKasir } from "@/services/kasirService";
import { formatRupiah, formatDateTime } from "@/lib/utils";

export default function PenjualanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [penjualan, setPenjualan] = useState<Penjualan | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editForm, setEditForm] = useState({
    catatan: "",
    kasirId: ""
  });
  
  useEffect(() => {
    if (id) {
      const foundPenjualan = getPenjualanById(id);
      if (foundPenjualan) {
        setPenjualan(foundPenjualan);
        setEditForm({
          catatan: foundPenjualan.catatan || "",
          kasirId: foundPenjualan.kasirId
        });
      } else {
        toast({
          title: "Data tidak ditemukan",
          description: "Transaksi penjualan tidak ditemukan",
          variant: "destructive"
        });
        navigate("/pos/penjualan-list");
      }
    }
  }, [id, navigate, toast]);
  
  const getProductName = (productId: string): string => {
    const product = getProdukItemById(productId);
    return product ? product.nama : "Produk tidak ditemukan";
  };
  
  const getKasirName = (kasirId: string): string => {
    const kasir = getKasirById(kasirId);
    return kasir ? kasir.nama : "Kasir tidak ditemukan";
  };
  
  const handleEditSubmit = () => {
    if (!penjualan || !id) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedPenjualan = updatePenjualan(id, {
        catatan: editForm.catatan,
        kasirId: editForm.kasirId
      });
      
      if (updatedPenjualan) {
        setPenjualan(updatedPenjualan);
        toast({
          title: "Transaksi berhasil diperbarui",
          description: "Data transaksi telah diperbarui"
        });
        setIsEditDialogOpen(false); // Fixed variable name
      } else {
        throw new Error("Gagal memperbarui transaksi");
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal memperbarui data transaksi",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleStatusChange = (newStatus: "sukses" | "dibatalkan") => {
    if (!penjualan || !id) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedPenjualan = updatePenjualan(id, {
        status: newStatus
      });
      
      if (updatedPenjualan) {
        setPenjualan(updatedPenjualan);
        toast({
          title: "Status berhasil diperbarui",
          description: `Status transaksi diubah menjadi ${newStatus === "sukses" ? "Sukses" : "Dibatalkan"}`
        });
        setIsStatusDialogOpen(false);
      } else {
        throw new Error("Gagal memperbarui status");
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal memperbarui status transaksi",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePrintReceipt = () => {
    toast({
      title: "Cetak Struk",
      description: "Fitur cetak struk akan segera tersedia"
    });
  };
  
  if (!penjualan) {
    return (
      <Layout pageTitle="Detail Penjualan">
        <div className="flex justify-center items-center h-64">
          <p>Memuat data penjualan...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout pageTitle={`Detail Penjualan - ${penjualan.nomorTransaksi}`}>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/pos/penjualan-list">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Detail Penjualan</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informasi Transaksi</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => setEditDialogOpen(true)}
              >
                <Pencil size={14} /> Edit
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handlePrintReceipt}
              >
                <Printer size={14} /> Cetak
              </Button>
              
              {penjualan.status === "sukses" ? (
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1"
                  onClick={() => setIsStatusDialogOpen(true)}
                >
                  <Ban size={14} /> Batalkan
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1"
                  onClick={() => setIsStatusDialogOpen(true)}
                >
                  <Check size={14} /> Tandai Sukses
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Informasi Umum</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Nomor Transaksi</span>
                    <span className="text-sm font-medium">{penjualan.nomorTransaksi}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tanggal & Waktu</span>
                    <span className="text-sm">{formatDateTime(penjualan.tanggal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Kasir</span>
                    <span className="text-sm">{getKasirName(penjualan.kasirId)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      penjualan.status === "sukses" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {penjualan.status === "sukses" ? "Sukses" : "Dibatalkan"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Informasi Pembayaran</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Metode Pembayaran</span>
                    <span className="text-sm">
                      {penjualan.metodePembayaran === "cash" ? "Tunai" :
                       penjualan.metodePembayaran === "debit" ? "Debit" :
                       penjualan.metodePembayaran === "kredit" ? "Kartu Kredit" : "QRIS"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-sm">{formatRupiah(penjualan.subtotal)}</span>
                  </div>
                  {penjualan.diskon > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Diskon ({penjualan.diskon}%)</span>
                      <span className="text-sm text-destructive">-{formatRupiah((penjualan.subtotal * penjualan.diskon) / 100)}</span>
                    </div>
                  )}
                  {penjualan.pajak > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pajak ({penjualan.pajak}%)</span>
                      <span className="text-sm">{formatRupiah((penjualan.subtotal * (1 - penjualan.diskon / 100) * penjualan.pajak) / 100)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-sm font-bold">{formatRupiah(penjualan.total)}</span>
                  </div>
                  
                  {penjualan.metodePembayaran === "cash" && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Dibayar</span>
                        <span className="text-sm">{formatRupiah(penjualan.dibayar)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Kembalian</span>
                        <span className="text-sm">{formatRupiah(penjualan.kembalian)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {penjualan.catatan && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Catatan</h3>
                <p className="text-sm p-3 bg-muted rounded-md">{penjualan.catatan}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" /> Struk Pembelian
            </CardTitle>
          </CardHeader>
          
          <CardContent className="border-t pt-4">
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg">Koperasi Sejahtera</h3>
              <p className="text-xs text-muted-foreground">Jl. Raya Utama No. 123</p>
              <p className="text-xs text-muted-foreground">Telp: 021-1234567</p>
            </div>
            
            <div className="flex justify-between text-xs mb-4">
              <span>{formatDateTime(penjualan.tanggal)}</span>
              <span>{penjualan.nomorTransaksi}</span>
            </div>
            
            <div className="border-t border-dashed pt-2 pb-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Kasir:</span>
                <span>{getKasirName(penjualan.kasirId)}</span>
              </div>
            </div>
            
            <div className="border-y border-dashed py-2 space-y-1 my-2">
              {penjualan.items.map((item, index) => {
                const product = getProdukItemById(item.produkId);
                if (!product) return null;
                
                return (
                  <div key={index} className="text-xs">
                    <div className="flex justify-between">
                      <span className="font-medium">{product.nama}</span>
                      <span>{formatRupiah(item.total)}</span>
                    </div>
                    <div className="text-muted-foreground ml-2">
                      {item.jumlah} x {formatRupiah(item.hargaSatuan)}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-1 py-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(penjualan.subtotal)}</span>
              </div>
              
              {penjualan.diskon > 0 && (
                <div className="flex justify-between">
                  <span>Diskon ({penjualan.diskon}%)</span>
                  <span>-{formatRupiah((penjualan.subtotal * penjualan.diskon) / 100)}</span>
                </div>
              )}
              
              {penjualan.pajak > 0 && (
                <div className="flex justify-between">
                  <span>Pajak ({penjualan.pajak}%)</span>
                  <span>{formatRupiah((penjualan.subtotal * (1 - penjualan.diskon / 100) * penjualan.pajak) / 100)}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-dashed pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>{formatRupiah(penjualan.total)}</span>
              </div>
              
              {penjualan.metodePembayaran === "cash" && (
                <>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Tunai</span>
                    <span>{formatRupiah(penjualan.dibayar)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Kembalian</span>
                    <span>{formatRupiah(penjualan.kembalian)}</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-6 text-center space-y-1">
              <div className="text-xs">
                <span>Metode Pembayaran: </span>
                <span className="font-medium">
                  {penjualan.metodePembayaran === "cash" ? "TUNAI" :
                   penjualan.metodePembayaran === "debit" ? "KARTU DEBIT" :
                   penjualan.metodePembayaran === "kredit" ? "KARTU KREDIT" : "QRIS"}
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground pt-4">
                Terima kasih atas kunjungan Anda
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Daftar Item Pembelian</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead className="text-right">Harga Satuan</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {penjualan.items.map((item, index) => {
                  const product = getProdukItemById(item.produkId);
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {product ? (
                          <div>
                            <div className="font-medium">{product.nama}</div>
                            <div className="text-xs text-muted-foreground">
                              {product.kode}
                            </div>
                          </div>
                        ) : (
                          "Produk tidak ditemukan"
                        )}
                      </TableCell>
                      <TableCell className="text-right">{formatRupiah(item.hargaSatuan)}</TableCell>
                      <TableCell className="text-right">{item.jumlah}</TableCell>
                      <TableCell className="text-right font-medium">{formatRupiah(item.total)}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-medium">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatRupiah(penjualan.subtotal)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaksi</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="kasirId">Kasir</Label>
              <Select
                value={editForm.kasirId}
                onValueChange={(value) => setEditForm(prev => ({ ...prev, kasirId: value }))}
              >
                <SelectTrigger id="kasirId">
                  <SelectValue placeholder="Pilih kasir" />
                </SelectTrigger>
                <SelectContent>
                  {getAllKasir().filter(k => k.aktif).map((kasir) => (
                    <SelectItem key={kasir.id} value={kasir.id}>
                      {kasir.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea
                id="catatan"
                placeholder="Tambahkan catatan (opsional)"
                value={editForm.catatan}
                onChange={(e) => setEditForm(prev => ({ ...prev, catatan: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEditSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {penjualan.status === "sukses" ? "Batalkan Transaksi" : "Tandai Sebagai Sukses"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm">
              {penjualan.status === "sukses" 
                ? "Membatalkan transaksi akan mengembalikan stok produk. Yakin ingin melanjutkan?" 
                : "Menandai transaksi sebagai sukses akan mengurangi stok produk. Yakin ingin melanjutkan?"}
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Tidak
            </Button>
            <Button 
              variant={penjualan.status === "sukses" ? "destructive" : "default"}
              onClick={() => handleStatusChange(penjualan.status === "sukses" ? "dibatalkan" : "sukses")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memproses..." : "Ya, Lanjutkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

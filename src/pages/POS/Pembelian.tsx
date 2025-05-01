
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { formatCurrency } from "@/utils/formatters";
import { 
  Plus, 
  FileEdit, 
  Trash2, 
  Search, 
  Check, 
  X,
  FileText
} from "lucide-react";
import { Pembelian, PembelianItem, Pemasok } from "@/types";
import { 
  getAllPembelian, 
  createPembelian, 
  updatePembelian, 
  deletePembelian, 
  getAllPemasok 
} from "@/services/pembelianService";
import { getAllProdukItems } from "@/services/produkService";

export default function PembelianPage() {
  const navigate = useNavigate();
  const [pembelianList, setPembelianList] = useState<Pembelian[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [pemasokList, setPemasokList] = useState<Pemasok[]>([]);
  const [currentPembelian, setCurrentPembelian] = useState<Pembelian | null>(null);
  const [selectedPembelianId, setSelectedPembelianId] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<Partial<Pembelian>>({
    tanggal: new Date().toISOString().split("T")[0],
    pemasok: "",
    items: [],
    subtotal: 0,
    diskon: 0,
    ppn: 0,
    total: 0,
    status: "proses",
    catatan: ""
  });
  
  useEffect(() => {
    loadPembelian();
    setPemasokList(getAllPemasok());
  }, []);
  
  const loadPembelian = () => {
    setPembelianList(getAllPembelian());
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredPembelian = pembelianList.filter(item => 
    item.nomorTransaksi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.pemasok.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const openNewForm = () => {
    setFormData({
      tanggal: new Date().toISOString().split("T")[0],
      pemasok: "",
      items: [],
      subtotal: 0,
      diskon: 0,
      ppn: 0,
      total: 0,
      status: "proses",
      catatan: ""
    });
    setCurrentPembelian(null);
    setIsFormOpen(true);
  };
  
  const openEditForm = (id: string) => {
    const pembelian = pembelianList.find(item => item.id === id);
    if (pembelian) {
      setFormData({
        tanggal: pembelian.tanggal,
        pemasokId: pembelian.pemasokId,
        pemasok: pembelian.pemasok,
        items: [...pembelian.items],
        subtotal: pembelian.subtotal,
        diskon: pembelian.diskon || 0,
        ppn: pembelian.ppn || 0,
        total: pembelian.total,
        status: pembelian.status,
        catatan: pembelian.catatan || ""
      });
      setCurrentPembelian(pembelian);
      setIsFormOpen(true);
    }
  };
  
  const openDeleteDialog = (id: string) => {
    setSelectedPembelianId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const openDetailDialog = (id: string) => {
    const pembelian = pembelianList.find(item => item.id === id);
    if (pembelian) {
      setCurrentPembelian(pembelian);
      setIsDetailDialogOpen(true);
    }
  };
  
  const handleDelete = () => {
    if (selectedPembelianId) {
      const result = deletePembelian(selectedPembelianId);
      if (result) {
        toast.success("Pembelian berhasil dihapus");
        loadPembelian();
      } else {
        toast.error("Gagal menghapus pembelian");
      }
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleStatusChange = (status: string) => {
    setFormData({
      ...formData,
      status: status as "proses" | "selesai" | "dibatalkan"
    });
  };
  
  const handlePemasokChange = (pemasokId: string) => {
    const pemasok = pemasokList.find(s => s.id === pemasokId);
    setFormData({
      ...formData,
      pemasokId: pemasokId,
      pemasok: pemasok?.nama || ""
    });
  };
  
  const calculateTotal = () => {
    const subtotal = formData.items?.reduce((sum, item) => sum + item.total, 0) || 0;
    const diskon = formData.diskon || 0;
    const ppn = formData.ppn || 0;
    
    const total = subtotal - diskon + ppn;
    
    setFormData({
      ...formData,
      subtotal,
      total
    });
  };
  
  const handleSave = () => {
    if (!formData.pemasok || !formData.items?.length) {
      toast.error("Silakan lengkapi data pembelian");
      return;
    }
    
    if (currentPembelian) {
      // Update existing purchase
      const updatedPembelian = updatePembelian(currentPembelian.id, formData);
      if (updatedPembelian) {
        toast.success("Pembelian berhasil diperbarui");
        loadPembelian();
        setIsFormOpen(false);
      } else {
        toast.error("Gagal memperbarui pembelian");
      }
    } else {
      // Create new purchase
      createPembelian(formData as Omit<Pembelian, "id" | "nomorTransaksi" | "createdAt">);
      toast.success("Pembelian baru berhasil ditambahkan");
      loadPembelian();
      setIsFormOpen(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "selesai":
        return <Badge className="bg-green-500">Selesai</Badge>;
      case "proses":
        return <Badge className="bg-blue-500">Proses</Badge>;
      case "dibatalkan":
        return <Badge className="bg-red-500">Dibatalkan</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  return (
    <Layout pageTitle="Pembelian Barang">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pembelian Barang</h1>
        <Button onClick={openNewForm} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Tambah Pembelian
        </Button>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Cari berdasarkan nomor, pemasok, atau status..."
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-md"
        />
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor Transaksi</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Pemasok</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPembelian.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    Tidak ada data pembelian
                  </TableCell>
                </TableRow>
              ) : (
                filteredPembelian.map((pembelian) => (
                  <TableRow key={pembelian.id}>
                    <TableCell>{pembelian.nomorTransaksi}</TableCell>
                    <TableCell>{pembelian.tanggal}</TableCell>
                    <TableCell>{pembelian.pemasok}</TableCell>
                    <TableCell>{formatCurrency(pembelian.total)}</TableCell>
                    <TableCell>{getStatusBadge(pembelian.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openDetailDialog(pembelian.id)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openEditForm(pembelian.id)}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      {pembelian.status !== "selesai" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-500 hover:text-red-700" 
                          onClick={() => openDeleteDialog(pembelian.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {currentPembelian ? "Edit Pembelian" : "Tambah Pembelian Baru"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tanggal</label>
              <Input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Pemasok</label>
              <Select 
                value={formData.pemasokId} 
                onValueChange={handlePemasokChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Pemasok" />
                </SelectTrigger>
                <SelectContent>
                  {pemasokList.map(pemasok => (
                    <SelectItem key={pemasok.id} value={pemasok.id}>
                      {pemasok.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select 
                value={formData.status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proses">Proses</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                  <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Catatan</label>
              <Input
                name="catatan"
                value={formData.catatan || ''}
                onChange={handleFormChange}
              />
            </div>
          </div>
          
          {/* Items table would go here - simplified for this implementation */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 text-center p-4">
              Untuk sederhananya, implementasi ini tidak menyertakan form untuk menambahkan detail item pembelian.
              Dalam implementasi lengkap, di sini akan ada tabel untuk menambah/edit/hapus item pembelian.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Subtotal</label>
              <Input
                type="number"
                name="subtotal"
                value={formData.subtotal}
                onChange={handleFormChange}
                disabled
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Diskon</label>
              <Input
                type="number"
                name="diskon"
                value={formData.diskon || 0}
                onChange={handleFormChange}
                onBlur={calculateTotal}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">PPN</label>
              <Input
                type="number"
                name="ppn"
                value={formData.ppn || 0}
                onChange={handleFormChange}
                onBlur={calculateTotal}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Total</label>
              <Input
                type="number"
                name="total"
                value={formData.total}
                disabled
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data pembelian ini? 
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detail Pembelian</DialogTitle>
          </DialogHeader>
          
          {currentPembelian && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Nomor Transaksi</p>
                  <p className="font-medium">{currentPembelian.nomorTransaksi}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal</p>
                  <p className="font-medium">{currentPembelian.tanggal}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pemasok</p>
                  <p className="font-medium">{currentPembelian.pemasok}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div>{getStatusBadge(currentPembelian.status)}</div>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden mb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produk</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                      <TableHead className="text-right">Harga Satuan</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentPembelian.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.produkNama}</TableCell>
                        <TableCell className="text-right">{item.jumlah}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.hargaSatuan)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between">
                  <p className="text-sm">Subtotal</p>
                  <p>{formatCurrency(currentPembelian.subtotal)}</p>
                </div>
                {currentPembelian.diskon && (
                  <div className="flex justify-between">
                    <p className="text-sm">Diskon</p>
                    <p>-{formatCurrency(currentPembelian.diskon)}</p>
                  </div>
                )}
                {currentPembelian.ppn && (
                  <div className="flex justify-between">
                    <p className="text-sm">PPN</p>
                    <p>{formatCurrency(currentPembelian.ppn)}</p>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                  <p>Total</p>
                  <p>{formatCurrency(currentPembelian.total)}</p>
                </div>
              </div>
              
              {currentPembelian.catatan && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Catatan</p>
                  <p>{currentPembelian.catatan}</p>
                </div>
              )}
            </>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Tutup
            </Button>
            {currentPembelian && currentPembelian.status === "proses" && (
              <Button onClick={() => {
                updatePembelian(currentPembelian.id, { status: "selesai" });
                loadPembelian();
                setIsDetailDialogOpen(false);
                toast.success("Status pembelian berhasil diperbarui");
              }}>
                <Check className="h-4 w-4 mr-2" /> Selesaikan Pembelian
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

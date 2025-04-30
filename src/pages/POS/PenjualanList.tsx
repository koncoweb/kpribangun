
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Search, MoreHorizontal, Receipt, Plus } from "lucide-react";
import { Penjualan } from "@/types";
import { getAllPenjualan, deletePenjualan } from "@/services/penjualanService";
import { getKasirById } from "@/services/kasirService";
import { formatRupiah, formatDateTime } from "@/lib/utils";

export default function PenjualanList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [penjualanList, setPenjualanList] = useState<Penjualan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "sukses" | "dibatalkan">("all");
  const [penjualanToDelete, setPenjualanToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  useEffect(() => {
    // Load sales from local storage
    refreshPenjualanList();
  }, []);
  
  const refreshPenjualanList = () => {
    const loadedPenjualan = getAllPenjualan();
    setPenjualanList(loadedPenjualan);
  };
  
  const handleDeleteClick = (id: string) => {
    setPenjualanToDelete(id);
    setIsConfirmOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (penjualanToDelete) {
      const success = deletePenjualan(penjualanToDelete);
      
      if (success) {
        toast({
          title: "Transaksi berhasil dihapus",
          description: "Data transaksi telah dihapus dari sistem",
        });
        
        // Refresh the list
        refreshPenjualanList();
      } else {
        toast({
          title: "Gagal menghapus transaksi",
          description: "Terjadi kesalahan saat menghapus data transaksi",
          variant: "destructive",
        });
      }
      
      setIsConfirmOpen(false);
      setPenjualanToDelete(null);
    }
  };
  
  const getKasirName = (kasirId: string): string => {
    const kasir = getKasirById(kasirId);
    return kasir ? kasir.nama : "-";
  };
  
  const filteredPenjualan = penjualanList.filter(penjualan => {
    const matchesSearch = penjualan.nomorTransaksi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || penjualan.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <Layout pageTitle="Daftar Transaksi Penjualan">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Daftar Transaksi Penjualan</h1>
        <Link to="/pos/penjualan">
          <Button className="gap-2">
            <Plus size={16} /> Transaksi Baru
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Cari berdasarkan nomor transaksi..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-40">
              <Select value={filterStatus} onValueChange={(value: "all" | "sukses" | "dibatalkan") => setFilterStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="sukses">Sukses</SelectItem>
                  <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No Transaksi</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kasir</TableHead>
                  <TableHead>Total Item</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Metode Pembayaran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Opsi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPenjualan.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      Tidak ada data transaksi yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPenjualan.map((penjualan) => (
                    <TableRow key={penjualan.id}>
                      <TableCell className="font-medium">{penjualan.nomorTransaksi}</TableCell>
                      <TableCell>{formatDateTime(penjualan.tanggal)}</TableCell>
                      <TableCell>{getKasirName(penjualan.kasirId)}</TableCell>
                      <TableCell>{penjualan.items.reduce((sum, item) => sum + item.jumlah, 0)} items</TableCell>
                      <TableCell>{formatRupiah(penjualan.total)}</TableCell>
                      <TableCell>
                        {penjualan.metodePembayaran === "cash" ? "Tunai" :
                         penjualan.metodePembayaran === "debit" ? "Debit" :
                         penjualan.metodePembayaran === "kredit" ? "Kartu Kredit" : "QRIS"}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          penjualan.status === "sukses" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {penjualan.status === "sukses" ? "Sukses" : "Dibatalkan"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => navigate(`/pos/penjualan/${penjualan.id}`)}
                              className="flex items-center gap-2"
                            >
                              <Receipt size={16} /> Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(penjualan.id)}
                              className="flex items-center gap-2 text-destructive focus:text-destructive"
                            >
                              <Trash size={16} /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Transaksi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan dan akan memulihkan stok produk.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}

// Helper component for the Trash icon
function Trash({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18"></path>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
    </svg>
  );
}

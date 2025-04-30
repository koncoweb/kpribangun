
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
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
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, FileText, Eye, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllTransaksi, deleteTransaksi } from "@/services/transaksiService";
import { Transaksi } from "@/types";

export default function TransaksiList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [transaksiToDelete, setTransaksiToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Load transaksi from local storage
    const loadedTransaksi = getAllTransaksi();
    setTransaksiList(loadedTransaksi);
  }, []);
  
  const handleDeleteClick = (id: string) => {
    setTransaksiToDelete(id);
    setIsConfirmOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (transaksiToDelete) {
      const success = deleteTransaksi(transaksiToDelete);
      
      if (success) {
        toast({
          title: "Transaksi berhasil dihapus",
          description: "Data transaksi telah dihapus dari sistem",
        });
        
        // Refresh the list
        setTransaksiList(getAllTransaksi());
      } else {
        toast({
          title: "Gagal menghapus transaksi",
          description: "Terjadi kesalahan saat menghapus data transaksi",
          variant: "destructive",
        });
      }
      
      setIsConfirmOpen(false);
      setTransaksiToDelete(null);
    }
  };
  
  const filterTransaksi = (tab: string) => {
    let filtered = transaksiList;
    
    if (tab !== "semua") {
      filtered = filtered.filter(t => t.jenis.toLowerCase() === tab.toLowerCase());
    }
    
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.anggotaNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.anggotaId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <Layout pageTitle="Transaksi">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Daftar Transaksi</h1>
        <Link to="/transaksi/baru">
          <Button className="gap-2">
            <Plus size={16} /> Transaksi Baru
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Cari transaksi..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="semua">
              <TabsList>
                <TabsTrigger value="semua">Semua</TabsTrigger>
                <TabsTrigger value="simpan">Simpanan</TabsTrigger>
                <TabsTrigger value="pinjam">Pinjaman</TabsTrigger>
                <TabsTrigger value="angsuran">Angsuran</TabsTrigger>
              </TabsList>
              
              <TabsContent value="semua">
                <TransaksiTable 
                  transaksiList={filterTransaksi("semua")} 
                  onDeleteClick={handleDeleteClick} 
                  formatDate={formatDate}
                />
              </TabsContent>
              
              <TabsContent value="simpan">
                <TransaksiTable 
                  transaksiList={filterTransaksi("simpan")} 
                  onDeleteClick={handleDeleteClick}
                  formatDate={formatDate}
                />
              </TabsContent>
              
              <TabsContent value="pinjam">
                <TransaksiTable 
                  transaksiList={filterTransaksi("pinjam")} 
                  onDeleteClick={handleDeleteClick}
                  formatDate={formatDate}
                />
              </TabsContent>
              
              <TabsContent value="angsuran">
                <TransaksiTable 
                  transaksiList={filterTransaksi("angsuran")} 
                  onDeleteClick={handleDeleteClick}
                  formatDate={formatDate}
                />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}

type TransaksiTableProps = {
  transaksiList: Transaksi[];
  onDeleteClick: (id: string) => void;
  formatDate: (date: string) => string;
};

function TransaksiTable({ transaksiList, onDeleteClick, formatDate }: TransaksiTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>ID Anggota</TableHead>
            <TableHead>Nama Anggota</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Opsi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transaksiList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                Tidak ada data transaksi yang ditemukan
              </TableCell>
            </TableRow>
          ) : (
            transaksiList.map((transaksi) => (
              <TableRow key={transaksi.id}>
                <TableCell className="font-medium">{transaksi.id}</TableCell>
                <TableCell>{formatDate(transaksi.tanggal)}</TableCell>
                <TableCell>{transaksi.anggotaId}</TableCell>
                <TableCell>{transaksi.anggotaNama}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    transaksi.jenis === "Simpan" ? "bg-green-100 text-green-800" : 
                    transaksi.jenis === "Pinjam" ? "bg-amber-100 text-amber-800" : 
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {transaksi.jenis}
                  </span>
                </TableCell>
                <TableCell className="font-medium">Rp {transaksi.jumlah.toLocaleString("id-ID")}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    transaksi.status === "Sukses" ? "bg-green-100 text-green-800" : 
                    transaksi.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                    "bg-red-100 text-red-800"
                  }`}>
                    {transaksi.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/transaksi/${transaksi.id}`}>
                    <Button variant="ghost" size="icon" title="Lihat Detail">
                      <Eye size={16} />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" title="Cetak Bukti">
                    <FileText size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Hapus Transaksi" 
                    className="text-destructive hover:text-destructive" 
                    onClick={() => onDeleteClick(transaksi.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

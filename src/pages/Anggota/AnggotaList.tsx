
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
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllAnggota, deleteAnggota } from "@/services/anggotaService";
import { calculateTotalSimpanan, calculateTotalPinjaman } from "@/services/transaksiService";
import { Anggota } from "@/types";

export default function AnggotaList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [anggotaToDelete, setAnggotaToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Load anggota from local storage
    const loadedAnggota = getAllAnggota();
    setAnggotaList(loadedAnggota);
  }, []);
  
  const handleDeleteClick = (id: string) => {
    setAnggotaToDelete(id);
    setIsConfirmOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (anggotaToDelete) {
      const success = deleteAnggota(anggotaToDelete);
      
      if (success) {
        toast({
          title: "Anggota berhasil dihapus",
          description: "Data anggota telah dihapus dari sistem",
        });
        
        // Refresh the list
        setAnggotaList(getAllAnggota());
      } else {
        toast({
          title: "Gagal menghapus anggota",
          description: "Terjadi kesalahan saat menghapus data anggota",
          variant: "destructive",
        });
      }
      
      setIsConfirmOpen(false);
      setAnggotaToDelete(null);
    }
  };
  
  const getTotalSimpanan = (anggotaId: string): string => {
    const total = calculateTotalSimpanan(anggotaId);
    return `Rp ${total.toLocaleString("id-ID")}`;
  };
  
  const getTotalPinjaman = (anggotaId: string): string => {
    const total = calculateTotalPinjaman(anggotaId);
    return total > 0 ? `Rp ${total.toLocaleString("id-ID")}` : "Rp 0";
  };
  
  const filteredAnggota = anggotaList.filter(anggota => 
    anggota.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
    anggota.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    anggota.nik.includes(searchQuery)
  );

  return (
    <Layout pageTitle="Data Anggota">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Daftar Anggota</h1>
        <Link to="/anggota/tambah">
          <Button className="gap-2">
            <Plus size={16} /> Tambah Anggota
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Cari berdasarkan nama, ID, atau NIK..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIK</TableHead>
                  <TableHead>No HP</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>Pekerjaan</TableHead>
                  <TableHead>Simpanan</TableHead>
                  <TableHead>Pinjaman</TableHead>
                  <TableHead className="text-right">Opsi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnggota.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10">
                      Tidak ada data anggota yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAnggota.map((anggota) => (
                    <TableRow key={anggota.id}>
                      <TableCell className="font-medium">{anggota.id}</TableCell>
                      <TableCell>{anggota.nama}</TableCell>
                      <TableCell>{anggota.nik}</TableCell>
                      <TableCell>{anggota.noHp}</TableCell>
                      <TableCell>{anggota.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}</TableCell>
                      <TableCell>{anggota.pekerjaan}</TableCell>
                      <TableCell className="text-green-600">{getTotalSimpanan(anggota.id)}</TableCell>
                      <TableCell className="text-amber-600">{getTotalPinjaman(anggota.id)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => navigate(`/anggota/${anggota.id}`)}
                              className="flex items-center gap-2"
                            >
                              <Eye size={16} /> Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => navigate(`/anggota/${anggota.id}/edit`)}
                              className="flex items-center gap-2"
                            >
                              <Edit size={16} /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(anggota.id)}
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
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus anggota ini? Tindakan ini tidak dapat dibatalkan.
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

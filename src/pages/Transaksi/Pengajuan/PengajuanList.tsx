
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, MoreHorizontal, Eye, FileText, Edit, Trash, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getPengajuanList, deletePengajuan } from "@/services/pengajuanService";
import { Pengajuan } from "@/types";
import { TableColumnToggle } from "@/components/ui/table-column-toggle";
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
import { getPengajuanListFromSupabase, deletePengajuanFromSupabase } from "@/services/pengajuan/adapter";

export default function PengajuanList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [pengajuanList, setPengajuanList] = useState<Pengajuan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Column visibility state
  const [columns, setColumns] = useState([
    { id: "id", label: "ID Pengajuan", isVisible: true },
    { id: "tanggal", label: "Tanggal", isVisible: true },
    { id: "anggota", label: "Anggota", isVisible: true },
    { id: "jenis", label: "Jenis", isVisible: true },
    { id: "jumlah", label: "Jumlah", isVisible: true },
    { id: "status", label: "Status", isVisible: true },
    { id: "keterangan", label: "Keterangan", isVisible: true },
  ]);
  
  useEffect(() => {
    loadPengajuanData();
  }, []);
  
  const loadPengajuanData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch data from Supabase
      const data = await getPengajuanListFromSupabase();
      setPengajuanList(data);
    } catch (err) {
      console.error('Error loading pengajuan data:', err);
      setError('Gagal memuat data pengajuan. Silakan coba lagi.');
      // Fallback to local data if Supabase fails
      const fallbackData = getPengajuanList();
      setPengajuanList(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleColumn = (columnId: string) => {
    setColumns(prevColumns =>
      prevColumns.map(column => 
        column.id === columnId 
        ? { ...column, isVisible: !column.isVisible } 
        : column
      )
    );
  };
  
  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Confirm delete dialog
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        setIsDeleting(true);
        
        // Delete from Supabase
        const success = await deletePengajuanFromSupabase(deleteId);
        
        if (success) {
          toast({
            title: "Pengajuan berhasil dihapus",
            description: `Pengajuan dengan ID ${deleteId} telah dihapus`,
          });
          await loadPengajuanData();
        } else {
          // Fallback to local delete if Supabase fails
          const localSuccess = deletePengajuan(deleteId);
          
          if (localSuccess) {
            toast({
              title: "Pengajuan berhasil dihapus (lokal)",
              description: `Pengajuan dengan ID ${deleteId} telah dihapus dari penyimpanan lokal`,
            });
            await loadPengajuanData();
          } else {
            toast({
              title: "Gagal menghapus pengajuan",
              description: "Terjadi kesalahan saat menghapus data pengajuan",
              variant: "destructive",
            });
          }
        }
      } catch (err) {
        console.error('Error deleting pengajuan:', err);
        toast({
          title: "Gagal menghapus pengajuan",
          description: "Terjadi kesalahan saat menghapus data pengajuan",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        setDeleteId(null);
      }
    }
  };
  
  // Filter pengajuan based on search query and filter status
  const filteredPengajuan = pengajuanList.filter(pengajuan => {
    const matchesSearch = 
      pengajuan.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      pengajuan.anggotaNama.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === "semua") {
      return matchesSearch;
    }
    
    return matchesSearch && pengajuan.status.toLowerCase() === filterStatus.toLowerCase();
  });
  
  return (
    <Layout pageTitle="Daftar Pengajuan">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Daftar Pengajuan</h1>
        <Button asChild className="gap-2">
          <Link to="/transaksi/pengajuan/tambah">
            <Plus size={16} /> Tambah Pengajuan
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Cari berdasarkan ID atau nama anggota..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full sm:w-auto">
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="menunggu">Menunggu</SelectItem>
                  <SelectItem value="disetujui">Disetujui</SelectItem>
                  <SelectItem value="ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <TableColumnToggle columns={columns} onToggleColumn={handleToggleColumn} />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns[0].isVisible && <TableHead>ID</TableHead>}
                  {columns[1].isVisible && <TableHead>Tanggal</TableHead>}
                  {columns[2].isVisible && <TableHead>Anggota</TableHead>}
                  {columns[3].isVisible && <TableHead>Jenis</TableHead>}
                  {columns[4].isVisible && <TableHead>Jumlah</TableHead>}
                  {columns[5].isVisible && <TableHead>Status</TableHead>}
                  {columns[6].isVisible && <TableHead>Keterangan</TableHead>}
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p>Memuat data pengajuan...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-red-500">{error}</p>
                        <Button variant="outline" onClick={loadPengajuanData} size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Coba lagi
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPengajuan.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Tidak ada data pengajuan yang sesuai
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPengajuan.map((pengajuan) => (
                    <TableRow key={pengajuan.id}>
                      {columns[0].isVisible && <TableCell>{pengajuan.id}</TableCell>}
                      {columns[1].isVisible && <TableCell>{formatDate(pengajuan.tanggal)}</TableCell>}
                      {columns[2].isVisible && <TableCell>{pengajuan.anggotaNama}</TableCell>}
                      {columns[3].isVisible && (
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            pengajuan.jenis === "Simpan" ? "bg-green-100 text-green-800" : 
                            "bg-amber-100 text-amber-800"
                          }`}>
                            {pengajuan.jenis}
                          </span>
                        </TableCell>
                      )}
                      {columns[4].isVisible && (
                        <TableCell>
                          Rp {pengajuan.jumlah.toLocaleString("id-ID")}
                        </TableCell>
                      )}
                      {columns[5].isVisible && (
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            pengajuan.status === "Disetujui" ? "bg-green-100 text-green-800" : 
                            pengajuan.status === "Menunggu" ? "bg-yellow-100 text-yellow-800" : 
                            "bg-red-100 text-red-800"
                          }`}>
                            {pengajuan.status}
                          </span>
                        </TableCell>
                      )}
                      {columns[6].isVisible && <TableCell>{pengajuan.keterangan || "-"}</TableCell>}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => navigate(`/transaksi/pengajuan/${pengajuan.id}`)}
                              className="flex items-center gap-2"
                            >
                              <Eye size={16} /> Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => navigate(`/transaksi/pengajuan/${pengajuan.id}/edit`)}
                              className="flex items-center gap-2"
                            >
                              <Edit size={16} /> Edit Pengajuan
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(pengajuan.id)}
                              className="flex items-center gap-2 text-red-600"
                            >
                              <Trash size={16} /> Hapus Pengajuan
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

      {/* Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pengajuan ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}


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
import { Plus, Search, MoreHorizontal, Edit, Trash, Eye, LayoutGrid, LayoutList } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllAnggota, deleteAnggota } from "@/services/anggotaService";
import { calculateTotalSimpanan, calculateTotalPinjaman, calculateSHU } from "@/services/transaksiService";
import { Anggota } from "@/types";
import { TableColumnToggle } from "@/components/ui/table-column-toggle";
import { AnggotaGridView } from "@/components/anggota/AnggotaGridView";

export default function AnggotaList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [anggotaToDelete, setAnggotaToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Column visibility state
  const [columns, setColumns] = useState([
    { id: "id", label: "ID", isVisible: true },
    { id: "nama", label: "Nama", isVisible: true },
    { id: "nik", label: "NIK", isVisible: true },
    { id: "noHp", label: "No HP", isVisible: true },
    { id: "jenisKelamin", label: "Jenis Kelamin", isVisible: true },
    { id: "pekerjaan", label: "Pekerjaan", isVisible: true },
    { id: "simpanan", label: "Simpanan", isVisible: true },
    { id: "pinjaman", label: "Pinjaman", isVisible: true },
    { id: "shu", label: "SHU", isVisible: true }, // Add SHU column
    { id: "petugas", label: "Petugas", isVisible: true }, // Add Petugas column
  ]);
  
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

  const getTotalSHU = (anggotaId: string): string => {
    const total = calculateSHU(anggotaId);
    return `Rp ${total.toLocaleString("id-ID")}`;
  };
  
  const getPetugas = (anggotaId: string): string => {
    // This would normally come from a service that tracks which staff member
    // is assigned to this member. For now return a placeholder.
    return "Admin";
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
          <div className="p-6 border-b flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Cari berdasarkan nama, ID, atau NIK..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("table")}
                title="Tampilan Tabel"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
                title="Tampilan Grid"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              
              {viewMode === "table" && (
                <TableColumnToggle columns={columns} onToggleColumn={handleToggleColumn} />
              )}
            </div>
          </div>
          
          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map(column => 
                      column.isVisible && <TableHead key={column.id}>{column.label}</TableHead>
                    )}
                    <TableHead className="text-right">Opsi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnggota.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.filter(c => c.isVisible).length + 1} className="text-center py-10">
                        Tidak ada data anggota yang ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAnggota.map((anggota) => (
                      <TableRow key={anggota.id}>
                        {columns[0].isVisible && <TableCell className="font-medium">{anggota.id}</TableCell>}
                        {columns[1].isVisible && <TableCell>{anggota.nama}</TableCell>}
                        {columns[2].isVisible && <TableCell>{anggota.nik}</TableCell>}
                        {columns[3].isVisible && <TableCell>{anggota.noHp}</TableCell>}
                        {columns[4].isVisible && <TableCell>{anggota.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}</TableCell>}
                        {columns[5].isVisible && <TableCell>{anggota.pekerjaan}</TableCell>}
                        {columns[6].isVisible && <TableCell className="text-green-600">{getTotalSimpanan(anggota.id)}</TableCell>}
                        {columns[7].isVisible && <TableCell className="text-amber-600">{getTotalPinjaman(anggota.id)}</TableCell>}
                        {columns[8].isVisible && <TableCell className="text-purple-600">{getTotalSHU(anggota.id)}</TableCell>}
                        {columns[9].isVisible && <TableCell>{getPetugas(anggota.id)}</TableCell>}
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
          ) : (
            <div className="p-6">
              <AnggotaGridView 
                anggota={filteredAnggota} 
                onViewDetail={(id) => navigate(`/anggota/${id}`)}
                onEdit={(id) => navigate(`/anggota/${id}/edit`)}
                onDelete={handleDeleteClick}
                getTotalSimpanan={getTotalSimpanan}
                getTotalPinjaman={getTotalPinjaman}
              />
            </div>
          )}
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

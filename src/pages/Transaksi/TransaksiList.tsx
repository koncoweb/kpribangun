
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
import { Plus, Search, MoreHorizontal, Eye, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllTransaksi } from "@/services/transaksiService";
import { getAllAnggota } from "@/services/anggotaService";
import { TableColumnToggle } from "@/components/ui/table-column-toggle";

export default function TransaksiList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenis, setFilterJenis] = useState<string>("semua");
  const [transaksiList, setTransaksiList] = useState([]);
  const [anggotaList, setAnggotaList] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Column visibility state
  const [columns, setColumns] = useState([
    { id: "id", label: "ID Transaksi", isVisible: true },
    { id: "tanggal", label: "Tanggal", isVisible: true },
    { id: "anggota", label: "Anggota", isVisible: true },
    { id: "jenis", label: "Jenis", isVisible: true },
    { id: "jumlah", label: "Jumlah", isVisible: true },
    { id: "keterangan", label: "Keterangan", isVisible: true },
    { id: "status", label: "Status", isVisible: true },
  ]);
  
  useEffect(() => {
    // Load data from services
    const loadedTransaksi = getAllTransaksi();
    const loadedAnggota = getAllAnggota();
    
    setTransaksiList(loadedTransaksi);
    setAnggotaList(loadedAnggota);
  }, []);
  
  const handleToggleColumn = (columnId: string) => {
    setColumns(prevColumns =>
      prevColumns.map(column => 
        column.id === columnId 
        ? { ...column, isVisible: !column.isVisible } 
        : column
      )
    );
  };
  
  // Get anggota name by ID
  const getAnggotaNama = (anggotaId) => {
    const anggota = anggotaList.find(a => a.id === anggotaId);
    return anggota ? anggota.nama : "Unknown";
  };
  
  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  
  // Filter transaksi based on search query and filter type
  const filteredTransaksi = transaksiList.filter(transaksi => {
    const matchesSearch = 
      transaksi.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      getAnggotaNama(transaksi.anggotaId).toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterJenis === "semua") {
      return matchesSearch;
    }
    
    return matchesSearch && transaksi.jenis === filterJenis;
  });
  
  return (
    <Layout pageTitle="Daftar Transaksi">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Daftar Transaksi</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} /> Buat Transaksi
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Pilih Jenis Transaksi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to="/transaksi/baru?jenis=simpanan">
              <DropdownMenuItem className="cursor-pointer">
                Simpanan
              </DropdownMenuItem>
            </Link>
            <Link to="/transaksi/baru?jenis=pinjaman">
              <DropdownMenuItem className="cursor-pointer">
                Pinjaman
              </DropdownMenuItem>
            </Link>
            <Link to="/transaksi/baru?jenis=angsuran">
              <DropdownMenuItem className="cursor-pointer">
                Angsuran
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
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
                value={filterJenis}
                onValueChange={setFilterJenis}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Jenis</SelectItem>
                  <SelectItem value="Simpan">Simpanan</SelectItem>
                  <SelectItem value="Pinjam">Pinjaman</SelectItem>
                  <SelectItem value="Angsuran">Angsuran</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <TableColumnToggle columns={columns} onToggleColumn={handleToggleColumn} />
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns[0].isVisible && <TableHead>ID Transaksi</TableHead>}
                  {columns[1].isVisible && <TableHead>Tanggal</TableHead>}
                  {columns[2].isVisible && <TableHead>Anggota</TableHead>}
                  {columns[3].isVisible && <TableHead>Jenis</TableHead>}
                  {columns[4].isVisible && <TableHead>Jumlah</TableHead>}
                  {columns[5].isVisible && <TableHead>Keterangan</TableHead>}
                  {columns[6].isVisible && <TableHead>Status</TableHead>}
                  <TableHead className="text-right">Opsi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransaksi.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.filter(c => c.isVisible).length + 1} className="text-center py-10">
                      Tidak ada data transaksi yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransaksi.map((transaksi) => (
                    <TableRow key={transaksi.id}>
                      {columns[0].isVisible && <TableCell className="font-medium">{transaksi.id}</TableCell>}
                      {columns[1].isVisible && <TableCell>{formatDate(transaksi.tanggal)}</TableCell>}
                      {columns[2].isVisible && <TableCell>{getAnggotaNama(transaksi.anggotaId)}</TableCell>}
                      {columns[3].isVisible && (
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            transaksi.jenis === "Simpan" ? "bg-green-100 text-green-800" : 
                            transaksi.jenis === "Pinjam" ? "bg-amber-100 text-amber-800" : 
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {transaksi.jenis}
                          </span>
                        </TableCell>
                      )}
                      {columns[4].isVisible && (
                        <TableCell>
                          Rp {transaksi.jumlah.toLocaleString("id-ID")}
                        </TableCell>
                      )}
                      {columns[5].isVisible && <TableCell>{transaksi.keterangan || "-"}</TableCell>}
                      {columns[6].isVisible && (
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            transaksi.status === "Sukses" ? "bg-green-100 text-green-800" : 
                            transaksi.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                            "bg-red-100 text-red-800"
                          }`}>
                            {transaksi.status}
                          </span>
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => navigate(`/transaksi/${transaksi.id}`)}
                              className="flex items-center gap-2"
                            >
                              <Eye size={16} /> Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => navigate(`/transaksi/${transaksi.id}/cetak`)}
                              className="flex items-center gap-2"
                            >
                              <FileText size={16} /> Cetak Bukti
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
    </Layout>
  );
}

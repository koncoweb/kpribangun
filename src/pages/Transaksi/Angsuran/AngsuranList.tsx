
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
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, MoreHorizontal, Eye, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllTransaksi } from "@/services/transaksiService";
import { getAllAnggota } from "@/services/anggotaService";
import { TableColumnToggle } from "@/components/ui/table-column-toggle";
import { Transaksi } from "@/types";

export default function AngsuranList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [anggotaList, setAnggotaList] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Column visibility state
  const [columns, setColumns] = useState([
    { id: "id", label: "ID Transaksi", isVisible: true },
    { id: "tanggal", label: "Tanggal", isVisible: true },
    { id: "anggota", label: "Anggota", isVisible: true },
    { id: "jumlah", label: "Jumlah", isVisible: true },
    { id: "keterangan", label: "Keterangan", isVisible: true },
    { id: "status", label: "Status", isVisible: true },
  ]);
  
  useEffect(() => {
    // Load data from services
    const loadedTransaksi = getAllTransaksi().filter(t => t.jenis === "Angsuran");
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
  
  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  
  // Filter transaksi based on search query
  const filteredTransaksi = transaksiList.filter(transaksi => {
    return transaksi.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (transaksi.anggotaNama || "").toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  return (
    <Layout pageTitle="Daftar Angsuran">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Transaksi Angsuran</h1>
        <Button asChild className="gap-2">
          <Link to="/transaksi/angsuran/tambah">
            <Plus size={16} /> Tambah Angsuran
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
            
            <TableColumnToggle columns={columns} onToggleColumn={handleToggleColumn} />
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns[0].isVisible && <TableHead>ID Transaksi</TableHead>}
                  {columns[1].isVisible && <TableHead>Tanggal</TableHead>}
                  {columns[2].isVisible && <TableHead>Anggota</TableHead>}
                  {columns[3].isVisible && <TableHead>Jumlah</TableHead>}
                  {columns[4].isVisible && <TableHead>Keterangan</TableHead>}
                  {columns[5].isVisible && <TableHead>Status</TableHead>}
                  <TableHead className="text-right">Opsi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransaksi.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.filter(c => c.isVisible).length + 1} className="text-center py-10">
                      Tidak ada data angsuran yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransaksi.map((transaksi) => (
                    <TableRow key={transaksi.id}>
                      {columns[0].isVisible && <TableCell className="font-medium">{transaksi.id}</TableCell>}
                      {columns[1].isVisible && <TableCell>{formatDate(transaksi.tanggal)}</TableCell>}
                      {columns[2].isVisible && <TableCell>{transaksi.anggotaNama}</TableCell>}
                      {columns[3].isVisible && (
                        <TableCell>
                          Rp {transaksi.jumlah.toLocaleString("id-ID")}
                        </TableCell>
                      )}
                      {columns[4].isVisible && <TableCell>{transaksi.keterangan || "-"}</TableCell>}
                      {columns[5].isVisible && (
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

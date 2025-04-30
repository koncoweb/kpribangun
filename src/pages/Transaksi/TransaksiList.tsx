
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
import { Link } from "react-router-dom";
import { Plus, Search, FileText, Eye } from "lucide-react";
import { useState } from "react";

type Transaksi = {
  id: string;
  tanggal: string;
  anggotaId: string;
  anggotaNama: string;
  jenis: "Simpan" | "Pinjam" | "Angsuran";
  jumlah: string;
  keterangan?: string;
  status: "Sukses" | "Pending" | "Ditolak";
};

export default function TransaksiList() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data contoh
  const transaksiList: Transaksi[] = [
    { 
      id: "TR0001", 
      tanggal: "20 Apr 2025",
      anggotaId: "AG0001",
      anggotaNama: "Budi Santoso",
      jenis: "Simpan",
      jumlah: "Rp 500.000",
      status: "Sukses"
    },
    { 
      id: "TR0002", 
      tanggal: "18 Apr 2025",
      anggotaId: "AG0004",
      anggotaNama: "Sri Wahyuni",
      jenis: "Pinjam",
      jumlah: "Rp 2.000.000",
      keterangan: "Pinjaman untuk modal usaha",
      status: "Sukses"
    },
    { 
      id: "TR0003", 
      tanggal: "17 Apr 2025",
      anggotaId: "AG0003",
      anggotaNama: "Ahmad Hidayat",
      jenis: "Angsuran",
      jumlah: "Rp 250.000",
      status: "Sukses"
    },
    { 
      id: "TR0004", 
      tanggal: "15 Apr 2025",
      anggotaId: "AG0002",
      anggotaNama: "Dewi Lestari",
      jenis: "Simpan",
      jumlah: "Rp 750.000",
      status: "Sukses"
    },
    { 
      id: "TR0005", 
      tanggal: "12 Apr 2025",
      anggotaId: "AG0005",
      anggotaNama: "Agus Setiawan",
      jenis: "Pinjam",
      jumlah: "Rp 5.000.000",
      keterangan: "Pinjaman untuk renovasi rumah",
      status: "Sukses"
    },
  ];
  
  const filterTransaksi = (tab: string) => {
    let filtered = transaksiList;
    
    if (tab !== "semua") {
      filtered = filtered.filter(t => t.jenis.toLowerCase() === tab);
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
                <TransaksiTable transaksiList={filterTransaksi("semua")} />
              </TabsContent>
              
              <TabsContent value="simpan">
                <TransaksiTable transaksiList={filterTransaksi("simpan")} />
              </TabsContent>
              
              <TabsContent value="pinjam">
                <TransaksiTable transaksiList={filterTransaksi("pinjam")} />
              </TabsContent>
              
              <TabsContent value="angsuran">
                <TransaksiTable transaksiList={filterTransaksi("angsuran")} />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}

function TransaksiTable({ transaksiList }: { transaksiList: Transaksi[] }) {
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
                <TableCell>{transaksi.tanggal}</TableCell>
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
                <TableCell className="font-medium">{transaksi.jumlah}</TableCell>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

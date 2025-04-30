
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
import { Link } from "react-router-dom";
import { Plus, Search, MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import { useState } from "react";

type Anggota = {
  id: string;
  nama: string;
  nik: string;
  alamat: string;
  noHp: string;
  jenisKelamin: "L" | "P";
  agama: string;
  pekerjaan: string;
  simpanan: string;
  pinjaman: string;
};

export default function AnggotaList() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data contoh
  const anggotaList: Anggota[] = [
    { 
      id: "AG0001", 
      nama: "Budi Santoso", 
      nik: "3201011001800001",
      alamat: "Jl. Merdeka No. 123, Jakarta",
      noHp: "081234567890",
      jenisKelamin: "L",
      agama: "Islam",
      pekerjaan: "PNS",
      simpanan: "Rp 2.500.000",
      pinjaman: "Rp 5.000.000",
    },
    { 
      id: "AG0002", 
      nama: "Dewi Lestari", 
      nik: "3201012002800002",
      alamat: "Jl. Pahlawan No. 45, Bandung",
      noHp: "081234567891",
      jenisKelamin: "P",
      agama: "Kristen",
      pekerjaan: "Guru",
      simpanan: "Rp 3.750.000",
      pinjaman: "Rp 0",
    },
    { 
      id: "AG0003", 
      nama: "Ahmad Hidayat", 
      nik: "3201013003800003",
      alamat: "Jl. Sudirman No. 78, Surabaya",
      noHp: "081234567892",
      jenisKelamin: "L",
      agama: "Islam",
      pekerjaan: "Wiraswasta",
      simpanan: "Rp 1.250.000",
      pinjaman: "Rp 2.500.000",
    },
    { 
      id: "AG0004", 
      nama: "Sri Wahyuni", 
      nik: "3201014004800004",
      alamat: "Jl. Gatot Subroto No. 55, Medan",
      noHp: "081234567893",
      jenisKelamin: "P",
      agama: "Hindu",
      pekerjaan: "Dosen",
      simpanan: "Rp 5.000.000",
      pinjaman: "Rp 10.000.000",
    },
    { 
      id: "AG0005", 
      nama: "Agus Setiawan", 
      nik: "3201015005800005",
      alamat: "Jl. Ahmad Yani No. 12, Semarang",
      noHp: "081234567894",
      jenisKelamin: "L",
      agama: "Katolik",
      pekerjaan: "Pedagang",
      simpanan: "Rp 8.750.000",
      pinjaman: "Rp 15.000.000",
    },
  ];
  
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
                {filteredAnggota.map((anggota) => (
                  <TableRow key={anggota.id}>
                    <TableCell className="font-medium">{anggota.id}</TableCell>
                    <TableCell>{anggota.nama}</TableCell>
                    <TableCell>{anggota.nik}</TableCell>
                    <TableCell>{anggota.noHp}</TableCell>
                    <TableCell>{anggota.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}</TableCell>
                    <TableCell>{anggota.pekerjaan}</TableCell>
                    <TableCell className="text-green-600">{anggota.simpanan}</TableCell>
                    <TableCell className="text-amber-600">{anggota.pinjaman}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/anggota/${anggota.id}`} className="flex items-center gap-2">
                              <Eye size={16} /> Lihat Detail
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/anggota/${anggota.id}/edit`} className="flex items-center gap-2">
                              <Edit size={16} /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                            <Trash size={16} /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}

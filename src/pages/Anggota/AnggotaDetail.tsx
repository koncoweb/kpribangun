
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, User, Phone, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAnggotaById } from "@/services/anggotaService";
import { getTransaksiByAnggotaId, calculateTotalSimpanan, calculateTotalPinjaman } from "@/services/transaksiService";
import { Anggota, Transaksi } from "@/types";

export default function AnggotaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anggota, setAnggota] = useState<Anggota | null>(null);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  
  useEffect(() => {
    if (id) {
      const foundAnggota = getAnggotaById(id);
      if (foundAnggota) {
        setAnggota(foundAnggota);
        setTransaksi(getTransaksiByAnggotaId(id));
      } else {
        toast({
          title: "Anggota tidak ditemukan",
          description: "Data anggota yang dicari tidak ditemukan",
          variant: "destructive",
        });
        navigate("/anggota");
      }
    }
  }, [id, navigate, toast]);
  
  if (!anggota) {
    return (
      <Layout pageTitle="Detail Anggota">
        <div className="flex justify-center items-center h-64">
          <p>Memuat data anggota...</p>
        </div>
      </Layout>
    );
  }
  
  const totalSimpanan = calculateTotalSimpanan(anggota.id);
  const totalPinjaman = calculateTotalPinjaman(anggota.id);
  const simpananTransaksi = transaksi.filter(t => t.jenis === "Simpan");
  const pinjamanTransaksi = transaksi.filter(t => t.jenis === "Pinjam");
  const angsuranTransaksi = transaksi.filter(t => t.jenis === "Angsuran");

  return (
    <Layout pageTitle={`Detail Anggota - ${anggota.nama}`}>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/anggota">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Detail Anggota</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-gray-200">
                  {anggota.foto ? (
                    <img 
                      src={anggota.foto} 
                      alt={anggota.nama} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="h-20 w-20 text-gray-400" />
                  )}
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-center">{anggota.nama}</h2>
              <p className="text-gray-500 text-center mb-4">{anggota.id}</p>
              
              <div className="w-full space-y-3 mt-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{anggota.noHp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{anggota.alamat}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Bergabung: {new Date(anggota.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
              
              <div className="mt-6 w-full">
                <Link to={`/anggota/${anggota.id}/edit`}>
                  <Button className="w-full gap-2">
                    <Edit size={16} /> Edit Data Anggota
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-green-800 text-sm font-medium mb-1">Total Simpanan</h3>
                <p className="text-2xl font-bold text-green-700">
                  Rp {totalSimpanan.toLocaleString("id-ID")}
                </p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <h3 className="text-amber-800 text-sm font-medium mb-1">Sisa Pinjaman</h3>
                <p className="text-2xl font-bold text-amber-700">
                  Rp {totalPinjaman.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">NIK</h3>
                  <p>{anggota.nik}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Jenis Kelamin</h3>
                  <p>{anggota.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Agama</h3>
                  <p>{anggota.agama}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Pekerjaan</h3>
                <p>{anggota.pekerjaan}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Histori Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="semua">
            <TabsList className="mb-4">
              <TabsTrigger value="semua">Semua</TabsTrigger>
              <TabsTrigger value="simpanan">Simpanan</TabsTrigger>
              <TabsTrigger value="pinjaman">Pinjaman</TabsTrigger>
              <TabsTrigger value="angsuran">Angsuran</TabsTrigger>
            </TabsList>
            
            <TabsContent value="semua">
              <TransaksiTable transaksi={transaksi} />
            </TabsContent>
            <TabsContent value="simpanan">
              <TransaksiTable transaksi={simpananTransaksi} />
            </TabsContent>
            <TabsContent value="pinjaman">
              <TransaksiTable transaksi={pinjamanTransaksi} />
            </TabsContent>
            <TabsContent value="angsuran">
              <TransaksiTable transaksi={angsuranTransaksi} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
}

function TransaksiTable({ transaksi }: { transaksi: Transaksi[] }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transaksi.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                Tidak ada data transaksi yang ditemukan
              </TableCell>
            </TableRow>
          ) : (
            transaksi.map((tr) => (
              <TableRow key={tr.id}>
                <TableCell className="font-medium">{tr.id}</TableCell>
                <TableCell>{formatDate(tr.tanggal)}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    tr.jenis === "Simpan" ? "bg-green-100 text-green-800" : 
                    tr.jenis === "Pinjam" ? "bg-amber-100 text-amber-800" : 
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {tr.jenis}
                  </span>
                </TableCell>
                <TableCell>Rp {tr.jumlah.toLocaleString("id-ID")}</TableCell>
                <TableCell>{tr.keterangan || "-"}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    tr.status === "Sukses" ? "bg-green-100 text-green-800" : 
                    tr.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                    "bg-red-100 text-red-800"
                  }`}>
                    {tr.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

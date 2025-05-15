import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { getAllTransaksi, getAnggotaList } from "@/adapters/serviceAdapters";
import { Anggota, Transaksi } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export default function SimpanList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load transaksi and anggota data in parallel
        const [transaksiData, anggotaData] = await Promise.all([
          getAllTransaksi(),
          getAnggotaList()
        ]);
        
        setTransaksiList(transaksiData);
        setAnggotaList(anggotaData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memuat data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  // Filter simpanan transactions
  const simpananList = transaksiList.filter(t => t.jenis === "Simpan");
  
  // Group by anggota
  const simpananByAnggota = simpananList.reduce((acc, transaksi) => {
    const anggotaId = transaksi.anggotaId;
    if (!acc[anggotaId]) {
      acc[anggotaId] = [];
    }
    acc[anggotaId].push(transaksi);
    return acc;
  }, {} as Record<string, Transaksi[]>);
  
  // Calculate total simpanan per anggota
  const totalSimpananPerAnggota = Object.entries(simpananByAnggota).map(([anggotaId, transaksiList]) => {
    const anggota = anggotaList.find(a => a.id === anggotaId);
    const total = transaksiList.reduce((sum, t) => sum + t.jumlah, 0);
    return {
      anggotaId,
      anggotaNama: anggota?.nama || "Unknown",
      total,
      count: transaksiList.length
    };
  });
  
  // Calculate grand total
  const grandTotal = simpananList.reduce((sum, t) => sum + t.jumlah, 0);
  
  return (
    <Layout pageTitle="Daftar Simpanan">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Daftar Simpanan</h1>
        <Button onClick={() => navigate("/transaksi/simpan/tambah")}>
          Tambah Simpanan
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <p>Memuat data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Simpanan</CardTitle>
              <CardDescription>
                Total simpanan: {formatCurrency(grandTotal)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Anggota</TableHead>
                    <TableHead>Jumlah Transaksi</TableHead>
                    <TableHead className="text-right">Total Simpanan</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {totalSimpananPerAnggota.map((item) => (
                    <TableRow key={item.anggotaId}>
                      <TableCell>{item.anggotaNama}</TableCell>
                      <TableCell>{item.count}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/anggota/${item.anggotaId}`)}
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Daftar Transaksi Simpanan</CardTitle>
              <CardDescription>
                Menampilkan {simpananList.length} transaksi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Anggota</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {simpananList.map((transaksi) => (
                    <TableRow key={transaksi.id}>
                      <TableCell>{formatDate(transaksi.tanggal)}</TableCell>
                      <TableCell>{transaksi.anggotaNama}</TableCell>
                      <TableCell>{transaksi.kategori || "-"}</TableCell>
                      <TableCell className="text-right">{formatCurrency(transaksi.jumlah)}</TableCell>
                      <TableCell>
                        <Badge variant={transaksi.status === "Sukses" ? "success" : "pending"}>
                          {transaksi.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/transaksi/${transaksi.id}`)}
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
}

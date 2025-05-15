import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAnggotaList, getAllTransaksi } from "@/adapters/serviceAdapters";
import { Anggota, Transaksi } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export default function AngsuranList() {
  const { toast } = useToast();
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load anggota and transaksi data in parallel
        const [anggotaData, transaksiData] = await Promise.all([
          getAnggotaList(),
          getAllTransaksi()
        ]);
        
        setAnggotaList(anggotaData);
        setTransaksiList(transaksiData);
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
  
  // Filter angsuran transactions
  const angsuranList = transaksiList.filter(t => t.jenis === "Angsuran");
  
  // Group by anggota
  const angsuranByAnggota = angsuranList.reduce((acc, curr) => {
    if (!acc[curr.anggotaId]) {
      acc[curr.anggotaId] = [];
    }
    acc[curr.anggotaId].push(curr);
    return acc;
  }, {} as Record<string, Transaksi[]>);
  
  // Get unique anggota IDs with angsuran
  const anggotaWithAngsuran = Object.keys(angsuranByAnggota);
  
  // Filter by active tab
  const filteredAngsuran = activeTab === "all" 
    ? angsuranList 
    : angsuranByAnggota[activeTab] || [];
  
  return (
    <Layout pageTitle="Daftar Angsuran">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Daftar Angsuran</h1>
        <Link to="/transaksi/angsuran/tambah">
          <Button>Tambah Angsuran</Button>
        </Link>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4 overflow-x-auto flex-wrap">
          <TabsTrigger value="all">Semua Angsuran</TabsTrigger>
          {anggotaWithAngsuran.map(anggotaId => {
            const anggota = anggotaList.find(a => a.id === anggotaId);
            return (
              <TabsTrigger key={anggotaId} value={anggotaId}>
                {anggota?.nama || anggotaId}
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-4">Memuat data...</div>
            ) : filteredAngsuran.length === 0 ? (
              <div className="text-center py-4">Tidak ada data angsuran</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Tanggal</th>
                      <th className="text-left py-2 px-4">ID Transaksi</th>
                      <th className="text-left py-2 px-4">Anggota</th>
                      <th className="text-left py-2 px-4">Jumlah</th>
                      <th className="text-left py-2 px-4">Status</th>
                      <th className="text-left py-2 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAngsuran.map((transaksi) => (
                      <tr key={transaksi.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{new Date(transaksi.tanggal).toLocaleDateString()}</td>
                        <td className="py-2 px-4">{transaksi.id}</td>
                        <td className="py-2 px-4">{transaksi.anggotaNama}</td>
                        <td className="py-2 px-4">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(transaksi.jumlah)}
                        </td>
                        <td className="py-2 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              transaksi.status === "Sukses"
                                ? "bg-green-100 text-green-800"
                                : transaksi.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaksi.status}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          <Link to={`/transaksi/${transaksi.id}`}>
                            <Button variant="outline" size="sm">
                              Detail
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </Layout>
  );
}

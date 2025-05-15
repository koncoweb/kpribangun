import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { getAllTransaksi, getAnggotaList } from "@/adapters/serviceAdapters";
import { Anggota, Transaksi } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export default function PinjamList() {
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
  
  const handleEdit = (id: string) => {
    navigate(`/transaksi/pinjam/${id}/edit`);
  };
  
  const handleDelete = (id: string) => {
    // Implement delete logic here
    console.log(`Delete transaction with ID: ${id}`);
  };
  
  return (
    <Layout pageTitle="Daftar Pinjaman">
      {loading ? (
        <div className="flex justify-center py-8">
          <p>Memuat data...</p>
        </div>
      ) : (
        <div className="container mx-auto mt-8">
          <h1 className="text-2xl font-bold mb-4">Daftar Pinjaman</h1>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Anggota</th>
                  <th className="py-2 px-4 border-b">Tanggal</th>
                  <th className="py-2 px-4 border-b">Jumlah</th>
                  <th className="py-2 px-4 border-b">Keterangan</th>
                  <th className="py-2 px-4 border-b">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transaksiList.map((transaksi) => (
                  <tr key={transaksi.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{transaksi.id}</td>
                    <td className="py-2 px-4 border-b">
                      {anggotaList.find(anggota => anggota.id === transaksi.anggotaId)?.nama || "Tidak diketahui"}
                    </td>
                    <td className="py-2 px-4 border-b">{transaksi.tanggal}</td>
                    <td className="py-2 px-4 border-b">{transaksi.jumlah}</td>
                    <td className="py-2 px-4 border-b">{transaksi.keterangan}</td>
                    <td className="py-2 px-4 border-b">
                      <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={() => handleEdit(transaksi.id)}
                      >
                        Edit
                      </button>
                      <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleDelete(transaksi.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}

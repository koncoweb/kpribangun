import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { getTransaksiById, getAnggotaById, getPengaturan } from "@/adapters/serviceAdapters";
import { Anggota, Transaksi, Pengaturan } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export default function PinjamDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [anggota, setAnggota] = useState<Anggota | null>(null);
  const [pengaturan, setPengaturan] = useState<Pengaturan | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          toast({
            title: "Error",
            description: "ID transaksi tidak ditemukan",
            variant: "destructive"
          });
          return;
        }
        
        // Load transaksi data
        const transaksiData = await getTransaksiById(id);
        if (!transaksiData) {
          toast({
            title: "Error",
            description: "Data transaksi tidak ditemukan",
            variant: "destructive"
          });
          return;
        }
        
        setTransaksi(transaksiData);
        
        // Load anggota data
        const anggotaData = await getAnggotaById(transaksiData.anggotaId);
        if (anggotaData) {
          setAnggota(anggotaData);
        }
        
        // Load pengaturan data
        const pengaturanData = await getPengaturan();
        if (pengaturanData) {
          setPengaturan(pengaturanData);
        }
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
  }, [id, toast]);
  
  // Extract loan details from keterangan
  const extractLoanDetails = () => {
    if (!transaksi || !transaksi.keterangan) return null;
    
    const tenorMatch = transaksi.keterangan.match(/Tenor: (\d+) bulan/);
    const bungaMatch = transaksi.keterangan.match(/Bunga: (\d+(?:\.\d+)?)%/);
    
    const tenor = tenorMatch ? parseInt(tenorMatch[1]) : 0;
    const bunga = bungaMatch ? parseFloat(bungaMatch[1]) : 0;
    
    // Calculate total bunga
    const totalBunga = transaksi.jumlah * (bunga / 100) * tenor;
    const totalBayar = transaksi.jumlah + totalBunga;
    const angsuranPerBulan = totalBayar / tenor;
    
    return {
      tenor,
      bunga,
      totalBunga,
      totalBayar,
      angsuranPerBulan
    };
  };
  
  const loanDetails = extractLoanDetails();
  
  // Get default bunga from pengaturan if not specified in loan
  const getDefaultBunga = () => {
    if (!pengaturan || !transaksi) return 0;
    
    // If we have category-specific interest rates and the loan has a category
    if (pengaturan.sukuBunga?.pinjamanByCategory && transaksi.kategori) {
      return pengaturan.sukuBunga.pinjamanByCategory[transaksi.kategori] || pengaturan.sukuBunga.pinjaman;
    }
    
    return pengaturan.sukuBunga?.pinjaman || 0;
  };
  
  if (loading) {
    return (
      <Layout pageTitle="Detail Pinjaman">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Memuat data...</p>
        </div>
      </Layout>
    );
  }
  
  if (!transaksi) {
    return (
      <Layout pageTitle="Detail Pinjaman">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Data pinjaman tidak ditemukan</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout pageTitle="Detail Pinjaman">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Detail Pinjaman #{transaksi.id}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Informasi Pinjaman</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tanggal Pinjaman:</span>
                <span>{new Date(transaksi.tanggal).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jumlah Pinjaman:</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaksi.jumlah)}
                </span>
              </div>
              {transaksi.kategori && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Kategori:</span>
                  <span>{transaksi.kategori}</span>
                </div>
              )}
              {loanDetails && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tenor:</span>
                    <span>{loanDetails.tenor} bulan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bunga:</span>
                    <span>{loanDetails.bunga}% per bulan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Bunga:</span>
                    <span>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(loanDetails.totalBunga)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Bayar:</span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(loanDetails.totalBayar)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Angsuran per Bulan:</span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(loanDetails.angsuranPerBulan)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  transaksi.status === "Sukses" ? "bg-green-100 text-green-800" : 
                  transaksi.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                  "bg-red-100 text-red-800"
                }`}>
                  {transaksi.status}
                </span>
              </div>
            </div>
          </div>
          
          {anggota && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Informasi Anggota</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Anggota:</span>
                  <span>{anggota.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nama:</span>
                  <span>{anggota.nama}</span>
                </div>
                {anggota.noHp && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">No. HP:</span>
                    <span>{anggota.noHp}</span>
                  </div>
                )}
                {anggota.alamat && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alamat:</span>
                    <span>{anggota.alamat}</span>
                  </div>
                )}
                {anggota.pekerjaan && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pekerjaan:</span>
                    <span>{anggota.pekerjaan}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {transaksi.keterangan && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Keterangan</h2>
            <p className="text-gray-700">{transaksi.keterangan}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

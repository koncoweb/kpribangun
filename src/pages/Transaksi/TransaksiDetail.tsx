
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getTransaksiById, deleteTransaksi } from "@/services/transaksiService";
import { getAnggotaById } from "@/services/anggotaService";
import { Transaksi, Anggota } from "@/types";
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

export default function TransaksiDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [anggota, setAnggota] = useState<Anggota | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const loadedTransaksi = getTransaksiById(id);
    if (loadedTransaksi) {
      setTransaksi(loadedTransaksi);
      
      // Load anggota information
      const loadedAnggota = getAnggotaById(loadedTransaksi.anggotaId);
      setAnggota(loadedAnggota || null);
    } else {
      toast({
        title: "Transaksi tidak ditemukan",
        description: `Transaksi dengan ID ${id} tidak terdaftar dalam sistem`,
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  }, [id, toast]);
  
  const handleDelete = () => {
    if (!id) return;
    
    const success = deleteTransaksi(id);
    if (success) {
      toast({
        title: "Transaksi berhasil dihapus",
        description: `Transaksi dengan ID ${id} telah dihapus dari sistem`,
      });
      navigate("/transaksi");
    } else {
      toast({
        title: "Gagal menghapus transaksi",
        description: "Terjadi kesalahan saat menghapus data transaksi",
        variant: "destructive",
      });
    }
    
    setIsDeleteDialogOpen(false);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  if (isLoading) {
    return (
      <Layout pageTitle="Detail Transaksi">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Memuat data transaksi...</p>
        </div>
      </Layout>
    );
  }
  
  if (!transaksi) {
    return (
      <Layout pageTitle="Detail Transaksi">
        <div className="text-center p-12">
          <h2 className="text-2xl font-bold text-gray-800">Data Transaksi tidak ditemukan</h2>
          <p className="text-gray-600 mt-2">
            Transaksi dengan ID {id} tidak terdaftar dalam sistem
          </p>
          <Button asChild className="mt-6">
            <Link to="/transaksi">Kembali ke Daftar Transaksi</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Detail Transaksi">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link to="/transaksi">
            <Button variant="outline" size="icon">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Detail Transaksi</h1>
        </div>
        
        <div className="flex gap-2">
          {transaksi.jenis === "Angsuran" ? (
            <Button 
              variant="outline" 
              onClick={() => navigate(`/transaksi/angsuran/edit/${id}`)}
            >
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </Button>
          ) : transaksi.jenis === "Simpan" ? (
            <Button 
              variant="outline" 
              onClick={() => navigate(`/transaksi/simpan/edit/${id}`)}
            >
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </Button>
          ) : transaksi.jenis === "Pinjam" ? (
            <Button 
              variant="outline" 
              onClick={() => navigate(`/transaksi/pinjam/edit/${id}`)}
            >
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </Button>
          ) : null}
          
          <Button 
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="w-4 h-4 mr-2" /> Hapus
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Informasi Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">ID Transaksi</p>
              <p className="font-semibold">{transaksi.id}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Tanggal</p>
              <p>{formatDate(transaksi.tanggal)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Jenis Transaksi</p>
              <div className="flex items-center">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  transaksi.jenis === "Simpan" ? "bg-green-100 text-green-800" : 
                  transaksi.jenis === "Pinjam" ? "bg-amber-100 text-amber-800" : 
                  "bg-blue-100 text-blue-800"
                }`}>
                  {transaksi.jenis}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
              <div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  transaksi.status === "Sukses" ? "bg-green-100 text-green-800" : 
                  transaksi.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                  "bg-red-100 text-red-800"
                }`}>
                  {transaksi.status}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Jumlah</p>
              <p className="text-lg font-bold">{formatCurrency(transaksi.jumlah)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Keterangan</p>
              <p>{transaksi.keterangan || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Informasi Anggota</CardTitle>
        </CardHeader>
        <CardContent>
          {anggota ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">ID Anggota</p>
                <p className="font-semibold">{anggota.id}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Nama</p>
                <p>
                  <Link 
                    to={`/anggota/${anggota.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {anggota.nama}
                  </Link>
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">No. HP</p>
                <p>{anggota.noHp || "-"}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Alamat</p>
                <p>{anggota.alamat || "-"}</p>
              </div>
            </div>
          ) : (
            <p className="text-yellow-600">
              Data anggota tidak ditemukan
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}

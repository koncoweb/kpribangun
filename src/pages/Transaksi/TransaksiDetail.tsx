import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Calendar, User, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getTransaksiById } from "@/services/transaksiService";
import { getAnggotaById } from "@/services/anggotaService";
import { Anggota, Transaksi } from "@/types";

export default function TransaksiDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [anggota, setAnggota] = useState<Anggota | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundTransaksi = getTransaksiById(id);
      if (foundTransaksi) {
        setTransaksi(foundTransaksi);
        
        // Get anggota data
        const foundAnggota = getAnggotaById(foundTransaksi.anggotaId);
        if (foundAnggota) {
          setAnggota(foundAnggota);
        }
      } else {
        toast({
          title: "Transaksi tidak ditemukan",
          description: "Data transaksi yang dicari tidak ditemukan",
          variant: "destructive",
        });
        navigate("/transaksi");
      }
    }
  }, [id, navigate, toast]);
  
  if (!transaksi) {
    return (
      <Layout pageTitle="Detail Transaksi">
        <div className="flex justify-center items-center h-64">
          <p>Memuat data transaksi...</p>
        </div>
      </Layout>
    );
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  
  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    const bgColor = status === "Sukses" ? "bg-green-100 text-green-800" : 
                    status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                    "bg-red-100 text-red-800";
                    
    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
        {status}
      </div>
    );
  };

  return (
    <Layout pageTitle={`Detail Transaksi - ${transaksi.id}`}>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Detail Transaksi</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">
              Informasi Transaksi {transaksi.jenis}
            </CardTitle>
            <div className="flex items-center gap-2">
              {renderStatusBadge(transaksi.status)}
              <Button variant="outline" size="sm" className="gap-1">
                <FileText size={16} /> Cetak Bukti
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="rounded-lg bg-accent/40 p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full p-2 bg-accent">
                        <Calendar size={18} className="text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">ID & Tanggal Transaksi</h3>
                        <p className="text-xl font-semibold">{transaksi.id}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(transaksi.tanggal)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className={`rounded-full p-2 ${
                        transaksi.jenis === "Simpan" ? "bg-green-100" : 
                        transaksi.jenis === "Pinjam" ? "bg-amber-100" : 
                        "bg-blue-100"}`}>
                        <CreditCard size={18} className={
                          transaksi.jenis === "Simpan" ? "text-green-600" : 
                          transaksi.jenis === "Pinjam" ? "text-amber-600" : 
                          "text-blue-600"
                        } />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Jenis & Jumlah Transaksi</h3>
                        <p className="text-xl font-semibold">
                          Rp {transaksi.jumlah.toLocaleString("id-ID")}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            transaksi.jenis === "Simpan" ? "bg-green-100 text-green-800" : 
                            transaksi.jenis === "Pinjam" ? "bg-amber-100 text-amber-800" : 
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {transaksi.jenis}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="rounded-lg bg-accent/40 p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full p-2 bg-accent">
                        <User size={18} className="text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Informasi Anggota</h3>
                        <p className="text-xl font-semibold">{transaksi.anggotaNama || 'Tidak ada nama'}</p>
                        <p className="text-sm text-muted-foreground">{transaksi.anggotaId}</p>
                        
                        {anggota && (
                          <div className="mt-2 text-sm">
                            <p>{anggota.noHp}</p>
                            <p className="text-muted-foreground">{anggota.alamat}</p>
                          </div>
                        )}
                        
                        <div className="mt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => navigate(`/anggota/${transaksi.anggotaId}`)}
                          >
                            Lihat Detail Anggota
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Keterangan Transaksi</h3>
                      <p className="mt-1">{transaksi.keterangan || "-"}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                      <div>
                        <h3 className="text-xs text-muted-foreground">Dibuat pada</h3>
                        <p>{new Date(transaksi.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}</p>
                      </div>
                      <div>
                        <h3 className="text-xs text-muted-foreground">Terakhir diperbarui</h3>
                        <p>{new Date(transaksi.updatedAt || transaksi.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}</p>
                      </div>
                      <div>
                        <h3 className="text-xs text-muted-foreground">Status</h3>
                        <p>{renderStatusBadge(transaksi.status)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

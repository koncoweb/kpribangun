
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Edit, Trash, Check, X } from "lucide-react";
import { getPengajuanById, updatePengajuan, deletePengajuan, approvePengajuan, rejectPengajuan } from "@/services/pengajuanService";
import { getAnggotaById } from "@/services/anggotaService";
import { Anggota, Pengajuan } from "@/types";

export default function PengajuanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pengajuan, setPengajuan] = useState<Pengajuan | null>(null);
  const [anggota, setAnggota] = useState<Anggota | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<"Menunggu" | "Disetujui" | "Ditolak" | "">("");

  useEffect(() => {
    if (id) {
      const pengajuanData = getPengajuanById(id);
      if (pengajuanData) {
        setPengajuan(pengajuanData);
        
        // Load anggota data
        const anggotaData = getAnggotaById(pengajuanData.anggotaId);
        if (anggotaData) {
          setAnggota(anggotaData);
        }
      } else {
        toast({
          title: "Data tidak ditemukan",
          description: `Pengajuan dengan ID ${id} tidak ditemukan`,
          variant: "destructive",
        });
        navigate("/transaksi/pengajuan");
      }
    }
    setLoading(false);
  }, [id, navigate, toast]);

  const handleDelete = () => {
    if (id) {
      const success = deletePengajuan(id);
      if (success) {
        toast({
          title: "Pengajuan berhasil dihapus",
          description: `Pengajuan dengan ID ${id} telah dihapus dari sistem`,
        });
        navigate("/transaksi/pengajuan");
      } else {
        toast({
          title: "Gagal menghapus pengajuan",
          description: "Terjadi kesalahan saat menghapus data pengajuan",
          variant: "destructive",
        });
      }
      setIsDeleteDialogOpen(false);
    }
  };

  const handleUpdateStatus = () => {
    if (id && newStatus && pengajuan) {
      let success;
      
      if (newStatus === "Disetujui") {
        success = approvePengajuan(id);
      } else if (newStatus === "Ditolak") {
        success = rejectPengajuan(id);
      } else {
        success = updatePengajuan(id, { status: newStatus });
      }
      
      if (success) {
        // Refresh pengajuan data
        const updatedPengajuan = getPengajuanById(id);
        if (updatedPengajuan) {
          setPengajuan(updatedPengajuan);
          toast({
            title: "Status berhasil diperbarui",
            description: `Status pengajuan telah diubah menjadi ${newStatus}`,
          });
        }
      } else {
        toast({
          title: "Gagal memperbarui status",
          description: "Terjadi kesalahan saat memperbarui status pengajuan",
          variant: "destructive",
        });
      }
      setIsStatusDialogOpen(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Layout pageTitle="Detail Pengajuan">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Memuat data...</p>
        </div>
      </Layout>
    );
  }

  if (!pengajuan) {
    return (
      <Layout pageTitle="Detail Pengajuan">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Data pengajuan tidak ditemukan</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Detail Pengajuan">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/transaksi/pengajuan">
            <Button variant="outline" size="icon">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="page-title">Detail Pengajuan</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/transaksi/pengajuan/${id}/edit`)}
          >
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash size={16} className="mr-2" />
            Hapus
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Informasi Pengajuan #{pengajuan.id}</span>
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                  pengajuan.status === "Disetujui" ? "bg-green-100 text-green-800" : 
                  pengajuan.status === "Menunggu" ? "bg-yellow-100 text-yellow-800" : 
                  "bg-red-100 text-red-800"
                }`}>
                  {pengajuan.status}
                </span>
              </CardTitle>
              <CardDescription>
                Diajukan pada {formatDate(pengajuan.tanggal)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Detail Pengajuan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Jenis Pengajuan</p>
                    <p className="font-medium">
                      <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
                        pengajuan.jenis === "Simpan" ? "bg-green-100 text-green-800" : 
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {pengajuan.jenis === "Simpan" ? "Simpanan" : "Pinjaman"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jumlah</p>
                    <p className="font-medium">
                      {formatCurrency(pengajuan.jumlah)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {anggota && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informasi Anggota</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nama Anggota</p>
                      <p className="font-medium">{anggota.nama}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ID Anggota</p>
                      <p className="font-medium">{anggota.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">No. Telepon</p>
                      <p className="font-medium">{anggota.noHp}</p>
                    </div>
                  </div>
                </div>
              )}

              {pengajuan.keterangan && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Keterangan</h3>
                    <p className="text-gray-700">{pengajuan.keterangan}</p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Terakhir diperbarui: {formatDate(pengajuan.updatedAt)}
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Tindakan</CardTitle>
              <CardDescription>
                Kelola status pengajuan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pengajuan.status === "Menunggu" ? (
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setNewStatus("Disetujui");
                      setIsStatusDialogOpen(true);
                    }}
                  >
                    <Check size={16} className="mr-2" />
                    Setujui Pengajuan
                  </Button>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      setNewStatus("Ditolak");
                      setIsStatusDialogOpen(true);
                    }}
                  >
                    <X size={16} className="mr-2" />
                    Tolak Pengajuan
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-center text-sm mb-2">
                    Status saat ini: <span className="font-medium">{pengajuan.status}</span>
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setNewStatus("");
                      setIsStatusDialogOpen(true);
                    }}
                  >
                    Ubah Status
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Pengajuan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengajuan ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus ? `Ubah Status ke ${newStatus}` : "Ubah Status Pengajuan"}
            </DialogTitle>
            <DialogDescription>
              {newStatus ? (
                newStatus === "Disetujui" 
                  ? "Pengajuan yang disetujui dapat diproses lebih lanjut menjadi transaksi."
                  : "Pengajuan yang ditolak tidak dapat diproses lebih lanjut."
              ) : (
                "Pilih status baru untuk pengajuan ini."
              )}
            </DialogDescription>
          </DialogHeader>

          {!newStatus && (
            <div className="py-4">
              <Select onValueChange={(value: "Menunggu" | "Disetujui" | "Ditolak") => setNewStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Menunggu">Menunggu</SelectItem>
                  <SelectItem value="Disetujui">Disetujui</SelectItem>
                  <SelectItem value="Ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleUpdateStatus} 
              disabled={!newStatus && newStatus !== ""}
              className={
                newStatus === "Disetujui" ? "bg-green-600 hover:bg-green-700" :
                newStatus === "Ditolak" ? "bg-red-600 hover:bg-red-700" : ""
              }
            >
              Konfirmasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

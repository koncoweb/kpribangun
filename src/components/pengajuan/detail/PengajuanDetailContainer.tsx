
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getPengajuanByIdFromSupabase, deletePengajuanFromSupabase, updatePengajuanInSupabase } from "@/services/pengajuan/adapter";
import { getAnggotaById } from "@/services/anggotaService";
import { Anggota, Pengajuan } from "@/types";
import PengajuanDetailLayout from "./PengajuanDetailLayout";
import { StatusUpdateDialog } from "@/components/pengajuan/StatusUpdateDialog";
import { DeletePengajuanDialog } from "@/components/pengajuan/DeletePengajuanDialog";

export default function PengajuanDetailContainer() {
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
    const loadData = async () => {
      if (id) {
        try {
          setLoading(true);
          const pengajuanData = await getPengajuanByIdFromSupabase(id);
          if (pengajuanData) {
            setPengajuan(pengajuanData);
            
            // Load anggota data
            if (pengajuanData.anggotaId) {
              const anggotaData = await getAnggotaById(pengajuanData.anggotaId);
              if (anggotaData) {
                setAnggota(anggotaData);
              }
            }
          } else {
            toast({
              title: "Data tidak ditemukan",
              description: `Pengajuan dengan ID ${id} tidak ditemukan`,
              variant: "destructive",
            });
            navigate("/transaksi/pengajuan");
          }
        } catch (error) {
          console.error("Error loading pengajuan data:", error);
          toast({
            title: "Error",
            description: "Terjadi kesalahan saat memuat data pengajuan",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
  }, [id, navigate, toast]);

  const handleDelete = async () => {
    if (id) {
      try {
        const success = await deletePengajuanFromSupabase(id);
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
      } catch (error) {
        console.error("Error deleting pengajuan:", error);
        toast({
          title: "Gagal menghapus pengajuan",
          description: "Terjadi kesalahan saat menghapus data pengajuan",
          variant: "destructive",
        });
      }
      setIsDeleteDialogOpen(false);
    }
  };

  const handleUpdateStatus = async (status: "Menunggu" | "Disetujui" | "Ditolak") => {
    if (id && pengajuan) {
      try {
        // Update the pengajuan status in Supabase
        const updatedPengajuan = await updatePengajuanInSupabase(id, { status });
        
        if (updatedPengajuan) {
          // Show appropriate toast message based on the new status
          if (status === "Disetujui") {
            toast({
              title: "Pengajuan disetujui",
              description: `Pengajuan telah disetujui dan transaksi baru telah dibuat`,
            });
          } else if (status === "Ditolak") {
            toast({
              title: "Pengajuan ditolak",
              description: `Pengajuan telah ditandai sebagai ditolak`,
            });
          } else {
            toast({
              title: "Status berhasil diperbarui",
              description: `Status pengajuan telah diubah menjadi ${status}`,
            });
          }
          
          // Update the local state with the updated pengajuan
          setPengajuan(updatedPengajuan);
        } else {
          toast({
            title: "Gagal memperbarui status",
            description: "Terjadi kesalahan saat memperbarui status pengajuan",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error updating pengajuan status:", error);
        toast({
          title: "Gagal memperbarui status",
          description: "Terjadi kesalahan saat memperbarui status pengajuan",
          variant: "destructive",
        });
      }
      setIsStatusDialogOpen(false);
    }
  };

  // Get dialog title and description based on status
  const getStatusDialogProps = () => {
    if (newStatus === "Disetujui") {
      return {
        title: "Setujui Pengajuan",
        description: "Pengajuan yang disetujui akan diubah statusnya menjadi 'Disetujui' dan akan otomatis membuat transaksi baru. Apakah Anda yakin?",
        confirmLabel: "Setujui",
        confirmVariant: "default"
      };
    } else if (newStatus === "Ditolak") {
      return {
        title: "Tolak Pengajuan",
        description: "Pengajuan yang ditolak akan diubah statusnya menjadi 'Ditolak'. Apakah Anda yakin?",
        confirmLabel: "Tolak",
        confirmVariant: "destructive"
      };
    } else {
      return {
        title: "Ubah Status Pengajuan",
        description: "Pilih status baru untuk pengajuan ini.",
        confirmLabel: "Simpan Perubahan",
        confirmVariant: "default"
      };
    }
  };

  const statusDialogProps = getStatusDialogProps();

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <p>Memuat data...</p>
        </div>
      ) : !pengajuan ? (
        <div className="flex justify-center items-center h-[50vh]">
          <p>Data pengajuan tidak ditemukan</p>
        </div>
      ) : (
        <>
          <PengajuanDetailLayout
            pengajuan={pengajuan}
            anggota={anggota}
            onDeleteClick={() => setIsDeleteDialogOpen(true)}
            onApproveClick={() => {
              setNewStatus("Disetujui");
              setIsStatusDialogOpen(true);
            }}
            onRejectClick={() => {
              setNewStatus("Ditolak");
              setIsStatusDialogOpen(true);
            }}
            onChangeStatusClick={() => {
              setNewStatus(pengajuan.status as "Menunggu" | "Disetujui" | "Ditolak");
              setIsStatusDialogOpen(true);
            }}
          />

          <DeletePengajuanDialog 
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleDelete}
          />

          <StatusUpdateDialog 
            open={isStatusDialogOpen}
            onOpenChange={setIsStatusDialogOpen}
            onConfirm={handleUpdateStatus}
            currentStatus={pengajuan.status as "Menunggu" | "Disetujui" | "Ditolak"}
            title={statusDialogProps.title}
            description={statusDialogProps.description}
            confirmLabel={statusDialogProps.confirmLabel}
            confirmVariant={statusDialogProps.confirmVariant}
          />
        </>
      )}
    </>
  );
}

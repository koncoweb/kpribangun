
import React, { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  deletePengajuan, 
  approvePengajuan, 
  rejectPengajuan 
} from "@/services/pengajuanService";
import { Pengajuan } from "@/types";
import { PengajuanTableRow } from "./PengajuanTableRow";
import { PengajuanDialogs } from "./PengajuanDialogs";

interface PengajuanTableProps {
  data: Pengajuan[];
  onDataChange: () => void;
}

export default function PengajuanTable({ data, onDataChange }: PengajuanTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPengajuan, setSelectedPengajuan] = useState<Pengajuan | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  
  const handleViewPengajuan = (pengajuan: Pengajuan) => {
    navigate(`/transaksi/pengajuan/${pengajuan.id}`);
  };
  
  const handleEditPengajuan = (pengajuan: Pengajuan) => {
    navigate(`/transaksi/pengajuan/${pengajuan.id}/edit`);
  };
  
  const handleDeleteClick = (pengajuan: Pengajuan) => {
    setSelectedPengajuan(pengajuan);
    setIsDeleteDialogOpen(true);
  };
  
  const handleApproveClick = (pengajuan: Pengajuan) => {
    setSelectedPengajuan(pengajuan);
    setIsApproveDialogOpen(true);
  };
  
  const handleRejectClick = (pengajuan: Pengajuan) => {
    setSelectedPengajuan(pengajuan);
    setIsRejectDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (selectedPengajuan) {
      try {
        const isDeleted = deletePengajuan(selectedPengajuan.id);
        if (isDeleted) {
          toast({
            title: "Pengajuan berhasil dihapus",
            description: `Pengajuan dengan ID ${selectedPengajuan.id} telah dihapus`
          });
          onDataChange();
        } else {
          toast({
            title: "Gagal menghapus pengajuan",
            description: "Pengajuan tidak ditemukan",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error deleting pengajuan:", error);
        toast({
          title: "Terjadi kesalahan",
          description: "Gagal menghapus pengajuan. Silakan coba lagi.",
          variant: "destructive"
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedPengajuan(null);
      }
    }
  };
  
  const handleApproveConfirm = () => {
    if (selectedPengajuan) {
      try {
        const isApproved = approvePengajuan(selectedPengajuan.id);
        if (isApproved) {
          toast({
            title: "Pengajuan berhasil disetujui",
            description: `Pengajuan dengan ID ${selectedPengajuan.id} telah disetujui dan transaksi telah dibuat`
          });
          onDataChange();
        } else {
          toast({
            title: "Gagal menyetujui pengajuan",
            description: "Pengajuan tidak ditemukan atau status tidak valid",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error approving pengajuan:", error);
        toast({
          title: "Terjadi kesalahan",
          description: "Gagal menyetujui pengajuan. Silakan coba lagi.",
          variant: "destructive"
        });
      } finally {
        setIsApproveDialogOpen(false);
        setSelectedPengajuan(null);
      }
    }
  };
  
  const handleRejectConfirm = () => {
    if (selectedPengajuan) {
      try {
        const isRejected = rejectPengajuan(selectedPengajuan.id);
        if (isRejected) {
          toast({
            title: "Pengajuan ditolak",
            description: `Pengajuan dengan ID ${selectedPengajuan.id} telah ditolak`
          });
          onDataChange();
        } else {
          toast({
            title: "Gagal menolak pengajuan",
            description: "Pengajuan tidak ditemukan atau status tidak valid",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error rejecting pengajuan:", error);
        toast({
          title: "Terjadi kesalahan",
          description: "Gagal menolak pengajuan. Silakan coba lagi.",
          variant: "destructive"
        });
      } finally {
        setIsRejectDialogOpen(false);
        setSelectedPengajuan(null);
      }
    }
  };
  
  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Anggota</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right w-[100px]">Opsi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Belum ada data pengajuan
                </TableCell>
              </TableRow>
            ) : (
              data.map((pengajuan) => (
                <PengajuanTableRow
                  key={pengajuan.id}
                  pengajuan={pengajuan}
                  onView={handleViewPengajuan}
                  onEdit={handleEditPengajuan}
                  onApprove={handleApproveClick}
                  onReject={handleRejectClick}
                  onDelete={handleDeleteClick}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <PengajuanDialogs
        selectedPengajuan={selectedPengajuan}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isApproveDialogOpen={isApproveDialogOpen}
        setIsApproveDialogOpen={setIsApproveDialogOpen}
        isRejectDialogOpen={isRejectDialogOpen}
        setIsRejectDialogOpen={setIsRejectDialogOpen}
        onDeleteConfirm={handleDeleteConfirm}
        onApproveConfirm={handleApproveConfirm}
        onRejectConfirm={handleRejectConfirm}
      />
    </>
  );
}

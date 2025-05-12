import React, { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { MoreHorizontal, Pencil, Trash2, Eye, CheckCircle, XCircle } from "lucide-react";
import { 
  Pengajuan, 
  deletePengajuan, 
  approvePengajuan, 
  rejectPengajuan 
} from "@/services/pengajuanService";
import { Pengajuan } from "@/types"; // Import Pengajuan from types instead
import { DeletePengajuanDialog } from "./DeletePengajuanDialog";
import { StatusUpdateDialog } from "./StatusUpdateDialog";

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
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Menunggu": return "bg-yellow-100 text-yellow-800";
      case "Disetujui": return "bg-green-100 text-green-800";
      case "Ditolak": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
                <TableRow key={pengajuan.id}>
                  <TableCell className="font-medium">{pengajuan.id}</TableCell>
                  <TableCell>{formatDate(pengajuan.tanggal)}</TableCell>
                  <TableCell>{pengajuan.anggotaNama}</TableCell>
                  <TableCell>{pengajuan.jenis}</TableCell>
                  <TableCell>{pengajuan.kategori}</TableCell>
                  <TableCell className="text-right">
                    Rp {pengajuan.jumlah.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={getBadgeColor(pengajuan.status)}
                    >
                      {pengajuan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleViewPengajuan(pengajuan)}
                          className="flex items-center gap-2"
                        >
                          <Eye size={16} /> Lihat Detail
                        </DropdownMenuItem>
                        
                        {pengajuan.status === "Menunggu" && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleEditPengajuan(pengajuan)}
                              className="flex items-center gap-2"
                            >
                              <Pencil size={16} /> Edit
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              onClick={() => handleApproveClick(pengajuan)}
                              className="flex items-center gap-2 text-green-600"
                            >
                              <CheckCircle size={16} /> Setujui
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              onClick={() => handleRejectClick(pengajuan)}
                              className="flex items-center gap-2 text-amber-600"
                            >
                              <XCircle size={16} /> Tolak
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(pengajuan)}
                          className="flex items-center gap-2 text-red-600"
                        >
                          <Trash2 size={16} /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <DeletePengajuanDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
      
      {/* Approve Confirmation Dialog */}
      <StatusUpdateDialog
        currentStatus="Menunggu"
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
        onConfirm={handleApproveConfirm}
        title="Setujui Pengajuan"
        description="Pengajuan yang disetujui akan diubah statusnya menjadi 'Disetujui' dan akan otomatis membuat transaksi baru. Apakah Anda yakin?"
        confirmLabel="Setujui"
        confirmVariant="default"
      />
      
      {/* Reject Confirmation Dialog */}
      <StatusUpdateDialog
        currentStatus="Menunggu"
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        onConfirm={handleRejectConfirm}
        title="Tolak Pengajuan"
        description="Pengajuan yang ditolak akan diubah statusnya menjadi 'Ditolak'. Apakah Anda yakin?"
        confirmLabel="Tolak"
        confirmVariant="destructive"
      />
    </>
  );
}

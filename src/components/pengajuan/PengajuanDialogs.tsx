
import React from "react";
import { DeletePengajuanDialog } from "./DeletePengajuanDialog";
import { StatusUpdateDialog } from "./StatusUpdateDialog";
import { Pengajuan } from "@/types";

interface PengajuanDialogsProps {
  selectedPengajuan: Pengajuan | null;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  isApproveDialogOpen: boolean;
  setIsApproveDialogOpen: (isOpen: boolean) => void;
  isRejectDialogOpen: boolean;
  setIsRejectDialogOpen: (isOpen: boolean) => void;
  onDeleteConfirm: () => void;
  onApproveConfirm: () => void;
  onRejectConfirm: () => void;
}

export function PengajuanDialogs({
  selectedPengajuan,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isApproveDialogOpen,
  setIsApproveDialogOpen,
  isRejectDialogOpen,
  setIsRejectDialogOpen,
  onDeleteConfirm,
  onApproveConfirm,
  onRejectConfirm
}: PengajuanDialogsProps) {
  return (
    <>
      {/* Delete Confirmation Dialog */}
      <DeletePengajuanDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onDeleteConfirm}
      />
      
      {/* Approve Confirmation Dialog */}
      <StatusUpdateDialog
        currentStatus="Menunggu"
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
        onConfirm={onApproveConfirm}
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
        onConfirm={onRejectConfirm}
        title="Tolak Pengajuan"
        description="Pengajuan yang ditolak akan diubah statusnya menjadi 'Ditolak'. Apakah Anda yakin?"
        confirmLabel="Tolak"
        confirmVariant="destructive"
      />
    </>
  );
}

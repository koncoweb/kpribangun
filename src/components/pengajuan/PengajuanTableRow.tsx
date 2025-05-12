
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Pengajuan } from "@/types";
import { PengajuanStatusBadge } from "./PengajuanStatusBadge";
import { PengajuanActions } from "./PengajuanActions";

interface PengajuanTableRowProps {
  pengajuan: Pengajuan;
  onView: (pengajuan: Pengajuan) => void;
  onEdit: (pengajuan: Pengajuan) => void;
  onApprove: (pengajuan: Pengajuan) => void;
  onReject: (pengajuan: Pengajuan) => void;
  onDelete: (pengajuan: Pengajuan) => void;
}

export function PengajuanTableRow({
  pengajuan,
  onView,
  onEdit,
  onApprove,
  onReject,
  onDelete
}: PengajuanTableRowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  
  return (
    <TableRow>
      <TableCell className="font-medium">{pengajuan.id}</TableCell>
      <TableCell>{formatDate(pengajuan.tanggal)}</TableCell>
      <TableCell>{pengajuan.anggotaNama}</TableCell>
      <TableCell>{pengajuan.jenis}</TableCell>
      <TableCell>{pengajuan.kategori}</TableCell>
      <TableCell className="text-right">
        Rp {pengajuan.jumlah.toLocaleString("id-ID")}
      </TableCell>
      <TableCell>
        <PengajuanStatusBadge status={pengajuan.status} />
      </TableCell>
      <TableCell className="text-right">
        <PengajuanActions
          pengajuan={pengajuan}
          onView={onView}
          onEdit={onEdit}
          onApprove={onApprove}
          onReject={onReject}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}

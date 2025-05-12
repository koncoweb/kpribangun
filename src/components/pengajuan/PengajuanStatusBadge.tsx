
import React from "react";
import { Badge } from "@/components/ui/badge";

interface PengajuanStatusBadgeProps {
  status: string;
}

export function PengajuanStatusBadge({ status }: PengajuanStatusBadgeProps) {
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Menunggu": return "bg-yellow-100 text-yellow-800";
      case "Disetujui": return "bg-green-100 text-green-800";
      case "Ditolak": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <Badge 
      variant="outline" 
      className={getBadgeColor(status)}
    >
      {status}
    </Badge>
  );
}

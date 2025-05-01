
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface PengajuanActionCardProps {
  status: "Menunggu" | "Disetujui" | "Ditolak";
  onApprove: () => void;
  onReject: () => void;
  onChangeStatus: () => void;
}

export function PengajuanActionCard({ 
  status, 
  onApprove, 
  onReject, 
  onChangeStatus 
}: PengajuanActionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tindakan</CardTitle>
        <CardDescription>
          Kelola status pengajuan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "Menunggu" ? (
          <div className="grid grid-cols-1 gap-2">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={onApprove}
            >
              <Check size={16} className="mr-2" />
              Setujui Pengajuan
            </Button>
            <Button 
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={onReject}
            >
              <X size={16} className="mr-2" />
              Tolak Pengajuan
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-center text-sm mb-2">
              Status saat ini: <span className="font-medium">{status}</span>
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onChangeStatus}
            >
              Ubah Status
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

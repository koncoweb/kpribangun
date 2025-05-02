
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { formatDate } from "./utils";

interface LoanSummaryProps {
  selectedLoan: any;
  remainingAmount: number;
  simpananBalance: number;
  onBayarAngsuran: (pinjamanId: string) => void;
  selectedPinjaman: string;
}

export function LoanSummary({ 
  selectedLoan, 
  remainingAmount, 
  simpananBalance,
  onBayarAngsuran,
  selectedPinjaman
}: LoanSummaryProps) {
  if (!selectedLoan) return null;
  
  return (
    <div className="bg-muted/50 p-4 rounded-md mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Pinjaman</p>
          <p className="font-medium">Rp {selectedLoan.jumlah.toLocaleString("id-ID")}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Sisa Pinjaman</p>
          <p className="font-medium">Rp {remainingAmount.toLocaleString("id-ID")}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tanggal Pinjam</p>
          <p className="font-medium">{formatDate(selectedLoan.tanggal)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Saldo Simpanan</p>
          <p className="font-medium">Rp {simpananBalance.toLocaleString("id-ID")}</p>
        </div>
      </div>
      {remainingAmount > 0 && (
        <div className="mt-4">
          <Button
            onClick={() => onBayarAngsuran(selectedPinjaman)}
            size="sm"
            className="mr-2"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Bayar Angsuran
          </Button>
        </div>
      )}
    </div>
  );
}

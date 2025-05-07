
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  AlertTriangle, 
  Calculator,
  BadgeDollarSign // Import for SHU icon
} from "lucide-react";

interface FinancialSummaryCardsProps {
  totalSimpanan: number;
  totalPinjaman: number;
  totalAngsuran: number;
  totalTunggakan: number;
  totalSHU: number; // Add totalSHU to props
}

export function FinancialSummaryCards({
  totalSimpanan,
  totalPinjaman,
  totalAngsuran,
  totalTunggakan,
  totalSHU
}: FinancialSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Simpanan</p>
              <p className="text-xl font-bold">Rp {totalSimpanan.toLocaleString("id-ID")}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <Wallet className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Pinjaman</p>
              <p className="text-xl font-bold">Rp {(totalPinjaman + totalAngsuran).toLocaleString("id-ID")}</p>
            </div>
            <div className="rounded-full bg-amber-100 p-3">
              <CreditCard className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Sisa Pinjaman</p>
              <p className="text-xl font-bold">Rp {totalPinjaman.toLocaleString("id-ID")}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <Calculator className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Angsuran</p>
              <p className="text-xl font-bold">Rp {totalAngsuran.toLocaleString("id-ID")}</p>
            </div>
            <div className="rounded-full bg-indigo-100 p-3">
              <ArrowUpRight className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Tunggakan</p>
              <p className="text-xl font-bold">Rp {totalTunggakan.toLocaleString("id-ID")}</p>
            </div>
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add new card for SHU */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">SHU</p>
              <p className="text-xl font-bold">Rp {totalSHU.toLocaleString("id-ID")}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <BadgeDollarSign className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

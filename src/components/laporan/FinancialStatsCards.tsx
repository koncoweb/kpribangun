
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Receipt, User, Wallet } from "lucide-react";

interface FinancialStatsCardsProps {
  stats: {
    totalAnggota: number;
    totalSimpanan: number;
    totalPinjaman: number;
    totalAngsuran: number;
  };
}

export function FinancialStatsCards({ stats }: FinancialStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4 flex flex-col">
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <Wallet size={20} />
            <span className="font-medium text-sm">Total Simpanan</span>
          </div>
          <span className="text-2xl font-bold text-blue-700">{formatCurrency(stats.totalSimpanan)}</span>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <CardContent className="p-4 flex flex-col">
          <div className="flex items-center space-x-2 text-amber-600 mb-2">
            <CreditCard size={20} />
            <span className="font-medium text-sm">Total Pinjaman</span>
          </div>
          <span className="text-2xl font-bold text-amber-700">{formatCurrency(stats.totalPinjaman)}</span>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-4 flex flex-col">
          <div className="flex items-center space-x-2 text-green-600 mb-2">
            <Receipt size={20} />
            <span className="font-medium text-sm">Total Angsuran</span>
          </div>
          <span className="text-2xl font-bold text-green-700">{formatCurrency(stats.totalAngsuran)}</span>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-4 flex flex-col">
          <div className="flex items-center space-x-2 text-purple-600 mb-2">
            <User size={20} />
            <span className="font-medium text-sm">Jumlah Anggota</span>
          </div>
          <span className="text-2xl font-bold text-purple-700">{formatNumber(stats.totalAnggota)}</span>
        </CardContent>
      </Card>
    </div>
  );
}

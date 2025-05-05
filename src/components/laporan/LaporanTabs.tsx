
import { AlertTriangle, Clock, CreditCard, FileCheck, Receipt, User, Wallet } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { AnggotaTabContent } from "./AnggotaTabContent";
import { PengajuanTabContent } from "./PengajuanTabContent";
import { SimpananTabContent } from "./SimpananTabContent";
import { PinjamanTabContent } from "./PinjamanTabContent";
import { AngsuranTabContent } from "./AngsuranTabContent";
import { JatuhTempoTabContent } from "./JatuhTempoTabContent";
import { TunggakanTabContent } from "./TunggakanTabContent";
import { Anggota, Pengajuan, Transaksi } from "@/types";

// Define proper chart data interfaces
interface ChartDataItem {
  name: string;
  [key: string]: number | string;
}

interface LaporanChartData {
  simpanan: Array<ChartDataItem & { simpanan: number }>;
  pinjaman: Array<ChartDataItem & { pinjaman: number }>;
  angsuran: Array<ChartDataItem & { angsuran: number }>;
  pengajuan: any[]; // This one is different as it's for PieChart
  anggota: Array<ChartDataItem & { anggota: number }>;
}

interface LaporanTabsProps {
  anggotaList: Anggota[];
  transaksiList: Transaksi[];
  pengajuanList: Pengajuan[];
  chartData: LaporanChartData;
  stats: {
    totalAnggota: number;
    totalSimpanan: number;
    totalPinjaman: number;
    totalAngsuran: number;
    totalPengajuan: number;
    totalTunggakan: number;
    totalJatuhTempo: number;
  };
  chartColors: {
    simpanan: string;
    pinjaman: string;
    angsuran: string;
    tunggakan: string;
    pengajuan: string;
    anggota: string;
    jatuhTempo: string;
  };
  pieColors: string[];
  filterDateStart: Date;
  filterDateEnd: Date;
  overdueLoans: any[];
  upcomingDueLoans: any[];
}

export function LaporanTabs({
  anggotaList,
  transaksiList,
  pengajuanList,
  chartData,
  stats,
  chartColors,
  pieColors,
  filterDateStart,
  filterDateEnd,
  overdueLoans,
  upcomingDueLoans,
}: LaporanTabsProps) {
  return (
    <Tabs defaultValue="anggota" className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-7 mb-6">
        <TabsTrigger value="anggota">
          <User className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Anggota</span>
        </TabsTrigger>
        <TabsTrigger value="pengajuan">
          <FileCheck className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Pengajuan</span>
        </TabsTrigger>
        <TabsTrigger value="simpanan">
          <Wallet className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Simpanan</span>
        </TabsTrigger>
        <TabsTrigger value="pinjaman">
          <CreditCard className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Pinjaman</span>
        </TabsTrigger>
        <TabsTrigger value="angsuran">
          <Receipt className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Angsuran</span>
        </TabsTrigger>
        <TabsTrigger value="jatuhtempo">
          <Clock className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Jatuh Tempo</span>
        </TabsTrigger>
        <TabsTrigger value="tunggakan">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Tunggakan</span>
        </TabsTrigger>
      </TabsList>
      
      {/* Tab Anggota */}
      <TabsContent value="anggota">
        <AnggotaTabContent 
          anggotaList={anggotaList}
          chartData={chartData}
          totalAnggota={stats.totalAnggota}
          chartColors={chartColors}
        />
      </TabsContent>
      
      {/* Tab Pengajuan */}
      <TabsContent value="pengajuan">
        <PengajuanTabContent
          pengajuanList={pengajuanList}
          chartData={chartData}
          pieColors={pieColors}
        />
      </TabsContent>
      
      {/* Tab Simpanan */}
      <TabsContent value="simpanan">
        <SimpananTabContent
          transaksiList={transaksiList}
          totalSimpanan={stats.totalSimpanan}
          chartData={chartData}
          chartColors={chartColors}
          filterDateStart={filterDateStart}
          filterDateEnd={filterDateEnd}
        />
      </TabsContent>
      
      {/* Tab Pinjaman */}
      <TabsContent value="pinjaman">
        <PinjamanTabContent
          transaksiList={transaksiList}
          totalPinjaman={stats.totalPinjaman}
          chartData={chartData}
          chartColors={chartColors}
          filterDateStart={filterDateStart}
          filterDateEnd={filterDateEnd}
        />
      </TabsContent>
      
      {/* Tab Angsuran */}
      <TabsContent value="angsuran">
        <AngsuranTabContent
          transaksiList={transaksiList}
          totalAngsuran={stats.totalAngsuran}
          chartData={chartData}
          chartColors={chartColors}
          filterDateStart={filterDateStart}
          filterDateEnd={filterDateEnd}
        />
      </TabsContent>
      
      {/* Tab Jatuh Tempo */}
      <TabsContent value="jatuhtempo">
        <JatuhTempoTabContent
          upcomingDueLoans={upcomingDueLoans}
          chartColors={chartColors}
        />
      </TabsContent>
      
      {/* Tab Tunggakan */}
      <TabsContent value="tunggakan">
        <TunggakanTabContent
          overdueLoans={overdueLoans}
          chartColors={chartColors}
        />
      </TabsContent>
    </Tabs>
  );
}

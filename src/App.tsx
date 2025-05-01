
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import AnggotaList from "./pages/Anggota/AnggotaList";
import AnggotaForm from "./pages/Anggota/AnggotaForm";
import AnggotaDetail from "./pages/Anggota/AnggotaDetail";
import TransaksiList from "./pages/Transaksi/TransaksiList";
import TransaksiForm from "./pages/Transaksi/TransaksiForm";
import TransaksiDetail from "./pages/Transaksi/TransaksiDetail";
import Laporan from "./pages/Laporan/Laporan";
import Pengaturan from "./pages/Pengaturan/Pengaturan";
import NotFound from "./pages/NotFound";

// POS Pages
import POSIndex from "./pages/POS/POSIndex";
import Penjualan from "./pages/POS/Penjualan";
import PenjualanList from "./pages/POS/PenjualanList";
import PenjualanDetail from "./pages/POS/PenjualanDetail";
import StokBarang from "./pages/POS/StokBarang";
import Inventori from "./pages/POS/Inventori";
import NamaKasir from "./pages/POS/NamaKasir";
import RiwayatTransaksi from "./pages/POS/RiwayatTransaksi";
import KuitansiPembayaran from "./pages/POS/KuitansiPembayaran";
import LaporanJualBeli from "./pages/POS/LaporanJualBeli";
import LaporanRugiLaba from "./pages/POS/LaporanRugiLaba";

// Placeholder components for new routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p>Halaman ini belum diimplementasikan</p>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Koperasi Routes */}
          <Route path="/anggota" element={<AnggotaList />} />
          <Route path="/anggota/tambah" element={<AnggotaForm />} />
          <Route path="/anggota/:id" element={<AnggotaDetail />} />
          <Route path="/anggota/:id/edit" element={<AnggotaForm />} />
          <Route path="/transaksi" element={<TransaksiList />} />
          <Route path="/transaksi/baru" element={<TransaksiForm />} />
          <Route path="/transaksi/:id" element={<TransaksiDetail />} />
          <Route path="/transaksi/pengajuan" element={<Placeholder title="Pengajuan" />} />
          <Route path="/transaksi/simpan" element={<Placeholder title="Simpan" />} />
          <Route path="/transaksi/pinjam" element={<Placeholder title="Pinjam" />} />
          <Route path="/transaksi/angsuran" element={<Placeholder title="Angsuran" />} />
          <Route path="/laporan" element={<Laporan />} />
          
          {/* KPRI Mart Routes */}
          <Route path="/pos" element={<POSIndex />} />
          <Route path="/pos/pembelian" element={<Placeholder title="Pembelian" />} />
          <Route path="/pos/penjualan" element={<Penjualan />} />
          <Route path="/pos/penjualan-list" element={<PenjualanList />} />
          <Route path="/pos/penjualan/:id" element={<PenjualanDetail />} />
          <Route path="/pos/stok" element={<StokBarang />} />
          <Route path="/pos/inventori" element={<Inventori />} />
          <Route path="/pos/kasir" element={<NamaKasir />} />
          <Route path="/pos/riwayat" element={<RiwayatTransaksi />} />
          <Route path="/pos/kuitansi" element={<KuitansiPembayaran />} />
          <Route path="/pos/laporan-jual-beli" element={<LaporanJualBeli />} />
          <Route path="/pos/laporan-rugi-laba" element={<LaporanRugiLaba />} />
          
          {/* Pengaturan Routes */}
          <Route path="/pengaturan" element={<Pengaturan />} />
          <Route path="/pengaturan/users" element={<Placeholder title="User Management" />} />
          <Route path="/pengaturan/roles" element={<Placeholder title="Hak Akses" />} />
          <Route path="/pengaturan/koperasi" element={<Placeholder title="Pengaturan Koperasi" />} />
          <Route path="/pengaturan/tenor" element={<Placeholder title="Pengaturan Tenor" />} />
          <Route path="/pengaturan/denda" element={<Placeholder title="Pengaturan Denda" />} />
          <Route path="/pengaturan/bunga" element={<Placeholder title="Pengaturan Suku Bunga" />} />
          <Route path="/pengaturan/backup" element={<Placeholder title="Backup Data" />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

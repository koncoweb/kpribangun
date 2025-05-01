
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { initUserManagementData } from "@/services/userManagementService";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Auth/LoginPage";
import AnggotaLoginPage from "./pages/Auth/AnggotaLoginPage";

import AnggotaList from "./pages/Anggota/AnggotaList";
import AnggotaForm from "./pages/Anggota/AnggotaForm";
import AnggotaDetail from "./pages/Anggota/AnggotaDetail";
import AnggotaChangePassword from "./pages/Anggota/AnggotaChangePassword";

import TransaksiList from "./pages/Transaksi/TransaksiList";
import TransaksiForm from "./pages/Transaksi/TransaksiForm";
import TransaksiDetail from "./pages/Transaksi/TransaksiDetail";

import SimpanList from "./pages/Transaksi/Simpan/SimpanList";
import SimpanForm from "./pages/Transaksi/Simpan/SimpanForm";
import SimpanDetail from "./pages/Transaksi/Simpan/SimpanDetail";

import PinjamList from "./pages/Transaksi/Pinjam/PinjamList";
import PinjamForm from "./pages/Transaksi/Pinjam/PinjamForm";
import PinjamDetail from "./pages/Transaksi/Pinjam/PinjamDetail";

import AngsuranList from "./pages/Transaksi/Angsuran/AngsuranList";
import AngsuranForm from "./pages/Transaksi/Angsuran/AngsuranForm";
import AngsuranDetail from "./pages/Transaksi/Angsuran/AngsuranDetail";

import PengajuanList from "./pages/Transaksi/Pengajuan/PengajuanList";
import PengajuanForm from "./pages/Transaksi/Pengajuan/PengajuanForm";
import PengajuanDetail from "./pages/Transaksi/Pengajuan/PengajuanDetail";

import POSIndex from "./pages/POS/POSIndex";
import Inventori from "./pages/POS/Inventori";
import Pemasok from "./pages/POS/Pemasok";
import StokBarang from "./pages/POS/StokBarang";
import PenjualanKasir from "./pages/POS/PenjualanKasir";
import PenjualanDetail from "./pages/POS/PenjualanDetail";
import KuitansiPembayaran from "./pages/POS/KuitansiPembayaran";
import NamaKasir from "./pages/POS/NamaKasir";
import RiwayatTransaksi from "./pages/POS/RiwayatTransaksi";
import Pembelian from "./pages/POS/Pembelian";
import LaporanJualBeli from "./pages/POS/LaporanJualBeli";
import LaporanRugiLaba from "./pages/POS/LaporanRugiLaba";

import UserManagement from "./pages/UserManagement/UserManagement";
import Pengaturan from "./pages/Pengaturan/Pengaturan";
import RolesManagement from "./pages/Pengaturan/RolesManagement";
import Laporan from "./pages/Laporan/Laporan";

function App() {
  // Initialize user management data when app loads
  useEffect(() => {
    initUserManagementData();
  }, []);
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="koperasi-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/anggota/login" element={<AnggotaLoginPage />} />
          
          {/* Anggota routes */}
          <Route path="/anggota" element={<AnggotaList />} />
          <Route path="/anggota/tambah" element={<AnggotaForm />} />
          <Route path="/anggota/:id" element={<AnggotaDetail />} />
          <Route path="/anggota/:id/edit" element={<AnggotaForm />} />
          <Route path="/anggota/:id/password" element={<AnggotaChangePassword />} />
          
          {/* Transaksi routes */}
          <Route path="/transaksi" element={<TransaksiList />} />
          <Route path="/transaksi/tambah" element={<TransaksiForm />} />
          <Route path="/transaksi/:id" element={<TransaksiDetail />} />
          
          {/* Simpan routes */}
          <Route path="/transaksi/simpan" element={<SimpanList />} />
          <Route path="/transaksi/simpan/tambah" element={<SimpanForm />} />
          <Route path="/transaksi/simpan/:id" element={<SimpanDetail />} />
          
          {/* Pinjam routes */}
          <Route path="/transaksi/pinjam" element={<PinjamList />} />
          <Route path="/transaksi/pinjam/tambah" element={<PinjamForm />} />
          <Route path="/transaksi/pinjam/:id" element={<PinjamDetail />} />
          
          {/* Angsuran routes */}
          <Route path="/transaksi/angsuran" element={<AngsuranList />} />
          <Route path="/transaksi/angsuran/tambah" element={<AngsuranForm />} />
          <Route path="/transaksi/angsuran/:id" element={<AngsuranDetail />} />
          
          {/* Pengajuan routes */}
          <Route path="/transaksi/pengajuan" element={<PengajuanList />} />
          <Route path="/transaksi/pengajuan/tambah" element={<PengajuanForm />} />
          <Route path="/transaksi/pengajuan/:id" element={<PengajuanDetail />} />
          
          {/* POS routes */}
          <Route path="/pos" element={<POSIndex />} />
          <Route path="/pos/inventori" element={<Inventori />} />
          <Route path="/pos/pemasok" element={<Pemasok />} />
          <Route path="/pos/stok" element={<StokBarang />} />
          <Route path="/pos/penjualan" element={<PenjualanKasir />} />
          <Route path="/pos/penjualan/:id" element={<PenjualanDetail />} />
          <Route path="/pos/kuitansi/:id" element={<KuitansiPembayaran />} />
          <Route path="/pos/kasir" element={<NamaKasir />} />
          <Route path="/pos/riwayat" element={<RiwayatTransaksi />} />
          <Route path="/pos/pembelian" element={<Pembelian />} />
          <Route path="/pos/laporan-jual-beli" element={<LaporanJualBeli />} />
          <Route path="/pos/laporan-rugi-laba" element={<LaporanRugiLaba />} />
          
          {/* Admin routes */}
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/users" element={<UserManagement />} /> {/* Route for sidebar menu compatibility */}
          <Route path="/pengaturan" element={<Pengaturan />} />
          <Route path="/pengaturan/roles" element={<RolesManagement />} /> {/* Add this route for Hak Akses */}
          
          {/* Laporan route */}
          <Route path="/laporan" element={<Laporan />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

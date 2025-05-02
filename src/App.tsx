
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/Auth/LoginPage";
import AnggotaLoginPage from "./pages/Auth/AnggotaLoginPage";
import AuthGuard from "./components/auth/AuthGuard";

// Anggota Pages
import AnggotaList from "./pages/Anggota/AnggotaList";
import AnggotaDetail from "./pages/Anggota/AnggotaDetail";
import AnggotaForm from "./pages/Anggota/AnggotaForm";
import AnggotaChangePassword from "./pages/Anggota/AnggotaChangePassword";

// Transaksi Pages
import TransaksiList from "./pages/Transaksi/TransaksiList";
import TransaksiDetail from "./pages/Transaksi/TransaksiDetail";
import TransaksiForm from "./pages/Transaksi/TransaksiForm";
import TransaksiCetak from "./pages/Transaksi/TransaksiCetak";

// Simpan Pages
import SimpanList from "./pages/Transaksi/Simpan/SimpanList";
import SimpanForm from "./pages/Transaksi/Simpan/SimpanForm";
import SimpanDetail from "./pages/Transaksi/Simpan/SimpanDetail";

// Pinjam Pages
import PinjamList from "./pages/Transaksi/Pinjam/PinjamList";
import PinjamForm from "./pages/Transaksi/Pinjam/PinjamForm";
import PinjamDetail from "./pages/Transaksi/Pinjam/PinjamDetail";

// Angsuran Pages
import AngsuranList from "./pages/Transaksi/Angsuran/AngsuranList";
import AngsuranForm from "./pages/Transaksi/Angsuran/AngsuranForm";
import AngsuranDetail from "./pages/Transaksi/Angsuran/AngsuranDetail";

// Pengajuan Pages
import PengajuanList from "./pages/Transaksi/Pengajuan/PengajuanList";
import PengajuanForm from "./pages/Transaksi/Pengajuan/PengajuanForm";
import PengajuanDetail from "./pages/Transaksi/Pengajuan/PengajuanDetail";

// POS Pages
import POSIndex from "./pages/POS/POSIndex";
import PenjualanKasir from "./pages/POS/PenjualanKasir";
import PenjualanList from "./pages/POS/PenjualanList";
import PenjualanDetail from "./pages/POS/PenjualanDetail";
import Pembelian from "./pages/POS/Pembelian";
import LaporanJualBeli from "./pages/POS/LaporanJualBeli";
import LaporanRugiLaba from "./pages/POS/LaporanRugiLaba";
import Inventori from "./pages/POS/Inventori";
import StokBarang from "./pages/POS/StokBarang";
import Pemasok from "./pages/POS/Pemasok";
import NamaKasir from "./pages/POS/NamaKasir";
import KuitansiPembayaran from "./pages/POS/KuitansiPembayaran";
import RiwayatTransaksi from "./pages/POS/RiwayatTransaksi";

// Laporan Pages
import Laporan from "./pages/Laporan/Laporan";

// User Management
import UserManagement from "./pages/UserManagement/UserManagement";

// Pengaturan
import Pengaturan from "./pages/Pengaturan/Pengaturan";
import RolesManagement from "./pages/Pengaturan/RolesManagement";

// Not Found
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/anggota-login" element={<AnggotaLoginPage />} />

        {/* Protected Routes */}
        <Route element={<AuthGuard />}>
          {/* Dashboard */}
          <Route path="/" element={<Index />} />

          {/* Anggota Routes */}
          <Route path="/anggota" element={<AnggotaList />} />
          <Route path="/anggota/:id" element={<AnggotaDetail />} />
          <Route path="/anggota/tambah" element={<AnggotaForm />} />
          <Route path="/anggota/:id/edit" element={<AnggotaForm />} />
          <Route path="/anggota/change-password" element={<AnggotaChangePassword />} />

          {/* Transaksi Routes */}
          <Route path="/transaksi" element={<TransaksiList />} />
          <Route path="/transaksi/:id" element={<TransaksiDetail />} />
          <Route path="/transaksi/:id/cetak" element={<TransaksiCetak />} />
          <Route path="/transaksi/tambah" element={<TransaksiForm />} />

          {/* Simpan Routes */}
          <Route path="/transaksi/simpan" element={<SimpanList />} />
          <Route path="/transaksi/simpan/tambah" element={<SimpanForm />} />
          <Route path="/transaksi/simpan/:id" element={<SimpanDetail />} />

          {/* Pinjam Routes */}
          <Route path="/transaksi/pinjam" element={<PinjamList />} />
          <Route path="/transaksi/pinjam/tambah" element={<PinjamForm />} />
          <Route path="/transaksi/pinjam/:id" element={<PinjamDetail />} />

          {/* Angsuran Routes */}
          <Route path="/transaksi/angsuran" element={<AngsuranList />} />
          <Route path="/transaksi/angsuran/tambah" element={<AngsuranForm />} />
          <Route path="/transaksi/angsuran/:id" element={<AngsuranDetail />} />

          {/* Pengajuan Routes */}
          <Route path="/transaksi/pengajuan" element={<PengajuanList />} />
          <Route path="/transaksi/pengajuan/tambah" element={<PengajuanForm />} />
          <Route path="/transaksi/pengajuan/:id" element={<PengajuanDetail />} />

          {/* POS Routes */}
          <Route path="/pos" element={<POSIndex />} />
          <Route path="/pos/penjualan" element={<PenjualanKasir />} />
          <Route path="/pos/penjualan-list" element={<PenjualanList />} />
          <Route path="/pos/penjualan/:id" element={<PenjualanDetail />} />
          <Route path="/pos/pembelian" element={<Pembelian />} />
          <Route path="/pos/laporan-jual-beli" element={<LaporanJualBeli />} />
          <Route path="/pos/laporan-rugi-laba" element={<LaporanRugiLaba />} />
          <Route path="/pos/inventori" element={<Inventori />} />
          <Route path="/pos/stok-barang" element={<StokBarang />} />
          <Route path="/pos/pemasok" element={<Pemasok />} />
          <Route path="/pos/kasir" element={<NamaKasir />} />
          <Route path="/pos/kuitansi/:id" element={<KuitansiPembayaran />} />
          <Route path="/pos/riwayat" element={<RiwayatTransaksi />} />

          {/* Laporan Routes */}
          <Route path="/laporan" element={<Laporan />} />

          {/* User Management Routes */}
          <Route path="/user-management" element={<UserManagement />} />

          {/* Pengaturan Routes */}
          <Route path="/pengaturan" element={<Pengaturan />} />
          <Route path="/pengaturan/roles" element={<RolesManagement />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/Auth/LoginPage";
import AnggotaLoginPage from "./pages/Auth/AnggotaLoginPage";
import { AuthGuard } from "./components/auth/AuthGuard";

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
        <Route path="/" element={<AuthGuard>{<Index />}</AuthGuard>} />

        {/* Anggota Routes */}
        <Route path="/anggota" element={<AuthGuard>{<AnggotaList />}</AuthGuard>} />
        <Route path="/anggota/:id" element={<AuthGuard>{<AnggotaDetail />}</AuthGuard>} />
        <Route path="/anggota/tambah" element={<AuthGuard>{<AnggotaForm />}</AuthGuard>} />
        <Route path="/anggota/:id/edit" element={<AuthGuard>{<AnggotaForm />}</AuthGuard>} />
        <Route path="/anggota/change-password" element={<AuthGuard>{<AnggotaChangePassword />}</AuthGuard>} />

        {/* Transaksi Routes */}
        <Route path="/transaksi" element={<AuthGuard>{<TransaksiList />}</AuthGuard>} />
        <Route path="/transaksi/:id" element={<AuthGuard>{<TransaksiDetail />}</AuthGuard>} />
        <Route path="/transaksi/:id/cetak" element={<AuthGuard>{<TransaksiCetak />}</AuthGuard>} />
        <Route path="/transaksi/tambah" element={<AuthGuard>{<TransaksiForm />}</AuthGuard>} />

        {/* Simpan Routes */}
        <Route path="/transaksi/simpan" element={<AuthGuard>{<SimpanList />}</AuthGuard>} />
        <Route path="/transaksi/simpan/tambah" element={<AuthGuard>{<SimpanForm />}</AuthGuard>} />
        <Route path="/transaksi/simpan/:id" element={<AuthGuard>{<SimpanDetail />}</AuthGuard>} />

        {/* Pinjam Routes */}
        <Route path="/transaksi/pinjam" element={<AuthGuard>{<PinjamList />}</AuthGuard>} />
        <Route path="/transaksi/pinjam/tambah" element={<AuthGuard>{<PinjamForm />}</AuthGuard>} />
        <Route path="/transaksi/pinjam/:id" element={<AuthGuard>{<PinjamDetail />}</AuthGuard>} />

        {/* Angsuran Routes */}
        <Route path="/transaksi/angsuran" element={<AuthGuard>{<AngsuranList />}</AuthGuard>} />
        <Route path="/transaksi/angsuran/tambah" element={<AuthGuard>{<AngsuranForm />}</AuthGuard>} />
        <Route path="/transaksi/angsuran/:id" element={<AuthGuard>{<AngsuranDetail />}</AuthGuard>} />

        {/* Pengajuan Routes */}
        <Route path="/transaksi/pengajuan" element={<AuthGuard>{<PengajuanList />}</AuthGuard>} />
        <Route path="/transaksi/pengajuan/tambah" element={<AuthGuard>{<PengajuanForm />}</AuthGuard>} />
        <Route path="/transaksi/pengajuan/:id" element={<AuthGuard>{<PengajuanDetail />}</AuthGuard>} />

        {/* POS Routes */}
        <Route path="/pos" element={<AuthGuard>{<POSIndex />}</AuthGuard>} />
        <Route path="/pos/penjualan" element={<AuthGuard>{<PenjualanKasir />}</AuthGuard>} />
        <Route path="/pos/penjualan-list" element={<AuthGuard>{<PenjualanList />}</AuthGuard>} />
        <Route path="/pos/penjualan/:id" element={<AuthGuard>{<PenjualanDetail />}</AuthGuard>} />
        <Route path="/pos/pembelian" element={<AuthGuard>{<Pembelian />}</AuthGuard>} />
        <Route path="/pos/laporan-jual-beli" element={<AuthGuard>{<LaporanJualBeli />}</AuthGuard>} />
        <Route path="/pos/laporan-rugi-laba" element={<AuthGuard>{<LaporanRugiLaba />}</AuthGuard>} />
        <Route path="/pos/inventori" element={<AuthGuard>{<Inventori />}</AuthGuard>} />
        <Route path="/pos/stok-barang" element={<AuthGuard>{<StokBarang />}</AuthGuard>} />
        <Route path="/pos/pemasok" element={<AuthGuard>{<Pemasok />}</AuthGuard>} />
        <Route path="/pos/kasir" element={<AuthGuard>{<NamaKasir />}</AuthGuard>} />
        <Route path="/pos/kuitansi/:id" element={<AuthGuard>{<KuitansiPembayaran />}</AuthGuard>} />
        <Route path="/pos/riwayat" element={<AuthGuard>{<RiwayatTransaksi />}</AuthGuard>} />

        {/* Laporan Routes */}
        <Route path="/laporan" element={<AuthGuard>{<Laporan />}</AuthGuard>} />

        {/* User Management Routes */}
        <Route path="/user-management" element={<AuthGuard>{<UserManagement />}</AuthGuard>} />

        {/* Pengaturan Routes */}
        <Route path="/pengaturan" element={<AuthGuard>{<Pengaturan />}</AuthGuard>} />
        <Route path="/pengaturan/roles" element={<AuthGuard>{<RolesManagement />}</AuthGuard>} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

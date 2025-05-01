import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { 
  PiggyBank,
  Users,
  FileText, 
  Settings, 
  Home,
  LogOut, 
  ShoppingCart, 
  Package,
  Archive, 
  User, 
  History, 
  Receipt, 
  BarChart, 
  LineChart, 
  Store, 
  ShoppingBag, 
  Shield, 
  Database,
  CreditCard, 
  Cog, 
  ChevronDown,
  UserCheck,
  Truck
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type MenuItemType = {
  title: string;
  path: string;
  icon: React.ElementType;
  subItems?: { title: string; path: string; icon: React.ElementType }[];
};

type MenuSectionType = {
  title: string;
  icon: React.ElementType;
  items: MenuItemType[];
};

export function SidebarNav() {
  const location = useLocation();

  // Define menu structure
  const menuSections: MenuSectionType[] = [
    {
      title: "Koperasi",
      icon: PiggyBank,
      items: [
        { title: "Data Anggota", path: "/anggota", icon: Users },
        { 
          title: "Transaksi", 
          path: "/transaksi", 
          icon: CreditCard, 
          subItems: [
            { title: "Pengajuan", path: "/transaksi/pengajuan", icon: FileText },
            { title: "Simpan", path: "/transaksi/simpan", icon: FileText },
            { title: "Pinjam", path: "/transaksi/pinjam", icon: FileText },
            { title: "Angsuran", path: "/transaksi/angsuran", icon: FileText }
          ] 
        },
        { title: "Laporan", path: "/laporan", icon: FileText }
      ]
    },
    {
      title: "KPRI Mart",
      icon: Store,
      items: [
        { title: "Pemasok", path: "/pos/pemasok", icon: Truck },
        { title: "Pembelian", path: "/pos/pembelian", icon: ShoppingCart },
        { title: "Penjualan (PoS)", path: "/pos/penjualan", icon: ShoppingBag },
        { title: "Stok Barang", path: "/pos/stok", icon: Package },
        { title: "Inventori", path: "/pos/inventori", icon: Archive },
        { title: "Nama Kasir", path: "/pos/kasir", icon: User },
        { title: "Riwayat Transaksi", path: "/pos/riwayat", icon: History },
        { title: "Kuitansi / Struk", path: "/pos/kuitansi", icon: Receipt },
        { 
          title: "Laporan", 
          path: "/pos/laporan-jual-beli", 
          icon: BarChart, 
          subItems: [
            { title: "Jual Beli", path: "/pos/laporan-jual-beli", icon: BarChart },
            { title: "Rugi Laba", path: "/pos/laporan-rugi-laba", icon: LineChart }
          ]
        }
      ]
    },
    {
      title: "Pengaturan",
      icon: Settings,
      items: [
        { title: "User Management", path: "/pengaturan/users", icon: UserCheck },
        { title: "Hak Akses", path: "/pengaturan/roles", icon: Shield },
        { 
          title: "Koperasi", 
          path: "/pengaturan/koperasi", 
          icon: Cog, 
          subItems: [
            { title: "Tenor", path: "/pengaturan/tenor", icon: Cog },
            { title: "Denda", path: "/pengaturan/denda", icon: Cog },
            { title: "Suku Bunga", path: "/pengaturan/bunga", icon: Cog }
          ]
        },
        { title: "Backup Data", path: "/pengaturan/backup", icon: Database }
      ]
    }
  ];

  // Check if a path is active or one of its subpaths is active
  const isPathActive = (path: string, subItems?: { path: string }[]): boolean => {
    const isMainPathActive = location.pathname === path;
    const isSubPathActive = subItems?.some(item => location.pathname === item.path) || false;
    
    return isMainPathActive || isSubPathActive;
  };
  
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <PiggyBank className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold">Koperasiku</h1>
          <SidebarTrigger className="ml-auto h-7 w-7" />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {menuSections.map((section, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>
              <section.icon className="mr-2" />
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item, itemIndex) => (
                  <SidebarMenuItem key={itemIndex}>
                    {item.subItems ? (
                      <>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={isPathActive(item.path, item.subItems)}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto h-4 w-4" />
                        </SidebarMenuButton>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem, subIndex) => (
                            <SidebarMenuSubItem key={subIndex}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={location.pathname === subItem.path}
                              >
                                <Link to={subItem.path}>
                                  <subItem.icon />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={location.pathname === item.path}
                      >
                        <Link to={item.path}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-2">
          <SidebarMenuButton 
            variant="outline"
            tooltip="Keluar"
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

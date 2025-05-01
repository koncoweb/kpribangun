
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, PiggyBank, FileText, Settings, Home, 
  ChevronRight, LogOut, ShoppingCart, Package, 
  Archive, User, History, Receipt, BarChart, 
  LineChart, Store, ShoppingBag, Shield, Database,
  CreditCard, Cog, UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

type MenuSection = {
  title: string;
  icon: React.ElementType;
  items: MenuItem[];
  defaultOpen?: boolean;
};

type MenuItem = {
  title: string;
  path: string;
  icon: React.ElementType;
  subItems?: { title: string; path: string; icon: React.ElementType }[];
};

export default function SidebarMenu() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "koperasi": true,
    "kprimart": false,
    "pengaturan": false
  });
  const location = useLocation();

  // Define menu structure
  const menuSections: MenuSection[] = [
    {
      title: "Koperasi",
      icon: Home,
      defaultOpen: true,
      items: [
        { title: "Data Anggota", path: "/anggota", icon: Users },
        { title: "Transaksi", path: "/transaksi", icon: CreditCard, 
          subItems: [
            { title: "Pengajuan", path: "/transaksi/pengajuan", icon: CreditCard },
            { title: "Simpan", path: "/transaksi/simpan", icon: CreditCard },
            { title: "Pinjam", path: "/transaksi/pinjam", icon: CreditCard },
            { title: "Angsuran", path: "/transaksi/angsuran", icon: CreditCard }
          ] 
        },
        { title: "Laporan", path: "/laporan", icon: FileText }
      ]
    },
    {
      title: "KPRI Mart",
      icon: Store,
      items: [
        { title: "Pembelian", path: "/pos/pembelian", icon: ShoppingCart },
        { title: "Penjualan (PoS)", path: "/pos/penjualan", icon: ShoppingBag },
        { title: "Stok Barang", path: "/pos/stok", icon: Package },
        { title: "Inventori", path: "/pos/inventori", icon: Archive },
        { title: "Nama Kasir", path: "/pos/kasir", icon: User },
        { title: "Riwayat Transaksi", path: "/pos/riwayat", icon: History },
        { title: "Kuitansi / Struk", path: "/pos/kuitansi", icon: Receipt },
        { title: "Laporan", path: "/pos/laporan-jual-beli", icon: BarChart, 
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
        { title: "Koperasi", path: "/pengaturan/koperasi", icon: Cog, 
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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Check if a menu item or any of its subitems is active
  const isMenuItemActive = (item: MenuItem): boolean => {
    if (location.pathname === item.path) {
      return true;
    }
    if (item.subItems) {
      return item.subItems.some(subItem => location.pathname === subItem.path);
    }
    return false;
  };

  return (
    <div className={cn(
      "bg-sidebar flex flex-col border-r border-sidebar-border h-screen sticky top-0 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <PiggyBank className="h-6 w-6 text-koperasi-green" />
            <h1 className="text-lg font-bold text-sidebar-foreground">Koperasiku</h1>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronRight className="rotate-180" size={18} />}
        </Button>
      </div>
      
      <div className="flex-1 py-2 flex flex-col gap-1 overflow-y-auto">
        {menuSections.map((section, index) => (
          <div key={index} className="px-2 py-1">
            {!isCollapsed ? (
              <Collapsible 
                open={expandedSections[section.title.toLowerCase().replace(/\s/g, '')]} 
                onOpenChange={() => toggleSection(section.title.toLowerCase().replace(/\s/g, ''))}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-2 py-1 h-9 text-sm font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <section.icon className="h-4 w-4" />
                      <span>{section.title}</span>
                    </div>
                    <ChevronRight 
                      className={cn("h-4 w-4 transition-transform", 
                        expandedSections[section.title.toLowerCase().replace(/\s/g, '')] && "rotate-90"
                      )} 
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-2">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="mb-1">
                      {item.subItems ? (
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-between px-2 py-1 h-8 text-sm",
                                isMenuItemActive(item) && "bg-sidebar-accent text-sidebar-accent-foreground"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                              </div>
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-6 mt-1">
                            {item.subItems.map((subItem, subIndex) => (
                              <Link key={subIndex} to={subItem.path}>
                                <Button
                                  variant="ghost"
                                  className={cn(
                                    "w-full justify-start px-2 py-1 h-7 text-xs mb-1",
                                    location.pathname === subItem.path && "bg-sidebar-accent text-sidebar-accent-foreground"
                                  )}
                                >
                                  <subItem.icon className="h-3 w-3 mr-2" />
                                  <span>{subItem.title}</span>
                                </Button>
                              </Link>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <Link to={item.path}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start px-2 py-1 h-8 text-sm",
                              location.pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground"
                            )}
                          >
                            <item.icon className="h-4 w-4 mr-2" />
                            <span>{item.title}</span>
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <div className="flex flex-col items-center gap-1 mb-2">
                <Button
                  variant="ghost"
                  className="w-full h-9 p-0 flex justify-center"
                  title={section.title}
                >
                  <section.icon className="h-4 w-4" />
                </Button>
                <div className="w-full h-px bg-sidebar-border my-1"></div>
                {section.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    to={item.path}
                    className="w-full flex justify-center"
                    title={item.title}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        location.pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground justify-start gap-2",
            isCollapsed && "justify-center p-2"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="text-sm">Keluar</span>}
        </Button>
      </div>
    </div>
  );
}

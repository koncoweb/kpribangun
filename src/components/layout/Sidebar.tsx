
import { 
  Users, PiggyBank, FileText, Settings, Home, 
  ChevronLeft, ChevronRight, LogOut, ShoppingCart,
  Package, Archive, User, History, Receipt,
  BarChart, LineChart
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
  subItems?: { path: string; label: string; icon: React.ElementType }[];
};

const NavItem = ({ to, icon: Icon, label, isCollapsed, isActive, subItems }: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Check if any subitems are active
  const hasActiveSubItem = subItems?.some(item => location.pathname === item.path);
  const shouldShowActive = isActive || hasActiveSubItem;
  
  // Toggle submenu
  const toggleSubmenu = (e: React.MouseEvent) => {
    if (subItems && subItems.length > 0) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="w-full">
      <Link
        to={to}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-all w-full",
          shouldShowActive 
            ? "bg-sidebar-accent text-sidebar-accent-foreground" 
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        onClick={toggleSubmenu}
      >
        <Icon className="h-5 w-5" />
        {!isCollapsed && (
          <>
            <span className="text-sm font-medium flex-1">{label}</span>
            {subItems && subItems.length > 0 && (
              <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "transform rotate-90")} />
            )}
          </>
        )}
      </Link>
      
      {/* Sub-menu items */}
      {!isCollapsed && isOpen && subItems && subItems.length > 0 && (
        <div className="pl-8 mt-1 space-y-1">
          {subItems.map((subItem) => {
            const SubIcon = subItem.icon;
            const isSubActive = location.pathname === subItem.path;
            
            return (
              <Link
                key={subItem.path}
                to={subItem.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all",
                  isSubActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <SubIcon className="h-4 w-4" />
                <span>{subItem.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/anggota", label: "Data Anggota", icon: Users },
    { path: "/transaksi", label: "Transaksi", icon: PiggyBank },
    { 
      path: "/pos", 
      label: "Point of Sales", 
      icon: ShoppingCart,
      subItems: [
        { path: "/pos/stok", label: "Stok Barang", icon: Package },
        { path: "/pos/inventori", label: "Inventori", icon: Archive },
        { path: "/pos/kasir", label: "Nama Kasir", icon: User },
        { path: "/pos/riwayat", label: "Riwayat Transaksi", icon: History },
        { path: "/pos/kuitansi", label: "Kuitansi Pembayaran", icon: Receipt },
        { path: "/pos/laporan-jual-beli", label: "Laporan Jual Beli", icon: BarChart },
        { path: "/pos/laporan-rugi-laba", label: "Laporan Rugi Laba", icon: LineChart },
      ]
    },
    { path: "/laporan", label: "Laporan", icon: FileText },
    { path: "/pengaturan", label: "Pengaturan", icon: Settings },
  ];

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
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <div className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto">
        {navigation.map((item) => (
          <NavItem
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
            isCollapsed={isCollapsed}
            isActive={location.pathname === item.path}
            subItems={item.subItems}
          />
        ))}
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground justify-start gap-3",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Keluar</span>}
        </Button>
      </div>
    </div>
  );
}

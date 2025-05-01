
import { useLocation } from "react-router-dom";
import { LogOut, PiggyBank } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { menuSections } from "./sidebar/menuData";
import { SidebarMenuSection } from "./sidebar/SidebarMenuSection";

export function SidebarNav() {
  const location = useLocation();

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
          <SidebarMenuSection 
            key={index} 
            section={section} 
            locationPath={location.pathname}
          />
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

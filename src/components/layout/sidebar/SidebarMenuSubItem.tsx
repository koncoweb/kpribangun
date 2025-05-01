
import React from "react";
import { Link } from "react-router-dom";
import { 
  SidebarMenuSubItem as ShadcnSidebarMenuSubItem, 
  SidebarMenuSubButton 
} from "@/components/ui/sidebar";

type SidebarMenuSubItemProps = {
  path: string;
  icon: React.ElementType;
  title: string;
  isActive: boolean;
};

export function SidebarMenuSubItem({ path, icon: Icon, title, isActive }: SidebarMenuSubItemProps) {
  return (
    <ShadcnSidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={isActive}>
        <Link to={path}>
          <Icon />
          <span>{title}</span>
        </Link>
      </SidebarMenuSubButton>
    </ShadcnSidebarMenuSubItem>
  );
}

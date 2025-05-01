
import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  SidebarMenuItem as ShadcnSidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub
} from "@/components/ui/sidebar";
import { SidebarMenuSubItem } from "./SidebarMenuSubItem";
import { MenuItemType } from "./menuData";

type SidebarMenuItemProps = {
  item: MenuItemType;
  isActive: boolean;
  locationPath: string;
};

export function SidebarMenuItem({ item, isActive, locationPath }: SidebarMenuItemProps) {
  const hasSubItems = !!item.subItems && item.subItems.length > 0;

  if (hasSubItems) {
    return (
      <ShadcnSidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          isActive={isActive}
        >
          <item.icon />
          <span>{item.title}</span>
          <ChevronDown className="ml-auto h-4 w-4" />
        </SidebarMenuButton>
        <SidebarMenuSub>
          {item.subItems?.map((subItem, subIndex) => (
            <SidebarMenuSubItem
              key={subIndex}
              path={subItem.path}
              icon={subItem.icon}
              title={subItem.title}
              isActive={locationPath === subItem.path}
            />
          ))}
        </SidebarMenuSub>
      </ShadcnSidebarMenuItem>
    );
  }

  return (
    <ShadcnSidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        isActive={locationPath === item.path}
      >
        <Link to={item.path}>
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </ShadcnSidebarMenuItem>
  );
}

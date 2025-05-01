
import React from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu
} from "@/components/ui/sidebar";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { MenuSectionType } from "./menuData";

type SidebarMenuSectionProps = {
  section: MenuSectionType;
  locationPath: string;
};

export function SidebarMenuSection({ section, locationPath }: SidebarMenuSectionProps) {
  // Check if a path is active or one of its subpaths is active
  const isPathActive = (path: string, subItems?: { path: string }[]): boolean => {
    const isMainPathActive = locationPath === path;
    const isSubPathActive = subItems?.some(item => locationPath === item.path) || false;
    
    return isMainPathActive || isSubPathActive;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <section.icon className="mr-2" />
        {section.title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {section.items.map((item, itemIndex) => (
            <SidebarMenuItem
              key={itemIndex}
              item={item}
              isActive={isPathActive(item.path, item.subItems)}
              locationPath={locationPath}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

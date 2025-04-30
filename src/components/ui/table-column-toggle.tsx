
import React from "react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EyeOff } from "lucide-react";

interface Column {
  id: string;
  label: string;
  isVisible: boolean;
}

interface TableColumnToggleProps {
  columns: Column[];
  onToggleColumn: (columnId: string) => void;
}

export function TableColumnToggle({ columns, onToggleColumn }: TableColumnToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto flex gap-1 h-8">
          <EyeOff className="h-4 w-4" />
          <span className="hidden sm:inline">Kolom</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.isVisible}
            onCheckedChange={() => onToggleColumn(column.id)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

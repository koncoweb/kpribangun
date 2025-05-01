
import React from "react";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CartHeaderProps {
  itemCount: number;
  onClear: () => void;
}

export function CartHeader({ itemCount, onClear }: CartHeaderProps) {
  return (
    <div className="p-4 border-b flex justify-between items-center">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-5 w-5" />
        <h2 className="text-lg font-medium">Keranjang</h2>
        {itemCount > 0 && (
          <Badge variant="secondary">
            {itemCount}
          </Badge>
        )}
      </div>
      
      {itemCount > 0 && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClear}
        >
          Kosongkan
        </Button>
      )}
    </div>
  );
}

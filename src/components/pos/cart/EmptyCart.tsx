
import React from "react";
import { ShoppingCart } from "lucide-react";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
      <p className="text-gray-500">Keranjang belanja kosong</p>
    </div>
  );
}


import { ProdukItem } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ProdukItem[];
  onAddToCart: (product: ProdukItem) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="p-6 bg-gray-50 rounded-lg">
          <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto" />
          <p className="text-gray-500 mt-2">Tidak ada produk yang ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
      {products.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

// Add missing import
import { ShoppingCart } from "lucide-react";

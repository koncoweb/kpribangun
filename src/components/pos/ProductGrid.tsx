
import { ProdukItem } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ProdukItem[];
  onAddToCart: (product: ProdukItem) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Tidak ada produk yang ditemukan</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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

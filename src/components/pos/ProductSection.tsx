
import { ProdukItem } from "@/types";
import { ProductSearch } from "./ProductSearch";
import { ProductGrid } from "./ProductGrid";
import { useState, useEffect } from "react";

interface ProductSectionProps {
  products: ProdukItem[];
  onAddToCart: (product: ProdukItem) => void;
}

export function ProductSection({ products, onAddToCart }: ProductSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  
  // Extract unique categories
  useEffect(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.kategori)));
    setCategories(uniqueCategories);
  }, [products]);
  
  // Filtered products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.kode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.kategori === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <ProductSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={categories}
      />
      
      <div className="p-4">
        <ProductGrid 
          products={filteredProducts} 
          onAddToCart={onAddToCart} 
        />
      </div>
    </div>
  );
}

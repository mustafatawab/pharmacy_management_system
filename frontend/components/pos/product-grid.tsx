import { ProductCard } from "./product-card";
import { Medicine } from "@/lib/types";

interface ProductGridProps {
  products: Medicine[];
  onAddToCart: (product: Medicine) => void;
  selectedIndex?: number;
}

export function ProductGrid({ products, onAddToCart, selectedIndex = -1 }: ProductGridProps) {
  return (
    <div className="bg-card p-4 rounded-2xl border border-border flex-1 overflow-hidden flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          Available Inventory ({products.length})
        </h3>
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
          <span className="flex items-center gap-1"><kbd className="px-1 border border-border rounded">↑↓</kbd> Select</span>
          <span className="flex items-center gap-1"><kbd className="px-1 border border-border rounded">↵</kbd> Add</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {products.map((product, idx) => (
            <ProductCard
              key={product.id}
              index={idx}
              product={product}
              onAddToCart={onAddToCart}
              isSelected={idx === selectedIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import { ProductCard } from "./product-card";
import { Medicine } from "@/lib/types";

interface ProductGridProps {
 products: Medicine[];
 onAddToCart: (product: Medicine) => void;
 selectedIndex?: number;
}

export function ProductGrid({ products, onAddToCart, selectedIndex = -1 }: ProductGridProps) {
 return (
 <div className="bg-card p-4 rounded-2xl flex-1 overflow-hidden flex flex-col shadow-sm">
 <div className="flex items-center justify-between mb-4 px-1">
 <h3 className="h3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
 Inventory ({products.length})
 </h3>
 <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
 <span className="flex items-center gap-1"><kbd className="px-1 border border-border rounded bg-neutral-100 dark:bg-neutral-800">↑↓</kbd> Navigate</span>
 <span className="flex items-center gap-1"><kbd className="px-1 border border-border rounded bg-neutral-100 dark:bg-neutral-800">↵</kbd> Add</span>
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

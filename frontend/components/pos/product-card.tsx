import { Medicine } from "@/lib/types";
import { motion } from "framer-motion";
import { Plus, Package, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Medicine;
  onAddToCart: (product: Medicine) => void;
  index?: number;
  isSelected?: boolean;
}

export function ProductCard({ product, onAddToCart, index = 0, isSelected = false }: ProductCardProps) {
  const isOutOfStock = product.quantity <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        borderColor: isSelected ? "var(--color-primary)" : "var(--border)",
        backgroundColor: isSelected ? "var(--color-zinc-50)" : "var(--card)"
      }}
      transition={{ duration: 0.1 }}
      className={`group relative border rounded-xl p-3 transition-all duration-100 flex flex-col h-full ${
        isSelected ? "shadow-md ring-2 ring-primary/20 z-10" : "shadow-sm"
      } ${isOutOfStock ? "opacity-60" : "cursor-pointer"}`}
      onClick={() => !isOutOfStock && onAddToCart(product)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-0.5">
          <h4
            className={`font-bold text-sm leading-tight transition-colors ${isSelected ? "text-primary" : "text-foreground"}`}
            title={product.name}
          >
            {product.name}
          </h4>
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            {product.category?.name || "General"}
          </span>
        </div>
        <div className={`px-1.5 py-0.5 rounded-md ${isSelected ? "bg-primary text-white" : "bg-primary/5 text-primary"}`}>
          <span className="font-extrabold text-xs">
            ${parseFloat(product.selling_price).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Package className="h-3 w-3" />
          <span className={`text-[10px] font-bold ${isOutOfStock ? "text-danger" : "text-zinc-500"}`}>
            {isOutOfStock ? "Out" : `${product.quantity} ${product.unit}`}
          </span>
        </div>
        
        {isSelected && (
          <div className="flex items-center gap-1 text-[9px] font-bold text-primary animate-pulse">
            <kbd className="px-1 border border-primary/20 rounded bg-primary/5">↵</kbd>
            <span>ADD</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}


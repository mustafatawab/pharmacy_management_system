import { Medicine } from "@/lib/types";
import { motion } from "framer-motion";
import { Plus, Package, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Medicine;
  onAddToCart: (product: Medicine) => void;
  index?: number;
}

export function ProductCard({ product, onAddToCart, index = 0 }: ProductCardProps) {
  const isOutOfStock = product.quantity <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group relative border border-border rounded-2xl p-4 bg-card hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-premium flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-1">
          <h4
            className="font-extrabold text-foreground leading-tight group-hover:text-primary transition-colors"
            title={product.name}
          >
            {product.name}
          </h4>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {product.category?.name || "Uncategorized"}
            </span>
          </div>
        </div>
        <div className="bg-primary/5 px-2 py-1 rounded-lg">
          <span className="text-primary font-extrabold text-sm">
            ${parseFloat(product.selling_price).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
          {product.unit}
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Package className="h-3.5 w-3.5" />
          <span className={`text-xs font-bold ${isOutOfStock ? "text-danger" : "text-gray-500"}`}>
            {isOutOfStock ? "Sold Out" : `${product.quantity} left`}
          </span>
        </div>
        
        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary-hover shadow-primary/20 hover:shadow-lg active:scale-95"
          }`}
        >
          {isOutOfStock ? (
            "Wait"
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              Add
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}


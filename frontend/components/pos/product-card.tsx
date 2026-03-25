import { Medicine } from "@/lib/types";

interface ProductCardProps {
  product: Medicine;
  onAddToCart: (product: Medicine) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="border border-gray-200 dark:border-[#212121] rounded-lg p-4 bg-white dark:bg-[#212121] flex flex-col h-full hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4
            className="font-bold text-gray-900 dark:text-gray-100 line-clamp-1"
            title={product.name}
          >
            {product.name}
          </h4>
          <p className="text-xs text-gray-500">{product.category?.name || "No Category"}</p>
        </div>
        <span className="text-green-600 font-bold whitespace-nowrap">
          ${parseFloat(product.selling_price).toFixed(2)}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-4">Unit: {product.unit}</p>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-xs text-gray-500">Stock: {product.quantity}</span>
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.quantity <= 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
        >
          {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}


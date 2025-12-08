interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  sku: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
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
          <p className="text-xs text-gray-500">{product.category}</p>
        </div>
        <span className="text-green-600 font-bold whitespace-nowrap">
          ${product.price.toFixed(2)}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-4">SKU: {product.sku}</p>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-xs text-gray-500">Stock: {product.stock}</span>
        <button
          onClick={() => onAddToCart(product)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

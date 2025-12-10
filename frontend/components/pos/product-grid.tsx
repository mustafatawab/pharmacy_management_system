import { ProductCard } from "./product-card";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  sku: string;
  stock: number;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="bg-white dark:bg-[#2F2F2F] p-6 rounded-xl border border-gray-200 dark:border-[#2F2F2F] flex-1 overflow-y-auto">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Available Products
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

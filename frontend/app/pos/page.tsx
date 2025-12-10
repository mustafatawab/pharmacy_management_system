"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ProductGrid } from "@/components/pos/product-grid";
import { POSCart } from "@/components/pos/pos-cart";
import { mockProducts } from "@/data/pos-products";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  sku: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

export default function POSPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.includes(searchQuery);
    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(mockProducts.map((p) => p.category))];

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Left Column: Products (Flexible width) */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Header / Search */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Point of Sale System
          </h2>
          <span className="text-sm text-blue-600 font-medium bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
            Currency: USD (United States Dollar)
          </span>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-[#2F2F2F] p-4 rounded-xl border border-gray-200 dark:border-[#2F2F2F] flex gap-4 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-[#212121] rounded-lg text-sm bg-white dark:bg-[#212121] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-gray-400"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-200 dark:border-[#212121] rounded-lg px-4 py-2 text-sm bg-white dark:bg-[#212121] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[150px]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={filteredProducts}
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* Right Column: Cart (Fixed width) */}
      <POSCart
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />
    </div>
  );
}

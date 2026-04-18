"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Loader2, DollarSign, Package, ShoppingCart, ArrowRight, X } from "lucide-react";
import { ProductGrid } from "@/components/pos/product-grid";
import { POSCart } from "@/components/pos/pos-cart";
import { useMedicines } from "@/hooks/useMedicine";
import { useCategories } from "@/hooks/useCategory";
import { useCreateSale, SaleCreate } from "@/hooks/useSale";
import { Medicine, Category } from "@/lib/types";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export interface CartItem extends Medicine {
  cartQuantity: number;
}

export default function POSPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: medicinesData, isLoading: medicinesLoading } = useMedicines({
    search: searchQuery,
    page_size: 100,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const createSale = useCreateSale();

  const filteredProducts = useMemo(() => {
    if (!medicinesData?.items) return [];
    return medicinesData.items.filter((product: Medicine) => {
      const matchesCategory =
        categoryFilter === "All" || 
        product.category?.name === categoryFilter ||
        String(product.category_id) === categoryFilter;
      return matchesCategory;
    });
  }, [medicinesData, categoryFilter]);

  // Keyboard Navigation Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search with '/'
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Navigate products
      if (document.activeElement === searchInputRef.current || document.activeElement === document.body) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredProducts.length - 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && filteredProducts[selectedIndex]) {
          e.preventDefault();
          handleAddToCart(filteredProducts[selectedIndex]);
        }
      }

      // Quick Pay with F12
      if (e.key === "F12") {
        e.preventDefault();
        handleCheckout();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredProducts, selectedIndex]);

  // Reset selected index on search
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, categoryFilter]);

  const handleAddToCart = (product: Medicine) => {
    if (product.quantity <= 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, cartQuantity: 1 }];
    });
    toast.success(`Added ${product.name}`, { duration: 1000, position: 'bottom-center' });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, cartQuantity: Math.max(1, item.cartQuantity + delta) }
          : item
      )
    );
  };

  const handleClearCart = () => setCartItems([]);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.selling_price) * item.cartQuantity,
      0
    );
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const saleData: SaleCreate = {
      total_amount: subtotal,
      discount: 0,
      final_amount: total,
      payment_method: "cash",
      items: cartItems.map((item) => ({
        medicine_id: item.id,
        quantity: item.cartQuantity,
        unit_price: parseFloat(item.selling_price),
      })),
    };

    try {
      await createSale.mutateAsync(saleData);
      toast.success("Transaction Complete", { icon: '💰' });
      handleClearCart();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Checkout Failed");
    }
  };

  const categories = useMemo(() => {
    const baseCategories = ["All"];
    if (categoriesData) return [...baseCategories, ...categoriesData.map((c: Category) => c.name)];
    return baseCategories;
  }, [categoriesData]);

  const isLoading = medicinesLoading || categoriesLoading;

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] gap-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Point of Sale</h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Terminal Active · USD</p>
          </div>
        </div>

        <div className="flex-1 w-full max-w-2xl flex gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search ( Press '/' to focus )"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-border bg-zinc-50/50 focus:bg-white focus:outline-none text-sm font-bold text-zinc-600 appearance-none min-w-[140px] cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Products Section */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center bg-card rounded-2xl border border-border">
              <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
            </div>
          ) : (
            <ProductGrid
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              selectedIndex={selectedIndex}
            />
          )}
        </div>

        {/* Dynamic Cart Column */}
        <div className="w-[380px] shrink-0 flex flex-col">
          <POSCart
            cartItems={cartItems}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
            isProcessing={createSale.isPending}
          />
          
          {/* Quick Shortcuts Footer */}
          <div className="mt-3 p-3 bg-zinc-950 rounded-xl text-[9px] font-bold text-zinc-500 uppercase tracking-[0.1em] flex justify-between items-center border border-white/5">
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5"><kbd className="px-1 border border-zinc-800 rounded bg-zinc-900">F12</kbd> Pay</span>
              <span className="flex items-center gap-1.5"><kbd className="px-1 border border-zinc-800 rounded bg-zinc-900">/</kbd> Search</span>
            </div>
            <div className="text-zinc-600">Secure Session · v1.0</div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Trash2, ShoppingCart, Plus, Minus, Package, X, Loader2, ArrowRight } from "lucide-react";
import { Medicine } from "@/lib/types";

interface CartItem extends Medicine {
  cartQuantity: number;
}

interface POSCartProps {
  cartItems: CartItem[];
  onRemoveFromCart: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  isProcessing?: boolean;
}

export function POSCart({
  cartItems,
  onRemoveFromCart,
  onUpdateQuantity,
  onClearCart,
  onCheckout,
  isProcessing = false,
}: POSCartProps) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.selling_price) * item.cartQuantity,
    0
  );
  const tax = subtotal * 0.1; // Assuming 10% tax for demo
  const total = subtotal + tax;

  return (
    <div className="w-full flex flex-col bg-card rounded-2xl overflow-hidden h-full shadow-sm">
      <div className="p-4 border-b border-zinc-50 dark:border-zinc-900 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-zinc-400" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">
            Shopping Cart
          </h3>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-[10px] font-bold text-zinc-400 hover:text-danger uppercase tracking-tighter transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 px-6">
            <div className="mb-4 bg-zinc-100 dark:bg-zinc-900 p-4 rounded-2xl">
              <Package className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
            </div>
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-tight">
              Cart is Empty
            </p>
            <p className="text-[10px] font-medium opacity-60 mt-1">Add items to start transaction</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-50/50 dark:bg-zinc-900/50 p-3 rounded-xl flex flex-col gap-2 group transition-all hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-xs text-foreground line-clamp-2 leading-tight">
                  {item.name}
                </h4>
                <button
                  onClick={() => onRemoveFromCart(item.id)}
                  className="text-zinc-400 hover:text-danger opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs font-extrabold text-primary">
                  ${(parseFloat(item.selling_price) * item.cartQuantity).toFixed(2)}
                </span>
                <div className="flex items-center gap-1 bg-white dark:bg-zinc-950 rounded-lg p-0.5 shadow-sm border border-zinc-100 dark:border-zinc-800">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-all disabled:opacity-20"
                    disabled={item.cartQuantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-[10px] font-bold w-5 text-center text-foreground">
                    {item.cartQuantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-all"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Totals */}
      {cartItems.length > 0 && (
        <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900">
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-foreground pt-2 mt-2 border-t border-zinc-100 dark:border-zinc-800 tracking-tight">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={onCheckout}
            disabled={isProcessing}
            className="w-full bg-primary hover:bg-primary-hover disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ArrowRight className="h-4 w-4" />
                Complete Payment
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

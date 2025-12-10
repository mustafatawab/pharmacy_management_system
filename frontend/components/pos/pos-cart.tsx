import { Trash2, ShoppingCart, Plus, Minus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface POSCartProps {
  cartItems: CartItem[];
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
}

export function POSCart({
  cartItems,
  onRemoveFromCart,
  onUpdateQuantity,
  onClearCart,
}: POSCartProps) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // Assuming 10% tax for demo
  const total = subtotal + tax;

  return (
    <div className="w-96 flex flex-col bg-white dark:bg-[#2F2F2F] border border-gray-200 dark:border-[#2F2F2F] rounded-xl overflow-hidden h-full">
      <div className="p-4 border-b border-gray-200 dark:border-[#212121] flex justify-between items-center bg-white dark:bg-[#2F2F2F]">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">
          Shopping Cart
        </h3>
        {cartItems.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Clear Cart"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-[#212121]/50">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
            <div className="mb-4 bg-gray-100 dark:bg-[#2F2F2F] p-4 rounded-full">
              <ShoppingCart className="h-8 w-8 text-gray-300 dark:text-gray-500" />
            </div>
            <p className="text-lg font-medium text-gray-500 dark:text-gray-300">
              Cart is empty
            </p>
            <p className="text-sm">Add products to start a sale</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#2F2F2F] p-3 rounded-lg border border-gray-100 dark:border-[#212121] shadow-sm flex flex-col gap-2"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                  {item.name}
                </h4>
                <button
                  onClick={() => onRemoveFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm font-semibold text-blue-600">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#212121] rounded-lg p-1">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1 hover:bg-white dark:hover:bg-[#2F2F2F] rounded shadow-sm text-gray-600 dark:text-gray-300 disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-xs font-bold w-6 text-center text-gray-900 dark:text-gray-100">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1 hover:bg-white dark:hover:bg-[#2F2F2F] rounded shadow-sm text-gray-600 dark:text-gray-300"
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
        <div className="p-4 bg-white dark:bg-[#2F2F2F] border-t border-gray-200 dark:border-[#212121]">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-[#212121]">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]">
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
}

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  toggleCart, 
  setDiscount,
  CartItem 
} from "@/lib/redux/features/cartSlice";

export const useCart = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const items = useAppSelector((state) => state.cart.items);
  const totalAmount = useAppSelector((state) => state.cart.totalAmount);
  const discount = useAppSelector((state) => state.cart.discount);
  const isCartOpen = useAppSelector((state) => state.cart.isCartOpen);

  // Derived State
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const finalAmount = totalAmount - discount;

  // Actions
  const addItem = (item: CartItem) => {
    dispatch(addToCart(item));
  };

  const removeItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const emptyCart = () => {
    dispatch(clearCart());
  };

  const toggleCartView = () => {
    dispatch(toggleCart());
  };

  const applyDiscount = (amount: number) => {
    dispatch(setDiscount(amount));
  };

  return {
    // State
    items,
    totalAmount,
    discount,
    finalAmount,
    itemCount,
    isCartOpen,
    
    // Actions
    addItem,
    removeItem,
    updateItemQuantity,
    emptyCart,
    toggleCartView,
    applyDiscount
  };
};

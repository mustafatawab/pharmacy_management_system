import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  stock: number; // To prevent over-selling
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  discount: number;
  isCartOpen: boolean;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  discount: 0,
  isCartOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        if (existingItem.quantity < existingItem.stock) {
          existingItem.quantity += 1;
        }
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item && action.payload.quantity > 0 && action.payload.quantity <= item.stock) {
        item.quantity = action.payload.quantity;
      }
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.discount = 0;
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    setDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, setDiscount } = cartSlice.actions;
export default cartSlice.reducer;

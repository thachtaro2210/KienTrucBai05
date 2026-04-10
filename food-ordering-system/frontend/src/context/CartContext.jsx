import { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = useCallback((food) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.foodId === food.id);
      if (existing) {
        return prev.map((i) =>
          i.foodId === food.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { foodId: food.id, foodName: food.name, price: food.price, quantity: 1 }];
    });
    toast.success(`Đã thêm "${food.name}" vào giỏ`);
  }, []);

  const removeItem = useCallback((foodId) => {
    setItems((prev) => prev.filter((i) => i.foodId !== foodId));
  }, []);

  const updateQty = useCallback((foodId, qty) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.foodId === foodId ? { ...i, quantity: qty } : i)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems  = items.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

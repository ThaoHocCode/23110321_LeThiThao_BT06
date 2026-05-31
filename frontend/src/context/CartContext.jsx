import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useAuth } from "../hooks/useAuth";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { auth } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!auth?.user) {
      setCart({ items: [], subtotal: 0, itemCount: 0 });
      return;
    }
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } catch {
      setCart({ items: [], subtotal: 0, itemCount: 0 });
    }
  }, [auth?.user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const { data } = await api.post("/cart/items", { productId, quantity });
      setCart(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    setLoading(true);
    try {
      const { data } = await api.patch(`/cart/items/${itemId}`, { quantity });
      setCart(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    setLoading(true);
    try {
      const { data } = await api.delete(`/cart/items/${itemId}`);
      setCart(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ cart, loading, addToCart, updateQuantity, removeItem, refreshCart }),
    [cart, loading, refreshCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

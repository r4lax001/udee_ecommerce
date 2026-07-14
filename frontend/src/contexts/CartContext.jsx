import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "udee_cart";

const parsePrice = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  const numeric = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
};

const readCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function CartProvider({ children }) {
  const savedCart = readCartFromStorage();

  const [items, setItems] = useState(savedCart?.items || []);
  const [couponCode, setCouponCode] = useState(savedCart?.couponCode || "");
  const [couponApplied, setCouponApplied] = useState(
    savedCart?.couponApplied || false,
  );

  const shipping = 0;
  const discount = couponApplied ? 450 : 0;

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items],
  );

  const total = useMemo(
    () => subtotal - discount + shipping,
    [subtotal, discount, shipping],
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items],
  );

  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        items,
        couponCode,
        couponApplied,
      }),
    );
  }, [items, couponCode, couponApplied]);

  const addItem = ({
    productId,
    name,
    image,
    price,
    qty,
    variant,
    color,
    material,
  }) => {
    const variantText =
      typeof variant === "string"
        ? variant
        : variant?.name || variant?.label || "default";
    const colorText =
      typeof color === "string"
        ? color
        : color?.name || color?.label || "default";
    const materialText =
      typeof material === "string"
        ? material
        : material?.name || material?.label || "default";

    const variantId = `${productId}-${variantText}-${colorText}-${materialText}`;
    const normalizedPrice = parsePrice(price);
    const normalizedQty = Number(qty) || 1;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.variantId === variantId,
      );

      if (existingIndex > -1) {
        const nextItems = [...prevItems];

        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          qty: nextItems[existingIndex].qty + normalizedQty,
        };

        return nextItems;
      }

      return [
        ...prevItems,
        {
          variantId,
          productId,
          name,
          image,
          price: normalizedPrice,
          qty: normalizedQty,
          variant: variantText,
          color: colorText,
          material: materialText,
        },
      ];
    });
  };

  const updateQuantity = (variantId, nextQty) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.variantId === variantId
            ? { ...item, qty: Math.max(1, Number(nextQty) || 1) }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  const removeItem = (variantId) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.variantId !== variantId),
    );
  };

  const applyCoupon = (code) => {
    setCouponCode(code);
    setCouponApplied(Boolean(code && code.trim()));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode("");
    setCouponApplied(false);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const value = {
    items,
    subtotal,
    discount,
    shipping,
    total,
    totalItems,
    couponCode,
    couponApplied,
    addItem,
    updateQuantity,
    removeItem,
    applyCoupon,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
}

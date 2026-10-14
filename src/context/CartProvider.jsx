import { useEffect, useMemo, useReducer } from 'react';
import { MAX_QUANTITY_PER_ITEM } from '../config';
import { CartContext } from './CartContext';

const STORAGE_KEY = 'educart.cart';

const clampQuantity = (quantity) => Math.min(MAX_QUANTITY_PER_ITEM, Math.max(1, Math.round(quantity)));

function cartReducer(items, action) {
  switch (action.type) {
    case 'add': {
      const { product, quantity } = action;
      if (items.some((item) => item.id === product.id)) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: clampQuantity(item.quantity + quantity) } : item,
        );
      }
      const { id, name, price, image } = product;
      return [...items, { id, name, price, image, quantity: clampQuantity(quantity) }];
    }
    case 'setQuantity':
      return items.map((item) =>
        item.id === action.id ? { ...item, quantity: clampQuantity(action.quantity) } : item,
      );
    case 'remove':
      return items.filter((item) => item.id !== action.id);
    case 'clear':
      return [];
    default:
      throw new Error(`Unknown cart action: ${action.type}`);
  }
}

const isValidItem = (item) =>
  item != null && item.id != null && Number.isFinite(item.price) && Number.isFinite(item.quantity) && item.quantity > 0;

// The cart survives page reloads; anything malformed in storage is ignored.
function loadSavedCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return [];
    return saved.filter(isValidItem).map((item) => ({ ...item, quantity: clampQuantity(item.quantity) }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadSavedCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can be unavailable (e.g. private browsing); the cart still works for this visit.
    }
  }, [items]);

  const value = useMemo(() => {
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      itemCount,
      subtotal,
      getQuantity: (id) => items.find((item) => item.id === id)?.quantity ?? 0,
      addItem: (product, quantity = 1) => dispatch({ type: 'add', product, quantity }),
      setQuantity: (id, quantity) => dispatch({ type: 'setQuantity', id, quantity }),
      removeItem: (id) => dispatch({ type: 'remove', id }),
      clearCart: () => dispatch({ type: 'clear' }),
    };
  }, [items]);

  return <CartContext value={value}>{children}</CartContext>;
}

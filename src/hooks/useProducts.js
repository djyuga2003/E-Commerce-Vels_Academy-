import { useCallback, useEffect, useState } from 'react';
import { fetchProducts } from '../services/productService';

// Loads products and tracks the request: status is 'loading', 'success' or 'error'.
export function useProducts() {
  const [state, setState] = useState({ status: 'loading', products: [] });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    fetchProducts()
      .then((products) => {
        if (!ignore) setState({ status: 'success', products });
      })
      .catch(() => {
        if (!ignore) setState({ status: 'error', products: [] });
      });

    return () => {
      ignore = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: 'loading', products: [] });
    setAttempt((count) => count + 1);
  }, []);

  return { ...state, retry };
}

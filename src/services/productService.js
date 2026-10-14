import { products } from '../data/products';

/**
 * Loads the product catalogue.
 *
 * Frontend only for now: this resolves the local mock data. When the backend is
 * ready, replace the body with a real request, for example:
 *
 *   const response = await fetch('/api/products');
 *   if (!response.ok) throw new Error('Failed to load products');
 *   return response.json();
 */
export async function fetchProducts() {
  return products;
}

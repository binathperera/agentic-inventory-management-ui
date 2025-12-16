import type { Product } from '../types';

/**
 * Utility functions for handling Product data with backward compatibility
 * between old and new database schemas
 */

/**
 * Get the quantity value from a product, supporting both old and new schema
 */
export const getProductQuantity = (product: Product): number => {
  return product.quantity ?? product.remainingQty ?? 0;
};

/**
 * Get the price value from a product, supporting both old and new schema
 */
export const getProductPrice = (product: Product): number => {
  return product.price ?? product.latestUnitPrice ?? 0;
};

/**
 * Get the product ID, supporting both old and new schema
 * Prioritizes new schema (productId) over old schema (id)
 */
export const getProductId = (product: Product): string | number | undefined => {
  return product.productId ?? product.id;
};

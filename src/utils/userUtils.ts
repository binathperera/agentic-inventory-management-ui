import type { User } from '../types';

/**
 * Utility functions for handling User data
 */

/**
 * Get the display role for a user, prioritizing the second role if multiple roles exist
 */
export const getUserDisplayRole = (user: User | null | undefined): string => {
  if (!user || !user.roles || user.roles.length === 0) {
    return '';
  }
  // If user has multiple roles, display the second one (e.g., ADMIN instead of ROLE_ADMIN)
  // Otherwise display the first role
  return user.roles[1] ? user.roles[1] : user.roles[0];
};

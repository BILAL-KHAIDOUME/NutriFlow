const FAVORITES_KEY = 'nutriflow:favorites';

/**
 * Load favorite recipes from localStorage.
 */
export function loadFavorites() {
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persist favorite recipes in localStorage.
 */
export function saveFavorites(favorites) {
  try {
    const safe = Array.isArray(favorites) ? favorites : [];
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(safe));
  } catch {
    // fail silently – favorites are not critical for core UX
  }
}


const BASE_URL = 'https://dummyjson.com/recipes';

/**
 * Fetch all recipes from the remote API.
 * Returns an array of recipe objects.
 */
export async function getAllRecipes() {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error('Unable to load recipes.');
  }

  const data = await response.json();
  return Array.isArray(data.recipes) ? data.recipes : [];
}

/**
 * Search recipes with a query string.
 * Uses the DummyJSON /recipes/search endpoint.
 */
export async function searchRecipes(query) {
  const trimmed = query.trim();

  if (!trimmed) {
    return getAllRecipes();
  }

  const url = `${BASE_URL}/search?q=${encodeURIComponent(trimmed)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Unable to search recipes.');
  }

  const data = await response.json();
  return Array.isArray(data.recipes) ? data.recipes : [];
}


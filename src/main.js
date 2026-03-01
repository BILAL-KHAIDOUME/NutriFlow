import { getAllRecipes, searchRecipes } from './api/recipeProvider.js';
import { getTotalCalories } from './services/calorieService.js';
import { loadFavorites, saveFavorites } from './services/storageService.js';
import {
  initUI,
  renderRecipes,
  renderFavorites,
  renderTotalCalories,
  renderError,
  openModalForRecipe,
  closeModal,
} from './ui/render.js';
import { showLoader, hideLoader } from './ui/loader.js';

const searchInputEl = document.getElementById('search-input');

let allRecipes = [];
let currentRecipes = [];
let favorites = [];

function getFavoriteIds() {
  return favorites.map((r) => r.id);
}

function findRecipeById(id) {
  return (
    currentRecipes.find((recipe) => recipe.id === id) ||
    allRecipes.find((recipe) => recipe.id === id) ||
    favorites.find((recipe) => recipe.id === id) ||
    null
  );
}

function syncFavoritesUI() {
  renderFavorites(favorites);
  const total = getTotalCalories(favorites);
  renderTotalCalories(total);
  renderRecipes(currentRecipes, getFavoriteIds());
}

function toggleFavorite(recipeId) {
  const existingIndex = favorites.findIndex((r) => r.id === recipeId);
  if (existingIndex >= 0) {
    favorites.splice(existingIndex, 1);
  } else {
    const recipe = findRecipeById(recipeId);
    if (recipe) {
      favorites.push(recipe);
    }
  }

  saveFavorites(favorites);
  syncFavoritesUI();
}

function handleRecipeClick(recipeId) {
  const recipe = findRecipeById(recipeId);
  if (!recipe) return;
  const isFavorite = favorites.some((r) => r.id === recipeId);
  openModalForRecipe(recipe, isFavorite);
}

function attachSearchHandler() {
  if (!searchInputEl) return;

  let timeoutId = null;

  searchInputEl.addEventListener('input', () => {
    const query = searchInputEl.value;
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(async () => {
      await performSearch(query);
    }, 250);
  });
}

async function performSearch(query) {
  try {
    showLoader();
    renderError('');

    const trimmed = query.trim();
    let recipes;

    if (!trimmed) {
      recipes = await getAllRecipes();
      allRecipes = recipes;
    } else {
      recipes = await searchRecipes(trimmed);
    }

    currentRecipes = recipes;
    renderRecipes(currentRecipes, getFavoriteIds());
  } catch (error) {
    renderError('Something went wrong while searching recipes. Please try again.');
  } finally {
    hideLoader();
  }
}

async function bootstrap() {
  initUI({
    onRecipeClick: handleRecipeClick,
    onToggleFavorite: toggleFavorite,
  });

  favorites = loadFavorites();
  syncFavoritesUI();

  try {
    showLoader();
    renderError('');
    const recipes = await getAllRecipes();
    allRecipes = recipes;
    currentRecipes = recipes;

    renderRecipes(currentRecipes, getFavoriteIds());
  } catch (error) {
    renderError('Unable to load recipes. Please check your connection and try again.');
  } finally {
    hideLoader();
  }

  attachSearchHandler();
}

window.addEventListener('DOMContentLoaded', bootstrap);


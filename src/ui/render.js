import { getNutriBadge } from '../services/calorieService.js';

const recipesGridEl = document.getElementById('recipes-grid');
const favoritesListEl = document.getElementById('favorites-list');
const favoritesEmptyEl = document.getElementById('favorites-empty');
const dayTotalCaloriesEl = document.getElementById('day-total-calories');
const errorBannerEl = document.getElementById('error-banner');
const modalEl = document.getElementById('recipe-modal');
const modalContentEl = document.getElementById('modal-content');

let handlers = {
  onRecipeClick: null,
  onToggleFavorite: null,
};

export function initUI({ onRecipeClick, onToggleFavorite }) {
  handlers.onRecipeClick = onRecipeClick;
  handlers.onToggleFavorite = onToggleFavorite;

  if (recipesGridEl) {
    recipesGridEl.addEventListener('click', (event) => {
      const target = event.target;

      const favoriteBtn = target.closest('[data-favorite-toggle]');
      if (favoriteBtn) {
        const recipeId = Number(favoriteBtn.dataset.recipeId);
        if (Number.isFinite(recipeId) && typeof handlers.onToggleFavorite === 'function') {
          handlers.onToggleFavorite(recipeId);
        }
        event.stopPropagation();
        return;
      }

      const card = target.closest('[data-recipe-card]');
      if (card && typeof handlers.onRecipeClick === 'function') {
        const recipeId = Number(card.dataset.recipeId);
        if (Number.isFinite(recipeId)) {
          handlers.onRecipeClick(recipeId);
        }
      }
    });
  }

  if (modalEl) {
    modalEl.addEventListener('click', (event) => {
      const target = event.target;
      if (target.matches('[data-modal-close]')) {
        closeModal();
      }
    });
  }
}

export function renderRecipes(recipes, favoriteIds) {
  if (!recipesGridEl) return;

  const favSet = new Set(favoriteIds || []);

  if (!Array.isArray(recipes) || recipes.length === 0) {
    recipesGridEl.innerHTML =
      '<p class="nf-recipes-grid__empty">No recipes found. Try another search.</p>';
    return;
  }

  const cards = recipes
    .map((recipe) => {
      const isFavorite = favSet.has(recipe.id);
      const badge = getNutriBadge(recipe.caloriesPerServing);

      const ingredientsPreview = Array.isArray(recipe.ingredients)
        ? recipe.ingredients.slice(0, 3).join(', ')
        : '';

      const time = recipe.prepTimeMinutes && recipe.cookTimeMinutes
        ? recipe.prepTimeMinutes + recipe.cookTimeMinutes
        : recipe.prepTimeMinutes || recipe.cookTimeMinutes || null;

      return `
        <article class="nf-card" data-recipe-card data-recipe-id="${recipe.id}">
          <div class="nf-card__image-wrapper">
            <img
              src="${recipe.image || 'https://via.placeholder.com/600x400?text=Recipe'}"
              alt="${recipe.name || 'Recipe image'}"
              class="nf-card__image"
              loading="lazy"
            />
            <span class="nf-badge ${badge.cssClass}">
              ${badge.label} · ${Math.round(recipe.caloriesPerServing || 0)} kcal/serving
            </span>
            <button
              type="button"
              class="nf-card__favorite ${isFavorite ? 'nf-card__favorite--active' : ''}"
              aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
              data-favorite-toggle
              data-recipe-id="${recipe.id}"
            >
              ♥
            </button>
          </div>
          <div class="nf-card__body">
            <h3 class="nf-card__title">${recipe.name}</h3>
            <p class="nf-card__meta">
              ${time ? `${time} min · ` : ''}${recipe.cuisine || 'Global'} · ⭐
              ${recipe.rating ?? 'N/A'}
            </p>
            ${
              ingredientsPreview
                ? `<p class="nf-card__ingredients">${ingredientsPreview}${
                    (recipe.ingredients || []).length > 3 ? ', ...' : ''
                  }</p>`
                : ''
            }
          </div>
        </article>
      `;
    })
    .join('');

  recipesGridEl.innerHTML = cards;
}

export function renderFavorites(favoriteRecipes) {
  if (!favoritesListEl || !favoritesEmptyEl) return;

  if (!Array.isArray(favoriteRecipes) || favoriteRecipes.length === 0) {
    favoritesListEl.innerHTML = '';
    favoritesEmptyEl.style.display = 'block';
    return;
  }

  favoritesEmptyEl.style.display = 'none';

  favoritesListEl.innerHTML = favoriteRecipes
    .map((recipe) => {
      const badge = getNutriBadge(recipe.caloriesPerServing);
      return `
        <li class="nf-favorites__item">
          <div class="nf-favorites__titles">
            <span class="nf-favorites__name">${recipe.name}</span>
            <span class="nf-favorites__kcal">
              ${Math.round(recipe.caloriesPerServing || 0)} kcal/serving
            </span>
          </div>
          <span class="nf-badge nf-badge--small ${badge.cssClass}">
            ${badge.label}
          </span>
        </li>
      `;
    })
    .join('');
}

export function renderTotalCalories(totalCalories) {
  if (!dayTotalCaloriesEl) return;
  const safeTotal = Number.isFinite(totalCalories) ? totalCalories : 0;
  dayTotalCaloriesEl.textContent = `${Math.round(safeTotal)} kcal`;
}

export function renderError(message) {
  if (!errorBannerEl) return;
  if (!message) {
    errorBannerEl.textContent = '';
    errorBannerEl.classList.add('nf-error--hidden');
    return;
  }

  errorBannerEl.textContent = message;
  errorBannerEl.classList.remove('nf-error--hidden');
}

export function openModalForRecipe(recipe, isFavorite) {
  if (!modalEl || !modalContentEl) return;

  const badge = getNutriBadge(recipe.caloriesPerServing);
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : [recipe.instructions].filter(Boolean);

  const time = recipe.prepTimeMinutes && recipe.cookTimeMinutes
    ? recipe.prepTimeMinutes + recipe.cookTimeMinutes
    : recipe.prepTimeMinutes || recipe.cookTimeMinutes || null;

  modalContentEl.innerHTML = `
    <header class="nf-modal__header">
      <div>
        <h2 class="nf-modal__title">${recipe.name}</h2>
        <p class="nf-modal__subtitle">
          ${recipe.cuisine || 'Global'} ·
          ${time ? `${time} min ·` : ''}
          ⭐ ${recipe.rating ?? 'N/A'}
        </p>
      </div>
      <span class="nf-badge ${badge.cssClass}">
        ${badge.label} · ${Math.round(recipe.caloriesPerServing || 0)} kcal/serving
      </span>
    </header>
    <div class="nf-modal__body">
      <div class="nf-modal__image-wrapper">
        <img
          src="${recipe.image || 'https://via.placeholder.com/800x500?text=Recipe'}"
          alt="${recipe.name || 'Recipe image'}"
          class="nf-modal__image"
        />
      </div>
      <section class="nf-modal__section">
        <h3>Ingredients</h3>
        <ul class="nf-modal__list">
          ${ingredients.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </section>
      <section class="nf-modal__section">
        <h3>Instructions</h3>
        <ol class="nf-modal__list nf-modal__list--ordered">
          ${instructions.map((step) => `<li>${step}</li>`).join('')}
        </ol>
      </section>
    </div>
    <footer class="nf-modal__footer">
      <button
        type="button"
        class="nf-button nf-button--ghost"
        data-modal-close
      >
        Close
      </button>
      <button
        type="button"
        class="nf-button nf-button--primary nf-button--favorite ${isFavorite ? 'nf-button--favorite-active' : ''}"
        data-favorite-toggle
        data-recipe-id="${recipe.id}"
      >
        ${isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </button>
    </footer>
  `;

  modalEl.classList.remove('nf-modal--hidden');
  modalEl.setAttribute('aria-hidden', 'false');
}

export function closeModal() {
  if (!modalEl) return;
  modalEl.classList.add('nf-modal--hidden');
  modalEl.setAttribute('aria-hidden', 'true');
}


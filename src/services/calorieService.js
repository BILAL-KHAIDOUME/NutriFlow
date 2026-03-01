/**
 * Compute a simple Nutri-Badge from calories per serving.
 * - green: < 400
 * - orange: 400 - 800
 * - red: > 800
 */
export function getNutriBadge(caloriesPerServing) {
  const calories = Number.isFinite(caloriesPerServing)
    ? caloriesPerServing
    : 0;

  if (calories < 400) {
    return {
      label: 'Light',
      color: 'green',
      cssClass: 'nf-badge--green',
    };
  }

  if (calories <= 800) {
    return {
      label: 'Balanced',
      color: 'orange',
      cssClass: 'nf-badge--orange',
    };
  }

  return {
    label: 'Indulgent',
    color: 'red',
    cssClass: 'nf-badge--red',
  };
}

/**
 * Compute total calories for a list of recipes.
 * Uses caloriesPerServing * servings when available, otherwise caloriesPerServing.
 */
export function getTotalCalories(recipes) {
  if (!Array.isArray(recipes)) return 0;

  return recipes.reduce((total, recipe) => {
    const calories = Number(recipe.caloriesPerServing) || 0;
    const servings = Number(recipe.servings) || 1;
    return total + calories * servings;
  }, 0);
}


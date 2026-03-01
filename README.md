# NutriFlow – Recipes & Calorie Dashboard

NutriFlow is a small front-end app that lets you explore recipes, search dynamically, mark favorites, and track your total calories for the day.

It is built with **vanilla JavaScript (ES Modules)** and **modular SASS**, and uses the public [`dummyjson.com`](https://dummyjson.com/docs/recipes) recipes API.

## Features (User Stories)

- **US1 – Fetch initial recipes**: a grid of recipes is fetched and displayed automatically on load.
- **US2 – Loader state**: while data is loading, a SASS-powered loader is displayed.
- **US3 – Dynamic search**: a search bar lets you search recipes; typing triggers a debounced search.
- **US4 – Nutri-Badge**: each recipe shows a badge computed from its `caloriesPerServing`:
  - Green for \< 400 kcal
  - Orange for 400–800 kcal
  - Red for \> 800 kcal
- **US5 – Detail modal**: clicking a recipe opens a detailed modal with ingredients and instructions.
- **US6 – Favorites**: clicking the heart toggles recipes in your favorites (persisted in `localStorage`).
- **US7 – “My Day” total**: the “My Day” panel shows the cumulative calories of all favorite recipes.

## Tech Overview

- **Data source**: [`https://dummyjson.com/recipes`](https://dummyjson.com/docs/recipes)
- **Architecture**:
  - `src/api/recipeProvider.js`: all API calls (`getAllRecipes`, `searchRecipes`)
  - `src/services/calorieService.js`: Nutri-badge rules, total calorie calculations
  - `src/services/storageService.js`: favorites persisted in `localStorage`
  - `src/ui/render.js`: DOM rendering (grid, favorites list, modal, error)
  - `src/ui/loader.js`: loader show/hide functions
  - `src/main.js`: app bootstrap, data flow, wiring events
  - `styles/`: SASS partials + compiled `main.css`

The entry point is `index.html`, which loads `src/main.js` as an ES module and `styles/main.css` for styling.

## Running the App

1. **Simplest way (no build step)**
   - Open `index.html` directly in a modern browser (Chrome, Edge, etc.).
   - Because the app uses ES Modules, some browsers may block `file://` imports.
   - If you see module import errors, use method 2 instead.

2. **Recommended: run a tiny static server**
   - With Node.js installed:
     ```bash
     cd Recipes
     npx serve .
     # or: npx http-server .
     ```
   - Then open the printed `http://localhost:...` URL in your browser.

> The CSS is already compiled as `styles/main.css`, so you do **not** need SASS just to run the app.

## Optional: Working with SASS

If you want to tweak the design via SASS:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Rebuild CSS from SASS:
   ```bash
   npm run build:css
   ```

This compiles `styles/main.scss` (which imports the partials) into `styles/main.css`.


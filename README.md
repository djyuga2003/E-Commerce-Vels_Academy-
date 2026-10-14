# EduCart — E-Commerce Frontend

A clean, responsive storefront for school essentials, built with React 19, Vite and React Router.
Frontend only: products come from local mock data, and there is no API, database or payment integration yet.

## Features

- **Home** — product cards in a 4-per-row grid (3 / 2 / 1 on smaller screens). Each card has an image, description, price, a −/+ quantity selector and an Add to cart button. The search bar above the grid filters products as you type.
- **Header** — logo on the left, cart button with a live item count on the right.
- **Cart** — change the quantity of any item or remove it. The order summary and the Checkout button sit at the bottom. The cart is saved in `localStorage`, so it survives a page refresh.
- **Checkout** — form for name, class (Class 1–12 dropdown), home address, email and phone number, with inline validation. Submitting shows an order confirmation and empties the cart. No payment step yet.

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
npm run lint
```

Tooling is pinned to Vite 6 and ESLint 9 so it runs on Node 20.14. On Node 22+ you can upgrade to the latest Vite.

## Project structure

```
src/
  config.js                   store name, currency, max quantity, class options
  data/products.js            mock product catalogue
  services/productService.js  fetchProducts() — swap in the real API here
  hooks/                      useProducts (loading / error state), usePageTitle
  context/                    cart state (CartProvider + useCart)
  components/                 Header, SearchBar, ProductCard, QuantityStepper, CartItem, …
  pages/                      HomePage, CartPage, CheckoutPage, NotFoundPage
  utils/                      price formatting, search, form validation
  styles/global.css           theme tokens (blue → green gradient) and base styles
public/images/                product illustrations and the fallback image
```

## Connecting a backend later

- **Products:** replace the body of `fetchProducts()` in `src/services/productService.js` with a `fetch` call. The home page already handles loading, error (with retry) and empty states. Each product needs `{ id, name, description, price, image }`.
- **Orders and payments:** `handleSubmit` in `src/pages/CheckoutPage.jsx` builds the order (`customer`, `items`, `itemCount`, `total`). Send it to the orders API or payment step there, before the confirmation is shown.
- **Deploying:** routes use the browser history API, so the host must serve `index.html` for unknown paths (SPA fallback).

## Customising

- Brand name, currency (`INR` / `en-IN`), max quantity per item and class options: `src/config.js`
- Colours and gradient: CSS variables at the top of `src/styles/global.css`
- Logo: `src/components/LogoMark.jsx` and `public/favicon.svg`

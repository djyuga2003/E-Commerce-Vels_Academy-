# Integration Guide

How to connect a backend, a database and a hosting setup to the EduCart frontend.
The frontend already works on its own with sample data, so you can add each part step by step.

The frontend needs only two things from the server:

| What | Where it's used in the frontend |
| --- | --- |
| A list of products | `fetchProducts()` in `src/services/productService.js` |
| A way to save an order | `handleSubmit` in `src/pages/CheckoutPage.jsx` |

---

## BackEnd

Build an API (for example with Node.js + Express) that offers two endpoints.

**1. `GET /api/products`** returns the products as JSON:

```json
[
  {
    "id": 1,
    "name": "Spiral Notebook",
    "description": "A4 ruled notebook with 200 pages.",
    "price": 120,
    "image": "https://your-site.com/images/notebook.jpg"
  }
]
```

Keep these five field names, because the product cards read them directly.

**2. `POST /api/orders`** receives the order from the checkout form. The frontend sends this shape:

```json
{
  "customer": {
    "name": "Priya Sharma",
    "studentClass": "Class 8",
    "address": "12, MG Road, Bengaluru 560038",
    "email": "priya@example.com",
    "phone": "+91 98765 43210"
  },
  "items": [{ "id": 1, "name": "Spiral Notebook", "price": 120, "quantity": 2 }],
  "itemCount": 2,
  "total": 240
}
```

The server should re-check the prices from its own data and not trust the `price` and `total` sent by the browser.

### Connect the frontend

**Products:** in `src/services/productService.js`, replace the body of `fetchProducts()`:

```js
export async function fetchProducts() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
  if (!response.ok) throw new Error('Failed to load products');
  return response.json();
}
```

Nothing else changes. The home page already shows a loading state, an error message with a "Try again" button, and an empty state.

**Orders:** in `src/pages/CheckoutPage.jsx`, make `handleSubmit` async and send the order before showing the confirmation:

```js
async function handleSubmit(event) {
  // ...keep the existing validation code...

  const order = { customer: { /* ... */ }, items: /* ... */, itemCount, total: subtotal };

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!response.ok) {
    alert('Sorry, we could not place your order. Please try again.');
    return;
  }

  setPlacedOrder(order);
  clearCart();
}
```

Payments go in this same function when you add them: send the order, take the payment, then show the confirmation.

### Set the API address

Create a file named `.env.local` in the project root:

```
VITE_API_URL=http://localhost:5000
```

Restart `npm run dev` after creating or changing it. Only variables that start with `VITE_` are visible to the frontend, so never put passwords or secret keys in this file.

---

## DataBase

The frontend never talks to the database directly. The flow is always:

```
Frontend  →  BackEnd API  →  Database
```

Use any database you like (PostgreSQL, MySQL or MongoDB). These three tables match what the frontend sends and receives:

**products**

| Column | Type | Notes |
| --- | --- | --- |
| id | integer, primary key | |
| name | text | |
| description | text | |
| price | decimal | in rupees |
| image | text | image URL |

**orders**

| Column | Type | Notes |
| --- | --- | --- |
| id | integer, primary key | |
| customer_name | text | from `customer.name` |
| student_class | text | from `customer.studentClass`, e.g. "Class 8" |
| address | text | |
| email | text | |
| phone | text | |
| total | decimal | calculated by the server |
| status | text | e.g. "pending", later "paid" |
| created_at | timestamp | |

**order_items**

| Column | Type | Notes |
| --- | --- | --- |
| id | integer, primary key | |
| order_id | integer | links to `orders.id` |
| product_id | integer | links to `products.id` |
| quantity | integer | |
| price | decimal | product price at the time of the order |

To start, copy the 12 sample products from `src/data/products.js` into the `products` table. Once `fetchProducts()` calls the API, you can delete that file.

---

## Deployment

**1. Build the frontend**

```bash
npm install
npm run build
```

This creates a `dist/` folder of plain HTML, CSS and JS files that any static host can serve, such as Netlify, Vercel, Cloudflare Pages or GitHub Pages.

**2. Set the API address on the host**

In your hosting dashboard, add the environment variable `VITE_API_URL` with your live API address (for example `https://api.your-site.com`). It is built into the files, so rebuild and redeploy whenever it changes.

**3. Make page refreshes work**

The site has page addresses like `/cart` and `/checkout`. The host must send `index.html` for every page address, or refreshing those pages shows a 404 error.

- **Netlify:** create `public/_redirects` containing:
  ```
  /*  /index.html  200
  ```
- **Vercel:** create `vercel.json` in the project root:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```

**4. Deploy the backend and database**

Host the API and database separately (for example on Render, Railway or a VPS). On the API, allow requests from your frontend's domain (CORS). Otherwise the browser will block the calls.

**5. Check it works**

Open the live site, confirm the products load, add an item to the cart, place a test order, and check the new order appears in the database.

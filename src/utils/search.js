// Case-insensitive search over name and description; every word in the query must match.
export function filterProducts(products, query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return products;

  return products.filter(({ name, description = '' }) => {
    const text = `${name} ${description}`.toLowerCase();
    return terms.every((term) => text.includes(term));
  });
}

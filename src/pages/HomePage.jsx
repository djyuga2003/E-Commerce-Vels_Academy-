import { useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import { AlertIcon, SearchIcon } from '../components/Icons';
import ProductGrid, { ProductGridSkeleton } from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import { usePageTitle } from '../hooks/usePageTitle';
import { useProducts } from '../hooks/useProducts';
import { pluralize } from '../utils/format';
import { filterProducts } from '../utils/search';
import './HomePage.css';

export default function HomePage() {
  usePageTitle();
  const { products, status, retry } = useProducts();
  const [query, setQuery] = useState('');
  const visibleProducts = useMemo(() => filterProducts(products, query), [products, query]);
  const trimmedQuery = query.trim();

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <h1 id="hero-title" className="hero__title">
            Everything you need for <span className="gradient-text">school</span>
          </h1>
          <p className="hero__text">
            Notebooks, stationery, bags and more — picked for students and delivered to your door.
          </p>
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <div className="hero__art" aria-hidden="true">
          <img src="/images/products/backpack.svg" alt="" className="hero__art-main" />
          <img src="/images/products/colour-pencils.svg" alt="" className="hero__art-side" />
        </div>
      </section>

      <section aria-labelledby="products-title">
        <div className="section-head">
          <h2 id="products-title" className="section-title">
            {trimmedQuery ? `Results for “${trimmedQuery}”` : 'All products'}
          </h2>
          <p className="section-meta" aria-live="polite">
            {status === 'success' ? pluralize(visibleProducts.length, 'product') : ''}
          </p>
        </div>

        {status === 'loading' && <ProductGridSkeleton />}

        {status === 'error' && (
          <EmptyState
            icon={<AlertIcon size={30} />}
            title="We couldn't load the products"
            action={
              <button type="button" className="btn btn--primary" onClick={retry}>
                Try again
              </button>
            }
          >
            Please check your connection and try again.
          </EmptyState>
        )}

        {status === 'success' &&
          (visibleProducts.length > 0 ? (
            <ProductGrid products={visibleProducts} />
          ) : (
            <EmptyState
              headingLevel={3}
              icon={<SearchIcon size={30} />}
              title={products.length > 0 ? 'No matching products' : 'No products yet'}
              action={
                products.length > 0 && (
                  <button type="button" className="btn btn--ghost" onClick={() => setQuery('')}>
                    Clear search
                  </button>
                )
              }
            >
              {products.length > 0
                ? `Nothing matches “${trimmedQuery}”. Try another word, like “pen” or “bag”.`
                : 'New products are on their way. Please check back soon.'}
            </EmptyState>
          ))}
      </section>
    </>
  );
}

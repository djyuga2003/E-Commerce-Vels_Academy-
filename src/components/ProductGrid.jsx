import ProductCard from './ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ products }) {
  return (
    <ul className="product-grid" role="list">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <>
      <p className="sr-only" role="status">
        Loading products…
      </p>
      <ul className="product-grid" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className="product-skeleton">
            <div className="skeleton product-skeleton__media" />
            <div className="product-skeleton__body">
              <div className="skeleton" style={{ width: '60%', height: 18 }} />
              <div className="skeleton" style={{ height: 12 }} />
              <div className="skeleton" style={{ width: '85%', height: 12 }} />
              <div className="skeleton" style={{ width: '40%', height: 22, marginTop: 8 }} />
              <div className="skeleton" style={{ height: 46, borderRadius: 12 }} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { CartIcon, CheckIcon } from './Icons';
import ProductImage from './ProductImage';
import QuantityStepper from './QuantityStepper';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem, getQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const inCart = getQuantity(product.id);

  // Show "Added to cart" on the button briefly, then switch back.
  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 1500);
    return () => clearTimeout(timer);
  }, [justAdded]);

  function handleAddToCart() {
    addItem(product, quantity);
    setQuantity(1);
    setJustAdded(true);
  }

  return (
    <article className="product-card">
      <div className="product-card__media">
        <ProductImage src={product.image} alt={product.name} width={320} height={240} loading="lazy" decoding="async" />
        {inCart > 0 && (
          <span className="product-card__in-cart">
            <CheckIcon size={14} /> {inCart} in cart
          </span>
        )}
      </div>

      <div className="product-card__body">
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>

        <div className="product-card__purchase">
          <p className="product-card__price">{formatPrice(product.price)}</p>
          <QuantityStepper value={quantity} onChange={setQuantity} label={`Quantity of ${product.name} to add`} />
        </div>

        <button
          type="button"
          className={`btn btn--primary btn--block${justAdded ? ' btn--success' : ''}`}
          onClick={handleAddToCart}
        >
          {justAdded ? <CheckIcon size={18} /> : <CartIcon size={18} />}
          {justAdded ? 'Added to cart' : 'Add to cart'}
          <span className="sr-only">, {product.name}</span>
        </button>
        <p className="sr-only" role="status">
          {justAdded ? `Added to cart. You have ${inCart} ${product.name} in your cart.` : ''}
        </p>
      </div>
    </article>
  );
}

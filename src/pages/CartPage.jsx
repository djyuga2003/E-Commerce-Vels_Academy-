import { useRef } from 'react';
import { Link } from 'react-router';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import { ArrowLeftIcon, ArrowRightIcon, CartIcon } from '../components/Icons';
import { useCart } from '../context/CartContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatPrice, pluralize } from '../utils/format';
import './CartPage.css';

export default function CartPage() {
  usePageTitle('Your cart');
  const { items, itemCount, subtotal, setQuantity, removeItem } = useCart();
  const headingRef = useRef(null);

  function handleRemove(id) {
    removeItem(id);
    // The row (and its focused button) disappears, so keep keyboard focus on the page.
    headingRef.current?.focus();
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 ref={headingRef} tabIndex={-1} className="page-title">
            Your cart
          </h1>
          <p className="page-subtitle">
            {itemCount > 0 ? `${pluralize(itemCount, 'item')} — review them before checking out.` : 'Nothing here yet.'}
          </p>
        </div>
        <Link to="/" className="text-link">
          <ArrowLeftIcon size={18} /> Continue shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<CartIcon size={30} />}
          title="Your cart is empty"
          action={
            <Link to="/" className="btn btn--primary">
              Browse products
            </Link>
          }
        >
          Add notebooks, stationery and more from the shop, and they’ll show up here.
        </EmptyState>
      ) : (
        <>
          <ul className="cart-list" role="list" aria-label="Items in your cart">
            {items.map((item) => (
              <CartItem key={item.id} item={item} onQuantityChange={setQuantity} onRemove={handleRemove} />
            ))}
          </ul>

          <section className="panel cart-summary" aria-labelledby="cart-summary-title">
            <h2 id="cart-summary-title" className="panel__title">
              Order summary
            </h2>
            <dl className="cart-summary__rows">
              <div className="cart-summary__row">
                <dt>Items ({itemCount})</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="cart-summary__row cart-summary__row--total">
                <dt>Total</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
            </dl>
            <Link to="/checkout" className="btn btn--primary btn--lg btn--block">
              Checkout <ArrowRightIcon size={18} />
            </Link>
          </section>
        </>
      )}
    </div>
  );
}

import { Link, NavLink } from 'react-router';
import { STORE_NAME } from '../config';
import { useCart } from '../context/CartContext';
import { pluralize } from '../utils/format';
import { CartIcon } from './Icons';
import LogoMark from './LogoMark';
import './Header.css';

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" aria-label={`${STORE_NAME} home`}>
          <LogoMark />
          <span className="brand__name">{STORE_NAME}</span>
        </Link>

        <NavLink to="/cart" className="cart-button" aria-label={`Cart, ${pluralize(itemCount, 'item')}`}>
          <CartIcon size={22} />
          <span>Cart</span>
          {itemCount > 0 && (
            // Keyed by count so the "pop" animation replays whenever the cart changes.
            <span key={itemCount} className="cart-button__badge">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </NavLink>
      </div>
    </header>
  );
}

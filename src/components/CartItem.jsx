import { formatPrice } from '../utils/format';
import { TrashIcon } from './Icons';
import ProductImage from './ProductImage';
import QuantityStepper from './QuantityStepper';
import './CartItem.css';

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <li className="cart-item">
      <div className="cart-item__media">
        <ProductImage src={item.image} alt="" width={96} height={72} />
      </div>

      <div className="cart-item__info">
        <h3 className="cart-item__name">{item.name}</h3>
        <p className="cart-item__unit-price">{formatPrice(item.price)} each</p>
      </div>

      <div className="cart-item__quantity">
        <QuantityStepper
          value={item.quantity}
          onChange={(quantity) => onQuantityChange(item.id, quantity)}
          label={`Quantity of ${item.name}`}
        />
      </div>

      <p className="cart-item__total">{formatPrice(item.price * item.quantity)}</p>

      <button
        type="button"
        className="cart-item__remove"
        aria-label={`Remove ${item.name} from cart`}
        title="Remove from cart"
        onClick={() => onRemove(item.id)}
      >
        <TrashIcon size={19} />
      </button>
    </li>
  );
}

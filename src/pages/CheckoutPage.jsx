import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import EmptyState from '../components/EmptyState';
import { AlertIcon, ArrowLeftIcon, CartIcon, CheckIcon } from '../components/Icons';
import ProductImage from '../components/ProductImage';
import { SCHOOL_CLASSES } from '../config';
import { useCart } from '../context/CartContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatPrice, pluralize } from '../utils/format';
import { validateCheckout } from '../utils/validation';
import './CheckoutPage.css';

const EMPTY_FORM = { name: '', studentClass: '', address: '', email: '', phone: '' };
const FIELD_ORDER = Object.keys(EMPTY_FORM);
const fieldId = (name) => `checkout-${name}`;

export default function CheckoutPage() {
  const { items, itemCount, subtotal, clearCart } = useCart();
  const [values, setValues] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  usePageTitle(placedOrder ? 'Order placed' : 'Checkout');

  if (placedOrder) return <OrderConfirmation order={placedOrder} />;

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Checkout</h1>
        </div>
        <EmptyState
          icon={<CartIcon size={30} />}
          title="Your cart is empty"
          action={
            <Link to="/" className="btn btn--primary">
              Browse products
            </Link>
          }
        >
          Add a few items to your cart before checking out.
        </EmptyState>
      </div>
    );
  }

  // Errors show once a field has been visited, or for every field after a submit attempt.
  const errors = validateCheckout(values);
  const errorFor = (name) => (submitAttempted || touched[name] ? errors[name] : undefined);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitAttempted(true);

    const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
    if (firstInvalid) {
      event.currentTarget.elements.namedItem(firstInvalid).focus();
      return;
    }

    // Frontend only for now: this is the order the orders API (and the payment step) will receive later.
    setPlacedOrder({
      customer: {
        name: values.name.trim(),
        studentClass: values.studentClass,
        address: values.address.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
      },
      items: items.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
      itemCount,
      total: subtotal,
    });
    clearCart();
  }

  // Wires a control to its label, value and error message.
  function controlProps(name) {
    const error = errorFor(name);
    return {
      id: fieldId(name),
      name,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur,
      required: true,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `${fieldId(name)}-error` : undefined,
    };
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Checkout</h1>
          <p className="page-subtitle">Tell us who the order is for and where to deliver it.</p>
        </div>
        <Link to="/cart" className="text-link">
          <ArrowLeftIcon size={18} /> Back to cart
        </Link>
      </div>

      <div className="checkout-layout">
        <form className="panel checkout-form" noValidate onSubmit={handleSubmit} aria-labelledby="checkout-form-title">
          <h2 id="checkout-form-title" className="panel__title">
            Student details
          </h2>
          <p className="checkout-form__hint">All fields are required.</p>

          <div className="form-grid">
            <FormField name="name" label="Full name" error={errorFor('name')}>
              <input type="text" className="input" autoComplete="name" placeholder="Your full name" {...controlProps('name')} />
            </FormField>

            <FormField name="studentClass" label="Class" error={errorFor('studentClass')}>
              <select
                className={`input select${values.studentClass ? '' : ' select--placeholder'}`}
                {...controlProps('studentClass')}
              >
                <option value="" disabled>
                  Select your class
                </option>
                {SCHOOL_CLASSES.map((schoolClass) => (
                  <option key={schoolClass} value={schoolClass}>
                    {schoolClass}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField name="address" label="Home address" error={errorFor('address')} wide>
              <textarea
                className="input textarea"
                rows={3}
                autoComplete="street-address"
                placeholder="House no., street, area, city and PIN code"
                {...controlProps('address')}
              />
            </FormField>

            <FormField name="email" label="Email" error={errorFor('email')}>
              <input type="email" className="input" autoComplete="email" placeholder="you@example.com" {...controlProps('email')} />
            </FormField>

            <FormField name="phone" label="Phone number" error={errorFor('phone')}>
              <input type="tel" className="input" autoComplete="tel" placeholder="e.g. 98765 43210" {...controlProps('phone')} />
            </FormField>
          </div>

          <button type="submit" className="btn btn--primary btn--lg btn--block">
            Place order · {formatPrice(subtotal)}
          </button>
        </form>

        <OrderSummary items={items} itemCount={itemCount} total={subtotal} />
      </div>
    </div>
  );
}

function FormField({ name, label, error, wide = false, children }) {
  return (
    <div className={`field${wide ? ' field--wide' : ''}`}>
      <label className="field__label" htmlFor={fieldId(name)}>
        {label}
      </label>
      {children}
      {error && (
        <p className="field__error" id={`${fieldId(name)}-error`}>
          <AlertIcon size={15} />
          {error}
        </p>
      )}
    </div>
  );
}

function OrderSummary({ items, itemCount, total }) {
  return (
    <aside className="panel order-summary" aria-labelledby="order-summary-title">
      <div className="order-summary__header">
        <h2 id="order-summary-title" className="panel__title">
          Order summary
        </h2>
        <Link to="/cart" className="text-link">
          Edit cart
        </Link>
      </div>

      <ul className="order-summary__items" role="list">
        {items.map((item) => (
          <li key={item.id} className="order-summary__item">
            <div className="order-summary__thumb">
              <ProductImage src={item.image} alt="" width={64} height={48} />
            </div>
            <div>
              <p className="order-summary__name">{item.name}</p>
              <p className="order-summary__qty">Qty {item.quantity}</p>
            </div>
            <p className="order-summary__price">{formatPrice(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>

      <div className="order-summary__total">
        <span>Total ({pluralize(itemCount, 'item')})</span>
        <strong>{formatPrice(total)}</strong>
      </div>
    </aside>
  );
}

function OrderConfirmation({ order }) {
  const { customer } = order;
  const headingRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="page">
      <section className="panel confirmation" aria-labelledby="confirmation-title">
        <div className="confirmation__icon">
          <CheckIcon size={38} />
        </div>
        <p className="confirmation__eyebrow">Order placed</p>
        <h1 id="confirmation-title" ref={headingRef} tabIndex={-1} className="confirmation__title">
          Thank you, {customer.name.split(/\s+/)[0]}!
        </h1>
        <p className="confirmation__text">
          We’ve received your order of {pluralize(order.itemCount, 'item')} totalling {formatPrice(order.total)}.
          Updates will be sent to <strong>{customer.email}</strong>.
        </p>

        <dl className="confirmation__details">
          <div>
            <dt>Student</dt>
            <dd>
              {customer.name}, {customer.studentClass}
            </dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{customer.phone}</dd>
          </div>
          <div>
            <dt>Deliver to</dt>
            <dd>{customer.address}</dd>
          </div>
        </dl>

        <Link to="/" className="btn btn--primary btn--lg">
          Continue shopping
        </Link>
      </section>
    </div>
  );
}

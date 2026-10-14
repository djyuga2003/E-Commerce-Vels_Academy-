import { MAX_QUANTITY_PER_ITEM } from '../config';
import { MinusIcon, PlusIcon } from './Icons';
import './QuantityStepper.css';

// −/+ control. Buttons use aria-disabled (not disabled) so keyboard focus stays put at the limits.
export default function QuantityStepper({ value, onChange, label, min = 1, max = MAX_QUANTITY_PER_ITEM }) {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <div className="stepper" role="group" aria-label={label}>
      <button
        type="button"
        className="stepper__button"
        aria-label="Decrease quantity"
        aria-disabled={!canDecrease}
        onClick={() => canDecrease && onChange(value - 1)}
      >
        <MinusIcon size={16} />
      </button>
      <output className="stepper__value" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className="stepper__button"
        aria-label="Increase quantity"
        aria-disabled={!canIncrease}
        onClick={() => canIncrease && onChange(value + 1)}
      >
        <PlusIcon size={16} />
      </button>
    </div>
  );
}

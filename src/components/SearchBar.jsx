import { useRef } from 'react';
import { CloseIcon, SearchIcon } from './Icons';
import './SearchBar.css';

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);

  function handleSubmit(event) {
    // Results filter as you type; Enter just closes the on-screen keyboard.
    event.preventDefault();
    inputRef.current?.blur();
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && value) {
      event.preventDefault();
      onChange('');
    }
  }

  function clear() {
    onChange('');
    inputRef.current?.focus();
  }

  return (
    <form className={`search${value ? ' search--has-value' : ''}`} role="search" onSubmit={handleSubmit}>
      <SearchIcon className="search__icon" size={20} />
      <input
        ref={inputRef}
        type="search"
        className="search__input"
        placeholder="Search notebooks, pens, bags…"
        aria-label="Search products"
        autoComplete="off"
        enterKeyHint="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      {value && (
        <button type="button" className="search__clear" aria-label="Clear search" onClick={clear}>
          <CloseIcon size={18} />
        </button>
      )}
    </form>
  );
}

import { SelectHTMLAttributes, ReactNode } from 'react';
import './Select.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function Select({ label, error, id, className = '', children, ...props }: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`select-wrapper ${className}`}>
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
        </label>
      )}
      <select id={selectId} className={`select ${error ? 'select--error' : ''}`} {...props}>
        {children}
      </select>
      {error && (
        <span className="select-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

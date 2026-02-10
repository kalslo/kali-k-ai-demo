import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Input } from '../../src/components/Input';
import { Select } from '../../src/components/Select';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies variant class', () => {
    render(<Button variant="secondary">test</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--secondary');
  });

  it('applies size class', () => {
    render(<Button size="large">test</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--large');
  });

  it('can be disabled', () => {
    render(<Button disabled>test</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

describe('Card', () => {
  it('renders with children', () => {
    render(<Card>card content</Card>);
    expect(screen.getByText(/card content/i)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('card', 'custom-class');
  });
});

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="test label" />);
    expect(screen.getByLabelText(/test label/i)).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Input error="error message" />);
    expect(screen.getByRole('alert')).toHaveTextContent(/error message/i);
  });

  it('associates label with input', () => {
    render(<Input label="username" id="username-input" />);
    const input = screen.getByLabelText(/username/i);
    expect(input).toHaveAttribute('id', 'username-input');
  });
});

describe('Select', () => {
  it('renders with label and options', () => {
    render(
      <Select label="test select">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    expect(screen.getByLabelText(/test select/i)).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(
      <Select error="error message">
        <option>Test</option>
      </Select>
    );
    expect(screen.getByRole('alert')).toHaveTextContent(/error message/i);
  });
});

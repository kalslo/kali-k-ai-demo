import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EnergyBar } from '../../src/components/EnergyBar';
import { FoodTracker } from '../../src/components/FoodTracker';
import { MoodSelector } from '../../src/components/MoodSelector';
import { StatsPanel } from '../../src/components/StatsPanel';
import { MoodState } from '../../src/types';

describe('EnergyBar', () => {
  it('renders with current energy value', () => {
    render(<EnergyBar energy={75} maxEnergy={100} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays correct aria-valuenow', () => {
    render(<EnergyBar energy={60} maxEnergy={100} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '60');
  });

  it('displays correct aria-valuemin and aria-valuemax', () => {
    render(<EnergyBar energy={50} maxEnergy={100} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
  });

  it('has accessible label', () => {
    render(<EnergyBar energy={80} maxEnergy={100} />);
    expect(screen.getByRole('progressbar', { name: /energy/i })).toBeInTheDocument();
  });

  it('applies good state class for energy >= 50', () => {
    const { container } = render(<EnergyBar energy={75} maxEnergy={100} />);
    const bar = container.querySelector('.energy-bar__fill');
    expect(bar).toHaveClass('energy-bar__fill--good');
  });

  it('applies warning state class for energy between 20-49', () => {
    const { container } = render(<EnergyBar energy={35} maxEnergy={100} />);
    const bar = container.querySelector('.energy-bar__fill');
    expect(bar).toHaveClass('energy-bar__fill--warning');
  });

  it('applies low state class for energy < 20', () => {
    const { container } = render(<EnergyBar energy={15} maxEnergy={100} />);
    const bar = container.querySelector('.energy-bar__fill');
    expect(bar).toHaveClass('energy-bar__fill--low');
  });

  it('displays percentage text', () => {
    render(<EnergyBar energy={60} maxEnergy={100} />);
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('calculates percentage correctly', () => {
    render(<EnergyBar energy={45} maxEnergy={90} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('handles zero energy', () => {
    render(<EnergyBar energy={0} maxEnergy={100} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('handles max energy', () => {
    render(<EnergyBar energy={100} maxEnergy={100} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('clamps negative energy to 0', () => {
    render(<EnergyBar energy={-10} maxEnergy={100} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
  });

  it('clamps energy above max', () => {
    render(<EnergyBar energy={120} maxEnergy={100} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '100');
  });

  it('handles NaN energy gracefully', () => {
    render(<EnergyBar energy={NaN} maxEnergy={100} />);
    const progressbar = screen.getByRole('progressbar');
    // NaN should be treated as 0
    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('handles NaN maxEnergy gracefully', () => {
    render(<EnergyBar energy={50} maxEnergy={NaN} />);
    const progressbar = screen.getByRole('progressbar');
    // Should default to maxEnergy of 100
    expect(progressbar).toHaveAttribute('aria-valuenow', '50');
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});

describe('FoodTracker', () => {
  it('renders with meals and snacks', () => {
    render(<FoodTracker meals={2} snacks={1} />);
    expect(screen.getByText(/food/i)).toBeInTheDocument();
  });

  it('displays correct number of meals consumed', () => {
    render(<FoodTracker meals={2} snacks={0} />);
    expect(screen.getByText(/2 meals/i)).toBeInTheDocument();
  });

  it('displays correct number of snacks consumed', () => {
    render(<FoodTracker meals={2} snacks={1} />);
    expect(screen.getByText(/1 snack/i)).toBeInTheDocument();
  });

  it('handles zero meals and snacks', () => {
    render(<FoodTracker meals={0} snacks={0} />);
    expect(screen.getByText(/0 meals/i)).toBeInTheDocument();
    expect(screen.getByText(/0 snacks/i)).toBeInTheDocument();
  });

  it('displays pluralization correctly for meals', () => {
    render(<FoodTracker meals={1} snacks={0} />);
    expect(screen.getByText(/1 meal · 0 snacks/i)).toBeInTheDocument();
  });

  it('displays pluralization correctly for snacks', () => {
    render(<FoodTracker meals={3} snacks={1} />);
    expect(screen.getByText(/3 meals/i)).toBeInTheDocument();
    expect(screen.getByText(/1 snack/i)).toBeInTheDocument();
  });

  it('shows visual indicators for meals goal', () => {
    const { container } = render(<FoodTracker meals={2} snacks={0} />);
    const mealIndicators = container.querySelectorAll('.food-tracker__meal-indicator');
    expect(mealIndicators).toHaveLength(3); // Should show 3 meal slots
  });

  it('marks completed meals visually', () => {
    const { container } = render(<FoodTracker meals={2} snacks={0} />);
    const completedMeals = container.querySelectorAll('.food-tracker__meal-indicator--completed');
    expect(completedMeals).toHaveLength(2);
  });

  it('shows visual indicator for snack goal', () => {
    const { container } = render(<FoodTracker meals={2} snacks={1} />);
    const snackIndicator = container.querySelector('.food-tracker__snack-indicator');
    expect(snackIndicator).toBeInTheDocument();
  });

  it('marks completed snack visually', () => {
    const { container } = render(<FoodTracker meals={3} snacks={1} />);
    const completedSnack = container.querySelector('.food-tracker__snack-indicator--completed');
    expect(completedSnack).toBeInTheDocument();
  });

  it('handles exceeding meal goal', () => {
    render(<FoodTracker meals={5} snacks={0} />);
    expect(screen.getByText(/5 meals/i)).toBeInTheDocument();
  });

  it('has accessible structure', () => {
    render(<FoodTracker meals={2} snacks={0} />);
    expect(screen.getByRole('region', { name: /food tracker/i })).toBeInTheDocument();
  });
});

describe('MoodSelector', () => {
  it('renders with current mood', () => {
    const onMoodChange = vi.fn();
    render(<MoodSelector mood={MoodState.Happy} onMoodChange={onMoodChange} />);
    expect(screen.getByText(/mood/i)).toBeInTheDocument();
  });

  it('displays all mood options', () => {
    const onMoodChange = vi.fn();
    render(<MoodSelector mood={MoodState.Neutral} onMoodChange={onMoodChange} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5); // 5 mood states
  });

  it('highlights current mood', () => {
    const onMoodChange = vi.fn();
    const { container } = render(
      <MoodSelector mood={MoodState.Happy} onMoodChange={onMoodChange} />
    );
    const activeButton = container.querySelector('.mood-selector__button--active');
    expect(activeButton).toBeInTheDocument();
  });

  it('calls onMoodChange when mood is selected', async () => {
    const user = userEvent.setup();
    const onMoodChange = vi.fn();
    render(<MoodSelector mood={MoodState.Neutral} onMoodChange={onMoodChange} />);

    const buttons = screen.getAllByRole('button');
    const firstButton = buttons[0];
    if (!firstButton) throw new Error('Button not found');
    await user.click(firstButton); // Click first mood option

    expect(onMoodChange).toHaveBeenCalledTimes(1);
  });

  it('passes correct mood state to onMoodChange', async () => {
    const user = userEvent.setup();
    const onMoodChange = vi.fn();
    render(<MoodSelector mood={MoodState.Neutral} onMoodChange={onMoodChange} />);

    const buttons = screen.getAllByRole('button');
    const veryHappyButton = buttons[4]; // VeryHappy (last option)
    if (!veryHappyButton) throw new Error('Button not found');
    await user.click(veryHappyButton);

    expect(onMoodChange).toHaveBeenCalledWith(MoodState.VeryHappy);
  });

  it('is keyboard accessible', async () => {
    const user = userEvent.setup();
    const onMoodChange = vi.fn();
    render(<MoodSelector mood={MoodState.Neutral} onMoodChange={onMoodChange} />);

    const buttons = screen.getAllByRole('button');
    const firstButton = buttons[0];
    if (!firstButton) throw new Error('Button not found');
    firstButton.focus();

    await user.keyboard('{Enter}');
    expect(onMoodChange).toHaveBeenCalledTimes(1);
  });

  it('has aria-label for each mood button', () => {
    const onMoodChange = vi.fn();
    render(<MoodSelector mood={MoodState.Neutral} onMoodChange={onMoodChange} />);

    expect(screen.getByRole('button', { name: 'sad' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'mad' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'neutral' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'happy' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'very happy' })).toBeInTheDocument();
  });

  it('has accessible group label', () => {
    const onMoodChange = vi.fn();
    render(<MoodSelector mood={MoodState.Happy} onMoodChange={onMoodChange} />);
    expect(screen.getByRole('group', { name: /mood selector/i })).toBeInTheDocument();
  });
});

describe('StatsPanel', () => {
  const mockStats = {
    energy: 75,
    meals: 2,
    snacks: 1,
    mood: MoodState.Happy,
  };

  it('renders all stat components', () => {
    const onMoodChange = vi.fn();
    render(<StatsPanel stats={mockStats} onMoodChange={onMoodChange} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument(); // EnergyBar
    expect(screen.getByRole('region', { name: /food tracker/i })).toBeInTheDocument(); // FoodTracker
    expect(screen.getByRole('group', { name: /mood selector/i })).toBeInTheDocument(); // MoodSelector
  });

  it('passes energy to EnergyBar', () => {
    const onMoodChange = vi.fn();
    render(<StatsPanel stats={mockStats} onMoodChange={onMoodChange} />);

    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '75');
  });

  it('passes meals and snacks to FoodTracker', () => {
    const onMoodChange = vi.fn();
    render(<StatsPanel stats={mockStats} onMoodChange={onMoodChange} />);

    expect(screen.getByText(/2 meals/i)).toBeInTheDocument();
    expect(screen.getByText(/1 snack/i)).toBeInTheDocument();
  });

  it('passes mood to MoodSelector', () => {
    const onMoodChange = vi.fn();
    const { container } = render(<StatsPanel stats={mockStats} onMoodChange={onMoodChange} />);

    const activeButton = container.querySelector('.mood-selector__button--active');
    expect(activeButton).toHaveAttribute('aria-label', 'happy');
  });

  it('calls onMoodChange when mood changes', async () => {
    const user = userEvent.setup();
    const onMoodChange = vi.fn();
    render(<StatsPanel stats={mockStats} onMoodChange={onMoodChange} />);

    const sadButton = screen.getByRole('button', { name: 'sad' });
    await user.click(sadButton);

    expect(onMoodChange).toHaveBeenCalledWith(MoodState.Sad);
  });

  it('has accessible structure with landmark', () => {
    const onMoodChange = vi.fn();
    const { container } = render(<StatsPanel stats={mockStats} onMoodChange={onMoodChange} />);

    const panel = container.querySelector('.stats-panel');
    expect(panel).toBeInTheDocument();
  });

  it('applies custom className if provided', () => {
    const onMoodChange = vi.fn();
    const { container } = render(
      <StatsPanel stats={mockStats} onMoodChange={onMoodChange} className="custom-class" />
    );

    const panel = container.querySelector('.stats-panel');
    expect(panel).toHaveClass('stats-panel', 'custom-class');
  });
});

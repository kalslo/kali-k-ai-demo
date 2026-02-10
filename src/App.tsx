import './App.css';
import { useStats } from './hooks/useStats';
import { StatsPanel } from './components/StatsPanel';
import { TimeBlockGrid } from './components/TimeBlockGrid';
import { DateNavigator } from './components/DateNavigator';
import { QuickActions } from './components/QuickActions';
import { MoodState } from './types';

function App() {
  const { stats, setMood } = useStats();

  const handleMoodChange = (mood: MoodState) => {
    setMood(mood);
  };

  return (
    <div className="app">
      <header>
        <div className="header__branding">
          <h1>window</h1>
          <p>plan your day!</p>
        </div>
        <DateNavigator />
      </header>
      <main>
        <StatsPanel stats={stats} onMoodChange={handleMoodChange} />
        <QuickActions />
        <section className="time-blocks-section">
          <h2>your day</h2>
          <TimeBlockGrid />
        </section>
      </main>
    </div>
  );
}

export default App;

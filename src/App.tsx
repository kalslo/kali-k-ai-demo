import './App.css';
import { useStats } from './hooks/useStats';
import { StatsPanel } from './components/StatsPanel';
import { TimeBlockGrid } from './components/TimeBlockGrid';
import { MoodState } from './types';

function App() {
  const { stats, setMood } = useStats();

  const handleMoodChange = (mood: MoodState) => {
    setMood(mood);
  };

  return (
    <div className="app">
      <header>
        <h1>window</h1>
        <p>your daily day planner</p>
      </header>
      <main>
        <StatsPanel stats={stats} onMoodChange={handleMoodChange} />
        <section className="time-blocks-section">
          <h2>your day</h2>
          <TimeBlockGrid />
        </section>
      </main>
    </div>
  );
}

export default App;

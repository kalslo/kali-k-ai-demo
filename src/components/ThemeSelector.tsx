import React, { useState } from 'react';
import './ThemeSelector.css';

const themes = [
  {
    id: 'minimalist',
    name: 'Minimalist Scandinavian',
    icon: '🤍',
    description: 'Clean & airy',
  },
  {
    id: 'warm',
    name: 'Warm Sunset',
    icon: '🌅',
    description: 'Cozy & inviting',
  },
  {
    id: 'glass',
    name: 'Frosted Glass',
    icon: '✨',
    description: 'Modern & premium',
  },
  {
    id: 'botanical',
    name: 'Botanical Green',
    icon: '🌿',
    description: 'Calm & natural',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    icon: '🌙',
    description: 'Sophisticated',
  },
  {
    id: 'bubblegum',
    name: 'Bubblegum Pop',
    icon: '🍬',
    description: 'Playful & fun',
  },
];

export const ThemeSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('botanical');

  const applyTheme = (themeId: string) => {
    // Remove all theme classes
    themes.forEach(theme => {
      document.body.classList.remove(`theme-${theme.id}`);
    });

    // Apply selected theme
    if (themeId !== 'current') {
      document.body.classList.add(`theme-${themeId}`);
    }

    setCurrentTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className="theme-selector">
      <button
        type="button"
        className="theme-selector__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Choose theme"
      >
        🎨 themes
      </button>

      {isOpen && (
        <div className="theme-selector__panel">
          <h3 className="theme-selector__title">choose a theme</h3>

          <div className="theme-selector__grid">
            <button
              type="button"
              className={`theme-selector__option ${currentTheme === 'current' ? 'active' : ''}`}
              onClick={() => applyTheme('current')}
            >
              <span className="theme-selector__icon">🪟</span>
              <div className="theme-selector__info">
                <div className="theme-selector__name">Current Window</div>
                <div className="theme-selector__desc">Default theme</div>
              </div>
            </button>

            {themes.map(theme => (
              <button
                key={theme.id}
                type="button"
                className={`theme-selector__option ${currentTheme === theme.id ? 'active' : ''}`}
                onClick={() => applyTheme(theme.id)}
              >
                <span className="theme-selector__icon">{theme.icon}</span>
                <div className="theme-selector__info">
                  <div className="theme-selector__name">{theme.name}</div>
                  <div className="theme-selector__desc">{theme.description}</div>
                </div>
              </button>
            ))}
          </div>

          <button type="button" className="theme-selector__close" onClick={() => setIsOpen(false)}>
            close
          </button>
        </div>
      )}
    </div>
  );
};

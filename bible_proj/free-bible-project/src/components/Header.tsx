import type { Theme } from '../hooks/useTheme';
import { ThemeToggle } from './ThemeToggle';
import './Header.css';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  onMenuClick: () => void;
  onNotesClick: () => void;
  notesCount: number;
}

export const Header = ({ theme, onToggleTheme, onMenuClick, onNotesClick, notesCount }: HeaderProps) => {
  const handleInfoClick = () => {
    window.location.href = '/about';
  };
  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="menu-button" 
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <h1 className="header-title">Bible Project</h1>
      </div>
      <div className="header-right">
        <button 
          className="notes-button" 
          onClick={onNotesClick}
          aria-label="View notes"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14 2 14 8 20 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="18" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="9" y1="15" x2="15" y2="15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {notesCount > 0 && <span className="notes-badge">{notesCount}</span>}
        </button>
        <button 
          className="info-button" 
          onClick={handleInfoClick}
          aria-label="About this project"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="#fff" />
            <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#222" fontFamily="Arial" fontWeight="bold">i</text>
          </svg>
        </button>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
};

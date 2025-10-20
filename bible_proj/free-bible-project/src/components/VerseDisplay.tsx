import { useState } from 'react';
import type { Verse } from '../types/bible';
import type { VerseNote } from '../types/notes';
import './VerseDisplay.css';

interface VerseDisplayProps {
  bookName: string;
  chapterNumber: number;
  verses: Verse[];
  version?: string;
  onAddNote?: (verse: Verse) => void;
  getNoteForVerse?: (bookName: string, chapter: number, verse: number) => VerseNote | undefined;
}

export const VerseDisplay = ({ 
  bookName, 
  chapterNumber, 
  verses, 
  version,
  onAddNote,
  getNoteForVerse
}: VerseDisplayProps) => {
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [hoveredVerse, setHoveredVerse] = useState<number | null>(null);

  const formatBookName = (book: string) => {
    // If book already has spaces (like "1 Samuel"), return as-is
    if (book.includes(' ')) return book;
    
    // Otherwise, convert "1Samuel" to "1 Samuel", "SongofSongs" to "Song of Songs"
    return book.replace(/([0-9])([A-Z])/g, '$1 $2')
               .replace(/([a-z])([A-Z])/g, '$1 $2');
  };

  const handleVerseClick = (verseNumber: number) => {
    setSelectedVerse(prev => prev === verseNumber ? null : verseNumber);
  };

  const handleAddNote = (verse: Verse) => {
    if (onAddNote) {
      onAddNote(verse);
    }
  };

  const hasNote = (verseNumber: number) => {
    if (getNoteForVerse) {
      return !!getNoteForVerse(bookName, chapterNumber, verseNumber);
    }
    return false;
  };

  return (
    <div className="verse-display">
      <div className="chapter-header">
        <div className="chapter-title-wrapper">
          <h1>{formatBookName(bookName)} {chapterNumber}</h1>
          {version && <span className="version-badge">{version}</span>}
        </div>
        <p className="verse-count">{verses.length} verses</p>
      </div>

      <div className="verses-container">
        {verses.map((verse) => (
          <div
            key={verse.verse}
            className={`verse-item ${selectedVerse === verse.verse ? 'highlighted' : ''} ${hasNote(verse.verse) ? 'has-note' : ''}`}
            onClick={() => handleVerseClick(verse.verse)}
            onMouseEnter={() => setHoveredVerse(verse.verse)}
            onMouseLeave={() => setHoveredVerse(null)}
          >
            <span className="verse-number">
              {verse.verse}
              {hasNote(verse.verse) && (
                <span className="note-indicator" title="Has note">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8" fill="none" stroke="white" strokeWidth="2"/>
                  </svg>
                </span>
              )}
            </span>
            <span className="verse-text">{verse.text}</span>
            {(hoveredVerse === verse.verse || selectedVerse === verse.verse) && onAddNote && (
              <button
                className="add-note-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddNote(verse);
                }}
                title={hasNote(verse.verse) ? "Edit note" : "Add note"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {hasNote(verse.verse) ? 'Edit' : 'Note'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

import { useState } from 'react';
import { ShareModal } from './ShareModal';
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
  const [shareModal, setShareModal] = useState<{ open: boolean; verse?: Verse } | null>(null);

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
            {(hoveredVerse === verse.verse || selectedVerse === verse.verse) && (
              <>
                {onAddNote && (
                  <button
                    className="add-note-btn verse-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddNote(verse);
                    }}
                    title={hasNote(verse.verse) ? "Edit note" : "Add note"}
                  >
                    {/* Note icon only, no text */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
                <button
                  className="share-verse-btn verse-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareModal({ open: true, verse });
                  }}
                  title="Share this verse"
                >
                  {/* Dove icon for share */}
                  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12c2.5-1.5 6.5-2 10-2s7.5 0.5 10 2c-2.5 1.5-6.5 2-10 2s-7.5-0.5-10-2z" opacity=".2"/>
                    <path d="M21 12c-2.5-1.5-6.5-2-10-2S3.5 10.5 1 12c2.5 1.5 6.5 2 10 2s7.5-0.5 10-2z" fill="#fff"/>
                    <path d="M12 2c1.5 2.5 2 6.5 2 10s-0.5 7.5-2 10c-1.5-2.5-2-6.5-2-10s0.5-7.5 2-10z" opacity=".2"/>
                    <path d="M12 21c1.5-2.5 2-6.5 2-10s-0.5-7.5-2-10c-1.5 2.5-2 6.5-2 10s0.5 7.5 2 10z" fill="#fff"/>
                    <path d="M12 12l6-6M12 12l-6-6" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}
      {shareModal?.open && shareModal.verse && (
        <ShareModal
          isOpen={true}
          onClose={() => setShareModal(null)}
          verseText={shareModal.verse.text}
          bookName={bookName}
          chapter={chapterNumber}
          verse={shareModal.verse.verse}
        />
      )}
          </div>
        ))}
      </div>
    </div>
  );
};

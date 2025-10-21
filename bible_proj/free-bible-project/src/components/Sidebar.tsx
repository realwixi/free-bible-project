import { useState, useMemo } from 'react';
import type { BibleVersion } from '../types/bible';
import { VersionSelector } from './VersionSelector';
import './Sidebar.css';

interface SidebarProps {
  books: Array<string> | Array<{ english: string; tamil: string }>;
  selectedBook: string;
  selectedChapter: number;
  chapterCount: number;
  currentVersion: BibleVersion;
  onBookSelect: (book: string) => void;
  onChapterSelect: (chapter: number) => void;
  onVersionChange: (version: BibleVersion) => void;
  isOpen: boolean;
  onClose: () => void;
  showTamil?: boolean;
}

export const Sidebar = ({
  books,
  selectedBook,
  selectedChapter,
  chapterCount,
  currentVersion,
  onBookSelect,
  onChapterSelect,
  onVersionChange,
  isOpen,
  onClose,
  showTamil
}: SidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = useMemo(() => {
    if (!searchTerm) return books;
    if (typeof books[0] === 'string') {
      return (books as string[]).filter(book =>
        book.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return (books as { english: string; tamil: string }[]).filter(book =>
        book.tamil.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.english.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }, [books, searchTerm]);

  const formatBookName = (book: string) => {
    // If book already has spaces (like "1 Samuel"), return as-is
    if (book.includes(' ')) return book;
    
    // Otherwise, convert "1Samuel" to "1 Samuel", "SongofSongs" to "Song of Songs"
    return book.replace(/([0-9])([A-Z])/g, '$1 $2')
               .replace(/([a-z])([A-Z])/g, '$1 $2');
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Bible Books</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close sidebar">
            ×
          </button>
        </div>

        <VersionSelector 
          currentVersion={currentVersion}
          onVersionChange={onVersionChange}
        />

        <div className="search-container">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="books-list">
          {filteredBooks.map((book) => {
            if (typeof book === 'string') {
              return (
                <div key={book} className="book-item">
                  <button
                    className={`book-button ${selectedBook === book ? 'active' : ''}`}
                    onClick={() => {
                      onBookSelect(book);
                      if (window.innerWidth < 768) onClose();
                    }}
                  >
                    {formatBookName(book)}
                  </button>
                </div>
              );
            } else {
              return (
                <div key={book.english} className="book-item">
                  <button
                    className={`book-button ${selectedBook === book.english ? 'active' : ''}`}
                    onClick={() => {
                      onBookSelect(book.english);
                      if (window.innerWidth < 768) onClose();
                    }}
                  >
                    {showTamil ? book.tamil.trim() : formatBookName(book.english)}
                  </button>
                </div>
              );
            }
          })}
        </div>

        {selectedBook && (
          <div className="chapters-section">
            <h3>Chapters</h3>
            <div className="chapters-grid">
              {Array.from({ length: chapterCount }, (_, i) => i + 1).map((chapter) => (
                <button
                  key={chapter}
                  className={`chapter-button ${selectedChapter === chapter ? 'active' : ''}`}
                  onClick={() => {
                    onChapterSelect(chapter);
                    if (window.innerWidth < 768) onClose();
                  }}
                >
                  {chapter}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

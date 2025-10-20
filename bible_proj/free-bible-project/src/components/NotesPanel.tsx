import { useState } from 'react';
import type { VerseNote } from '../types/notes';
import { WhatsAppModal } from './WhatsAppModal';
import './NotesPanel.css';

interface NotesPanelProps {
  notes: VerseNote[];
  isOpen: boolean;
  onClose: () => void;
  onEditNote: (note: VerseNote) => void;
  onDeleteNote: (id: string) => void;
  onClearAll: () => void;
}

export const NotesPanel = ({
  notes,
  isOpen,
  onClose,
  onEditNote,
  onDeleteNote,
  onClearAll,
}: NotesPanelProps) => {
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const formatBookName = (book: string) => {
    if (book.includes(' ')) return book;
    return book.replace(/([0-9])([A-Z])/g, '$1 $2')
               .replace(/([a-z])([A-Z])/g, '$1 $2');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sortedNotes = [...notes].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <>
      {isOpen && <div className="notes-overlay" onClick={onClose} />}
      <div className={`notes-panel ${isOpen ? 'open' : ''}`}>
        <div className="notes-panel-header">
          <h2>My Notes</h2>
          <button className="close-notes-btn" onClick={onClose} aria-label="Close notes">
            ×
          </button>
        </div>

        <div className="notes-panel-actions">
          <button
            className="send-notes-btn"
            onClick={() => setShowWhatsAppModal(true)}
            disabled={notes.length === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 2L11 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Send to WhatsApp
          </button>
          <button
            className="clear-notes-btn"
            onClick={onClearAll}
            disabled={notes.length === 0}
          >
            Clear All
          </button>
        </div>

        <div className="notes-list">
          {notes.length === 0 ? (
            <div className="notes-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="18" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="9" y1="15" x2="15" y2="15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>No notes yet</p>
              <span>Click on any verse to add a note</span>
            </div>
          ) : (
            sortedNotes.map((note) => (
              <div key={note.id} className="note-card">
                <div className="note-card-header">
                  <div className="note-reference">
                    {formatBookName(note.bookName)} {note.chapter}:{note.verse}
                    <span className="note-version-badge">{note.version}</span>
                  </div>
                  <div className="note-card-actions">
                    <button
                      className="note-edit-icon-btn"
                      onClick={() => onEditNote(note)}
                      aria-label="Edit note"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      className="note-delete-icon-btn"
                      onClick={() => onDeleteNote(note.id)}
                      aria-label="Delete note"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="3 6 5 6 21 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="note-verse">{note.verseText}</p>
                <p className="note-text">{note.note}</p>
                <div className="note-timestamp">{formatDate(note.timestamp)}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <WhatsAppModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        notes={notes}
      />
    </>
  );
};

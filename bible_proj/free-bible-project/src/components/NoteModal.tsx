import { useState, useEffect } from 'react';
import type { VerseNote } from '../types/notes';
import './NoteModal.css';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookName: string;
  chapter: number;
  verse: number;
  verseText: string;
  version: string;
  existingNote?: VerseNote;
  onSave: (noteText: string) => void;
  onDelete?: () => void;
}

export const NoteModal = ({
  isOpen,
  onClose,
  bookName,
  chapter,
  verse,
  verseText,
  version,
  existingNote,
  onSave,
  onDelete,
}: NoteModalProps) => {
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (existingNote) {
      setNoteText(existingNote.note);
    } else {
      setNoteText('');
    }
  }, [existingNote, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    // Allow saving even without text - saves the verse reference
    onSave(noteText.trim());
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  const formatBookName = (book: string) => {
    if (book.includes(' ')) return book;
    return book.replace(/([0-9])([A-Z])/g, '$1 $2')
               .replace(/([a-z])([A-Z])/g, '$1 $2');
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="note-modal">
        <div className="note-modal-header">
          <h3>
            {existingNote ? 'Edit Note' : 'Add Note'}
          </h3>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="note-modal-verse">
          <div className="note-verse-reference">
            {formatBookName(bookName)} {chapter}:{verse} <span className="note-version-tag">({version})</span>
          </div>
          <p className="note-verse-text">{verseText}</p>
        </div>

        <div className="note-modal-body">
          <label htmlFor="note-input" className="note-label">
            Your Note <span className="optional-hint">(optional)</span>
          </label>
          <textarea
            id="note-input"
            className="note-textarea"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add your thoughts, reflections, or leave empty to just save the verse..."
            rows={6}
            autoFocus
          />
        </div>

        <div className="note-modal-footer">
          <div className="note-modal-actions-left">
            {existingNote && onDelete && (
              <button className="note-delete-btn" onClick={handleDelete}>
                Delete Note
              </button>
            )}
          </div>
          <div className="note-modal-actions-right">
            <button className="note-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="note-save-btn" 
              onClick={handleSave}
            >
              {existingNote ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

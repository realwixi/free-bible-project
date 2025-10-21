import React from 'react';
import './ShareModal.css';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseText: string;
  bookName: string;
  chapter: number;
  verse: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, verseText, bookName, chapter, verse }) => {
  if (!isOpen) return null;

  const message = `${bookName} ${chapter}:${verse} - ${verseText}`;
  const encodedMessage = encodeURIComponent(message);

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={e => e.stopPropagation()}>
        <h3>Share Verse</h3>
        <p className="share-verse">{message}</p>
        <div className="share-buttons">
          <a
            href={`https://wa.me/?text=${encodedMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn whatsapp"
          >
            WhatsApp
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn twitter"
          >
            Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=&quote=${encodedMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn facebook"
          >
            Facebook
          </a>
          <button
            className="share-btn copy"
            onClick={() => {
              navigator.clipboard.writeText(message);
              alert('Verse copied to clipboard!');
            }}
          >
            Copy
          </button>
        </div>
        <button className="close-share-modal" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

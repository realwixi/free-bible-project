import { useState } from 'react';
import type { VerseNote } from '../types/notes';
import { COUNTRY_CODES } from '../types/notes';
import './WhatsAppModal.css';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: VerseNote[];
}

export const WhatsAppModal = ({ isOpen, onClose, notes }: WhatsAppModalProps) => {
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const formatBookName = (book: string) => {
    if (book.includes(' ')) return book;
    return book.replace(/([0-9])([A-Z])/g, '$1 $2')
               .replace(/([a-z])([A-Z])/g, '$1 $2');
  };

  const generateMessage = () => {
    let message = '📖 *My Bible Study Notes*\n\n';
    
    notes.forEach((note, index) => {
      message += `${index + 1}. *${formatBookName(note.bookName)} ${note.chapter}:${note.verse}* (${note.version})\n`;
      message += `"${note.verseText}"\n\n`;
      message += `💭 ${note.note}\n`;
      message += `───────────────\n\n`;
    });

    message += `\n🙏 Generated from Bible Reader App`;
    return encodeURIComponent(message);
  };

  const handleSend = () => {
    if (!phoneNumber.trim()) {
      alert('Please enter your phone number');
      return;
    }

    // Remove any spaces, dashes, or parentheses from phone number
    const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Validate phone number (basic validation)
    if (!/^\d+$/.test(cleanNumber)) {
      alert('Please enter a valid phone number (digits only)');
      return;
    }

    setIsSending(true);

    // Construct WhatsApp URL
    const fullNumber = `${countryCode}${cleanNumber}`;
    const message = generateMessage();
    const whatsappUrl = `https://wa.me/${fullNumber}?text=${message}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    setTimeout(() => {
      setIsSending(false);
      setPhoneNumber('');
      onClose();
    }, 1000);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="whatsapp-modal">
        <div className="whatsapp-modal-header">
          <h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Send Notes to WhatsApp
          </h3>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="whatsapp-modal-body">
          <p className="whatsapp-description">
            Enter your WhatsApp number to send your Bible study notes to yourself.
          </p>

          <div className="phone-input-group">
            <label htmlFor="country-code" className="input-label">Country Code</label>
            <select
              id="country-code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="country-select"
            >
              {COUNTRY_CODES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.country} ({country.code})
                </option>
              ))}
            </select>
          </div>

          <div className="phone-input-group">
            <label htmlFor="phone-number" className="input-label">Phone Number</label>
            <div className="phone-input-wrapper">
              <span className="country-code-display">{countryCode}</span>
              <input
                id="phone-number"
                type="tel"
                className="phone-input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="1234567890"
                autoFocus
              />
            </div>
            <span className="input-hint">Enter number without country code</span>
          </div>

          <div className="notes-preview">
            <strong>Preview:</strong>
            <p className="preview-text">{notes.length} note(s) will be sent</p>
          </div>
        </div>

        <div className="whatsapp-modal-footer">
          <button className="whatsapp-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="whatsapp-send-btn" 
            onClick={handleSend}
            disabled={!phoneNumber.trim() || isSending}
          >
            {isSending ? 'Opening WhatsApp...' : 'Send via WhatsApp'}
          </button>
        </div>
      </div>
    </>
  );
};

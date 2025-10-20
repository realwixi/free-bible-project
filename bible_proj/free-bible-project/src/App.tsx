import { useState, useEffect } from 'react';
import type { Book, BibleVersion, Verse } from './types/bible';
import type { VerseNote } from './types/notes';
import { parseKJVCsv, getBookFromKJV, getKJVBooksList } from './utils/csvParser';
import { useTheme } from './hooks/useTheme';
import { useNotes } from './hooks/useNotes';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { VerseDisplay } from './components/VerseDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { NoteModal } from './components/NoteModal';
import { NotesPanel } from './components/NotesPanel';
import './App.css';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { notes, addNote, updateNote, deleteNote, getNoteForVerse, clearAllNotes } = useNotes();
  const [version, setVersion] = useState<BibleVersion>('KJV');
  const [books, setBooks] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [bookData, setBookData] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [kjvData, setKjvData] = useState<Map<string, Book> | null>(null);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [notesPanelOpen, setNotesPanelOpen] = useState(false);
  const [selectedVerseForNote, setSelectedVerseForNote] = useState<{
    verse: Verse;
    bookName: string;
    chapter: number;
  } | null>(null);

  // Load KJV data once on mount
  useEffect(() => {
    const loadKJV = async () => {
      try {
        const response = await fetch('/bible/bible_kjv.csv');
        const csvText = await response.text();
        const parsed = await parseKJVCsv(csvText);
        setKjvData(parsed);
      } catch (error) {
        console.error('Error loading KJV data:', error);
      }
    };

    loadKJV();
  }, []);

  // Load books list based on version
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        if (version === 'KJV' && kjvData) {
          const booksList = getKJVBooksList(kjvData);
          setBooks(booksList);
          setSelectedBook(booksList[0]);
        } else if (version === 'NABRE') {
          const response = await fetch('/bible/bible-all-books.json');
          const data = await response.json();
          setBooks(data);
          setSelectedBook(data[0]);
        }
      } catch (error) {
        console.error('Error loading books:', error);
      } finally {
        setLoading(false);
      }
    };

    if (version === 'KJV' && !kjvData) {
      // Wait for KJV data to load
      return;
    }
    loadBooks();
  }, [version, kjvData]);

  // Load selected book data
  useEffect(() => {
    if (!selectedBook) return;

    const loadBookData = async () => {
      setLoading(true);
      try {
        if (version === 'KJV' && kjvData) {
          const book = getBookFromKJV(kjvData, selectedBook);
          if (book) {
            setBookData(book);
          }
        } else if (version === 'NABRE') {
          const response = await fetch(`/bible/books/${selectedBook}.json`);
          const data: Book = await response.json();
          setBookData(data);
        }
        setSelectedChapter(1); // Reset to chapter 1 when book changes
      } catch (error) {
        console.error('Error loading book data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookData();
  }, [selectedBook, version, kjvData]);

  const handleBookSelect = (book: string) => {
    setSelectedBook(book);
  };

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    // Scroll to top when chapter changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVersionChange = (newVersion: BibleVersion) => {
    setVersion(newVersion);
    setSelectedChapter(1);
  };

  const handleAddNote = (verse: Verse) => {
    setSelectedVerseForNote({
      verse,
      bookName: selectedBook,
      chapter: selectedChapter,
    });
    setNoteModalOpen(true);
  };

  const handleSaveNote = (noteText: string) => {
    if (!selectedVerseForNote) return;

    const existingNote = getNoteForVerse(
      selectedVerseForNote.bookName,
      selectedVerseForNote.chapter,
      selectedVerseForNote.verse.verse
    );

    if (existingNote) {
      updateNote(existingNote.id, noteText);
    } else {
      addNote({
        bookName: selectedVerseForNote.bookName,
        chapter: selectedVerseForNote.chapter,
        verse: selectedVerseForNote.verse.verse,
        verseText: selectedVerseForNote.verse.text,
        note: noteText,
        version,
      });
    }
  };

  const handleEditNoteFromPanel = (note: VerseNote) => {
    setSelectedVerseForNote({
      verse: { verse: note.verse, text: note.verseText },
      bookName: note.bookName,
      chapter: note.chapter,
    });
    setNoteModalOpen(true);
    setNotesPanelOpen(false);
  };

  const handleDeleteNoteFromModal = () => {
    if (!selectedVerseForNote) return;

    const existingNote = getNoteForVerse(
      selectedVerseForNote.bookName,
      selectedVerseForNote.chapter,
      selectedVerseForNote.verse.verse
    );

    if (existingNote) {
      deleteNote(existingNote.id);
    }
  };

  const handleClearAllNotes = () => {
    if (confirm(`Are you sure you want to delete all ${notes.length} notes?`)) {
      clearAllNotes();
    }
  };

  const currentChapter = bookData?.chapters.find(
    (ch) => ch.chapter === selectedChapter
  );

  if (loading && !bookData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <Header 
        theme={theme} 
        onToggleTheme={toggleTheme}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onNotesClick={() => setNotesPanelOpen(!notesPanelOpen)}
        notesCount={notes.length}
      />
      <Sidebar
        books={books}
        selectedBook={selectedBook}
        selectedChapter={selectedChapter}
        chapterCount={bookData?.chapters.length || 0}
        currentVersion={version}
        onBookSelect={handleBookSelect}
        onChapterSelect={handleChapterSelect}
        onVersionChange={handleVersionChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="main-content">
        {loading ? (
          <LoadingSpinner />
        ) : currentChapter ? (
          <VerseDisplay
            bookName={selectedBook}
            chapterNumber={selectedChapter}
            verses={currentChapter.verses}
            version={version}
            onAddNote={handleAddNote}
            getNoteForVerse={getNoteForVerse}
          />
        ) : (
          <div className="empty-state">
            <p>Select a book and chapter to begin reading</p>
          </div>
        )}
      </main>
      <NotesPanel
        notes={notes}
        isOpen={notesPanelOpen}
        onClose={() => setNotesPanelOpen(false)}
        onEditNote={handleEditNoteFromPanel}
        onDeleteNote={deleteNote}
        onClearAll={handleClearAllNotes}
      />
      {selectedVerseForNote && (
        <NoteModal
          isOpen={noteModalOpen}
          onClose={() => {
            setNoteModalOpen(false);
            setSelectedVerseForNote(null);
          }}
          bookName={selectedVerseForNote.bookName}
          chapter={selectedVerseForNote.chapter}
          verse={selectedVerseForNote.verse.verse}
          verseText={selectedVerseForNote.verse.text}
          version={version}
          existingNote={getNoteForVerse(
            selectedVerseForNote.bookName,
            selectedVerseForNote.chapter,
            selectedVerseForNote.verse.verse
          )}
          onSave={handleSaveNote}
          onDelete={handleDeleteNoteFromModal}
        />
      )}
    </div>
  );
}

export default App;

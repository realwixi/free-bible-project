import { useState, useEffect } from 'react';
import type { VerseNote } from '../types/notes';

const STORAGE_KEY = 'bible-notes';

export const useNotes = () => {
  const [notes, setNotes] = useState<VerseNote[]>([]);

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }
  }, []);

  const saveNotes = (updatedNotes: VerseNote[]) => {
    setNotes(updatedNotes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  const addNote = (note: Omit<VerseNote, 'id' | 'timestamp'>) => {
    const newNote: VerseNote = {
      ...note,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };
    saveNotes([...notes, newNote]);
  };

  const updateNote = (id: string, noteText: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, note: noteText, timestamp: Date.now() } : note
    );
    saveNotes(updatedNotes);
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(note => note.id !== id));
  };

  const getNoteForVerse = (bookName: string, chapter: number, verse: number) => {
    return notes.find(
      note => note.bookName === bookName && note.chapter === chapter && note.verse === verse
    );
  };

  const clearAllNotes = () => {
    saveNotes([]);
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNoteForVerse,
    clearAllNotes,
  };
};

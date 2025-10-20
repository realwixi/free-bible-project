import type { Book } from '../types/bible';

export const parseKJVCsv = async (csvText: string): Promise<Map<string, Book>> => {
  const lines = csvText.split('\n');
  const booksMap = new Map<string, Book>();

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by comma, but be careful with quoted text
    const parts: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current); // Add the last part

    // Validate we have at least 5 parts (citation, book, chapter, verse, text)
    if (parts.length < 5) continue;

    const bookName = parts[1].trim();
    const chapter = parseInt(parts[2].trim(), 10);
    const verse = parseInt(parts[3].trim(), 10);
    const text = parts[4].trim();

    if (!bookName || isNaN(chapter) || isNaN(verse)) continue;

    // Get or create book
    let book = booksMap.get(bookName);
    if (!book) {
      book = {
        book: bookName,
        chapters: []
      };
      booksMap.set(bookName, book);
    }

    // Get or create chapter
    let chapterObj = book.chapters.find(ch => ch.chapter === chapter);
    if (!chapterObj) {
      chapterObj = {
        chapter,
        verses: []
      };
      book.chapters.push(chapterObj);
    }

    // Add verse
    chapterObj.verses.push({
      verse,
      text: text.replace(/\n/g, ' ').trim() // Remove newlines from text
    });
  }

  // Sort chapters and verses for each book
  booksMap.forEach(book => {
    book.chapters.sort((a, b) => a.chapter - b.chapter);
    book.chapters.forEach(chapter => {
      chapter.verses.sort((a, b) => a.verse - b.verse);
    });
  });

  return booksMap;
};

export const getBookFromKJV = (booksMap: Map<string, Book>, bookName: string): Book | null => {
  return booksMap.get(bookName) || null;
};

export const getKJVBooksList = (booksMap: Map<string, Book>): string[] => {
  return Array.from(booksMap.keys());
};

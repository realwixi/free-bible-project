export interface Verse {
  verse: number;
  text: string;
}

export interface Chapter {
  chapter: number;
  verses: Verse[];
}

export interface Book {
  book: string;
  chapters: Chapter[];
}

export type BibleVersion = 'KJV' | 'NABRE';

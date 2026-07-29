import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface JournalEntry {
  id: string;
  chapterId: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface Chapter {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

interface JournalContextType {
  chapters: Chapter[];
  currentChapterId: string | null;
  currentEntry: JournalEntry | null;
  penColor: 'black' | 'blue';
  createChapter: (title: string) => Promise<void>;
  deleteChapter: (id: string) => Promise<void>;
  setCurrentChapter: (id: string) => Promise<void>;
  updateEntry: (content: string) => Promise<void>;
  setPenColor: (color: 'black' | 'blue') => Promise<void>;
  isLoading: boolean;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

const CHAPTERS_KEY = '@journel_x_chapters';
const ENTRIES_KEY = '@journel_x_entries';
const CURRENT_CHAPTER_KEY = '@journel_x_current_chapter';
const PEN_COLOR_KEY = '@journel_x_pen_color';

export function JournalProvider({ children }: { children: ReactNode }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [penColor, setPenColorState] = useState<'black' | 'blue'>('black');
  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [chaptersData, currentChapterData, penColorData] = await Promise.all([
          AsyncStorage.getItem(CHAPTERS_KEY),
          AsyncStorage.getItem(CURRENT_CHAPTER_KEY),
          AsyncStorage.getItem(PEN_COLOR_KEY),
        ]);

        const parsedChapters: Chapter[] = chaptersData ? JSON.parse(chaptersData) : [];
        setChapters(parsedChapters);

        const currentId = currentChapterData || (parsedChapters.length > 0 ? parsedChapters[0].id : null);
        setCurrentChapterId(currentId);

        if (penColorData) {
          setPenColorState(penColorData as 'black' | 'blue');
        }

        // Load current entry
        if (currentId) {
          await loadEntry(currentId);
        }
      } catch (error) {
        console.error('Error loading journal data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const loadEntry = async (chapterId: string) => {
    try {
      const entriesData = await AsyncStorage.getItem(ENTRIES_KEY);
      const entries: JournalEntry[] = entriesData ? JSON.parse(entriesData) : [];
      const entry = entries.find((e) => e.chapterId === chapterId);
      setCurrentEntry(entry || null);
    } catch (error) {
      console.error('Error loading entry:', error);
    }
  };

  const createChapter = async (title: string) => {
    try {
      const newChapter: Chapter = {
        id: Date.now().toString(),
        title,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const updatedChapters = [...chapters, newChapter];
      await AsyncStorage.setItem(CHAPTERS_KEY, JSON.stringify(updatedChapters));
      setChapters(updatedChapters);
      setCurrentChapterId(newChapter.id);
      setCurrentEntry(null);
    } catch (error) {
      console.error('Error creating chapter:', error);
    }
  };

  const deleteChapter = async (id: string) => {
    try {
      const updatedChapters = chapters.filter((c) => c.id !== id);
      await AsyncStorage.setItem(CHAPTERS_KEY, JSON.stringify(updatedChapters));
      setChapters(updatedChapters);

      // Remove associated entry
      const entriesData = await AsyncStorage.getItem(ENTRIES_KEY);
      const entries: JournalEntry[] = entriesData ? JSON.parse(entriesData) : [];
      const updatedEntries = entries.filter((e) => e.chapterId !== id);
      await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(updatedEntries));

      // Update current chapter
      if (currentChapterId === id) {
        const nextChapterId = updatedChapters.length > 0 ? updatedChapters[0].id : null;
        setCurrentChapterId(nextChapterId);
        if (nextChapterId) {
          await loadEntry(nextChapterId);
        } else {
          setCurrentEntry(null);
        }
      }
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };

  const setCurrentChapter = async (id: string) => {
    try {
      setCurrentChapterId(id);
      await AsyncStorage.setItem(CURRENT_CHAPTER_KEY, id);
      await loadEntry(id);
    } catch (error) {
      console.error('Error setting current chapter:', error);
    }
  };

  const updateEntry = async (content: string) => {
    if (!currentChapterId) return;

    try {
      const entriesData = await AsyncStorage.getItem(ENTRIES_KEY);
      const entries: JournalEntry[] = entriesData ? JSON.parse(entriesData) : [];

      let entry = entries.find((e) => e.chapterId === currentChapterId);

      if (entry) {
        entry.content = content;
        entry.updatedAt = Date.now();
      } else {
        entry = {
          id: Date.now().toString(),
          chapterId: currentChapterId,
          content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        entries.push(entry);
      }

      await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
      setCurrentEntry(entry);
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const setPenColor = async (color: 'black' | 'blue') => {
    try {
      setPenColorState(color);
      await AsyncStorage.setItem(PEN_COLOR_KEY, color);
    } catch (error) {
      console.error('Error setting pen color:', error);
    }
  };

  return (
    <JournalContext.Provider
      value={{
        chapters,
        currentChapterId,
        currentEntry,
        penColor,
        createChapter,
        deleteChapter,
        setCurrentChapter,
        updateEntry,
        setPenColor,
        isLoading,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
}

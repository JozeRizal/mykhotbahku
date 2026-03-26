import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sermon } from '../types';

interface SermonContextType {
  sermons: Sermon[];
  currentSermon: Sermon | null;
  setCurrentSermon: (sermon: Sermon | null) => void;
  saveSermon: (sermon: Sermon) => void;
  deleteSermon: (id: string) => void;
}

const SermonContext = createContext<SermonContextType | undefined>(undefined);

export const SermonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sermons, setSermons] = useState<Sermon[]>(() => {
    const saved = localStorage.getItem('khotbahku_sermons');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSermon, setCurrentSermon] = useState<Sermon | null>(null);

  useEffect(() => {
    localStorage.setItem('khotbahku_sermons', JSON.stringify(sermons));
  }, [sermons]);

  const saveSermon = (sermon: Sermon) => {
    setSermons(prev => {
      const index = prev.findIndex(s => s.id === sermon.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...sermon, updatedAt: Date.now() };
        return updated;
      }
      return [{ ...sermon, updatedAt: Date.now() }, ...prev];
    });
  };

  const deleteSermon = (id: string) => {
    setSermons(prev => prev.filter(s => s.id !== id));
  };

  return (
    <SermonContext.Provider value={{ sermons, currentSermon, setCurrentSermon, saveSermon, deleteSermon }}>
      {children}
    </SermonContext.Provider>
  );
};

export const useSermons = () => {
  const context = useContext(SermonContext);
  if (!context) throw new Error('useSermons must be used within SermonProvider');
  return context;
};

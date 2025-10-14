import React, { createContext, useState, useContext, useEffect } from 'react';

type CardData = {
  customerName: string; brand: string; carType: string;
  service: string; licensePlate: string; status: string; time: string;
} | null;

type DisplayContextType = {
  cards: CardData[];
  updateCard: (index: number, data: CardData) => void;
  removeCard: (index: number) => void;
};

const DisplayContext = createContext<DisplayContextType | undefined>(undefined);

export const DisplayProvider = ({ children }: { children: React.ReactNode }) => {
  const [cards, setCards] = useState<CardData[]>([null, null, null, null]);

  useEffect(() => {
    const stored = localStorage.getItem('dashboardSlots');
    if (stored) setCards(JSON.parse(stored));
  }, []);

  const updateStorage = (updated: CardData[]) => {
    setCards(updated);
    localStorage.setItem('dashboardSlots', JSON.stringify(updated));
  };

  const updateCard = (index: number, data: CardData) => {
    const updated = [...cards];
    updated[index] = data;
    updateStorage(updated);
  };

  const removeCard = (index: number) => {
    const updated = [...cards];
    updated[index] = null;
    updateStorage(updated);
  };

  return (
    <DisplayContext.Provider value={{ cards, updateCard, removeCard }}>
      {children}
    </DisplayContext.Provider>
  );
};

export const useDisplay = () => {
  const context = useContext(DisplayContext);
  if (!context) throw new Error('useDisplay must be used within DisplayProvider');
  return context;
};
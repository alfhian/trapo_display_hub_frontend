import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext, useEffect } from 'react';
const DisplayContext = createContext(undefined);
export const DisplayProvider = ({ children }) => {
    const [cards, setCards] = useState([null, null, null, null]);
    useEffect(() => {
        const stored = localStorage.getItem('dashboardSlots');
        if (stored)
            setCards(JSON.parse(stored));
    }, []);
    const updateStorage = (updated) => {
        setCards(updated);
        localStorage.setItem('dashboardSlots', JSON.stringify(updated));
    };
    const updateCard = (index, data) => {
        const updated = [...cards];
        updated[index] = data;
        updateStorage(updated);
    };
    const removeCard = (index) => {
        const updated = [...cards];
        updated[index] = null;
        updateStorage(updated);
    };
    return (_jsx(DisplayContext.Provider, { value: { cards, updateCard, removeCard }, children: children }));
};
export const useDisplay = () => {
    const context = useContext(DisplayContext);
    if (!context)
        throw new Error('useDisplay must be used within DisplayProvider');
    return context;
};

// context/ActiveItemContext.tsx
"use client"
import { createContext, useContext, useState, ReactNode } from 'react';

interface ActiveItemContextProps {
    activeItem: string | null;
    setActiveItem: (item: string) => void;
    activeHeader: string | null;
    setActiveHeader: (item: string) => void;
}

const ActiveItemContext = createContext<ActiveItemContextProps | undefined>(undefined);

export const ActiveItemProvider = ({ children }: { children: ReactNode }) => {
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [activeHeader, setActiveHeader] = useState<string | null>(null);

    return (
        <ActiveItemContext.Provider value={{ activeItem, setActiveItem, activeHeader, setActiveHeader }}>
            {children}
        </ActiveItemContext.Provider>
    );
};

export const useActiveItem = () => {
    const context = useContext(ActiveItemContext);
    if (!context) {
        throw new Error('useActiveItem must be used within an ActiveItemProvider');
    }
    return context;
};

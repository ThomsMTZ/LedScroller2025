import {useCallback, useState} from 'react';

export interface MessageHistoryState {
    recentMessages: string[];
    favoriteMessages: string[];
}

const MAX_RECENT_MESSAGES = 5;

export const useMessageHistory = () => {
    const [recentMessages, setRecentMessages] = useState<string[]>([]);
    const [favoriteMessages, setFavoriteMessages] = useState<string[]>([]);

    const addToRecents = useCallback((text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        setRecentMessages(prev => {
            if (favoriteMessages.includes(trimmed)) return prev;
            const filtered = prev.filter(msg => msg !== trimmed);
            return [trimmed, ...filtered].slice(0, MAX_RECENT_MESSAGES);
        });
    }, [favoriteMessages]);

    const toggleFavorite = useCallback((msg: string) => {
        setFavoriteMessages(prevFavorites => {
            const isFavorite = prevFavorites.includes(msg);
            if (isFavorite) {
                setRecentMessages(prev =>
                    [msg, ...prev.filter(r => r !== msg)].slice(0, MAX_RECENT_MESSAGES)
                );
                return prevFavorites.filter(f => f !== msg);
            } else {
                setRecentMessages(prev => prev.filter(r => r !== msg));
                return [msg, ...prevFavorites];
            }
        });
    }, []);

    const loadHistory = useCallback((saved: Partial<MessageHistoryState>) => {
        if (saved.recentMessages) setRecentMessages(saved.recentMessages);
        if (saved.favoriteMessages) setFavoriteMessages(saved.favoriteMessages);
    }, []);

    return {
        recentMessages,
        favoriteMessages,
        addToRecents,
        toggleFavorite,
        loadHistory,
    };
};

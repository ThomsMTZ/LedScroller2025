import {useCallback, useRef, useState} from 'react';

export interface MessageHistoryState {
    recentMessages: string[];
    favoriteMessages: string[];
}

const MAX_RECENT_MESSAGES = 5;

/**
 * Gère l'historique des messages (récents + favoris).
 *
 * Correction du bug de closure : `addToRecents` utilisait la valeur de
 * `favoriteMessages` capturée au moment du useCallback, ce qui pouvait mener
 * à des états incohérents après un changement de favoris. On utilise désormais
 * un `useRef` pour toujours accéder à la valeur courante sans recréer le callback.
 */
export const useMessageHistory = () => {
    const [recentMessages, setRecentMessages] = useState<string[]>([]);
    const [favoriteMessages, setFavoriteMessages] = useState<string[]>([]);

    // Ref pour accéder à la valeur courante dans les callbacks sans dépendance
    const favoriteMessagesRef = useRef(favoriteMessages);
    favoriteMessagesRef.current = favoriteMessages;

    const addToRecents = useCallback((text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        // Lecture via ref : toujours la valeur courante, sans recréer le callback
        if (favoriteMessagesRef.current.includes(trimmed)) return;
        setRecentMessages(prev => {
            const filtered = prev.filter(msg => msg !== trimmed);
            return [trimmed, ...filtered].slice(0, MAX_RECENT_MESSAGES);
        });
    }, []); // Dépendances vides : stable sur toute la durée de vie du composant

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

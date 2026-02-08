import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'timetable_notes';

export default function useNotes() {
    const [notes, setNotes] = useState({});
    const [loading, setLoading] = useState(true);

    // Load notes on mount
    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setNotes(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load notes", e);
        } finally {
            setLoading(false);
        }
    };

    const saveNote = useCallback(async (date, courseId, text) => {
        try {
            setNotes(prev => {
                const updated = {
                    ...prev,
                    [date]: {
                        ...(prev[date] || {}),
                        [courseId]: text
                    }
                };

                // Fire and forget storage update
                AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                return updated;
            });
        } catch (e) {
            console.error("Failed to save note", e);
        }
    }, []);

    const getNote = useCallback((date, courseId) => {
        return notes[date]?.[courseId] || '';
    }, [notes]);

    return { notes, loading, saveNote, getNote, refreshNotes: loadNotes };
}

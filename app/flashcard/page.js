'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useSearchParams } from 'next/navigation';
import { Container, Grid, Typography, Box, CircularProgress } from '@mui/material';
import FlashcardItem from './FlashcardItem';

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
        async function getFlashcard() {
            if (!search) {
                setError('Invalid search parameter.');
                setLoading(false);
                return;
            }

            if (!user) return;

            setLoading(true);
            setError(null);

            try {
                const colRef = collection(db, 'users', user.id, 'flashcards');
                const docsSnapshot = await getDocs(colRef);
                const flashcardsData = [];

                docsSnapshot.forEach((doc) => {
                    flashcardsData.push({ id: doc.id, ...doc.data() });
                });

                setFlashcards(flashcardsData);
            } catch (error) {
                console.error('Error fetching flashcards:', error);
                if (error.code === 'permission-denied') {
                    setError('You do not have permission to access these flashcards.');
                } else {
                    setError('Failed to load flashcards. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        }

        if (user && search) {
            getFlashcard();
        }
    }, [user, search]);

    const handleCardClick = useCallback((id) => {
        setFlipped(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    }, []);

    if (!isLoaded || !isSignedIn) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h6" align="center" sx={{ mt: 4, color: 'red' }}>
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="100vw">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.length > 0 ? (
                    flashcards.map((flashcard) => (
                        <FlashcardItem
                            key={flashcard.id}
                            flashcard={flashcard}
                            flipped={flipped[flashcard.id]}
                            handleCardClick={handleCardClick}
                        />
                    ))
                ) : (
                    <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                        No flashcards available.
                    </Typography>
                )}
            </Grid>
        </Container>
    );
}

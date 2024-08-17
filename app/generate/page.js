'use client';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Typography, Box, CircularProgress, IconButton, Card, CardContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { generateQuizFromFlashcards } from '../quiz/generation'; // Import the quiz generation function

export default function GenerateFlashcards() {
    const [flashcards, setFlashcards] = useState([{ front: '', back: '' }]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFrontChange = (index, event) => {
        const newFlashcards = [...flashcards];
        newFlashcards[index].front = event.target.value;
        setFlashcards(newFlashcards);
    };

    const handleBackChange = (index, event) => {
        const newFlashcards = [...flashcards];
        newFlashcards[index].back = event.target.value;
        setFlashcards(newFlashcards);
    };

    const handleAddFlashcard = () => {
        setFlashcards([...flashcards, { front: '', back: '' }]);
    };

    const handleRemoveFlashcard = (index) => {
        const newFlashcards = flashcards.filter((_, i) => i !== index);
        setFlashcards(newFlashcards);
    };

    const handleSaveFlashcards = async () => {
        if (!name.trim()) {
            alert("Please enter a name");
            return;
        }

        setLoading(true);
        try {
            const flashcardSetId = uuidv4(); // Generate a unique ID for the new flashcard set
            const flashcardsData = { name, flashcards };

            // Save the flashcard set with its ID
            await setDoc(doc(db, 'flashcard_sets', flashcardSetId), flashcardsData);

            // Generate a quiz for the flashcard set
            await generateQuizFromFlashcards(flashcards, flashcardSetId);

            alert('Flashcards and quiz saved successfully!');
            router.push(`/quiz?setId=${flashcardSetId}`); // Redirect to the quiz page with the flashcard set ID
        } catch (error) {
            console.error('Error saving flashcards:', error);
            alert('Error saving flashcards');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>Generate Flashcards</Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                <Box>
                    <TextField
                        label="Collection Name"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    {flashcards.map((flashcard, index) => (
                        <Card key={index} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Flashcard {index + 1}
                                </Typography>
                                <TextField
                                    label="Front"
                                    variant="outlined"
                                    fullWidth
                                    value={flashcard.front}
                                    onChange={(e) => handleFrontChange(index, e)}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Back"
                                    variant="outlined"
                                    fullWidth
                                    value={flashcard.back}
                                    onChange={(e) => handleBackChange(index, e)}
                                    sx={{ mb: 1 }}
                                />
                                <IconButton onClick={() => handleRemoveFlashcard(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardContent>
                        </Card>
                    ))}
                    <Button variant="contained" onClick={handleAddFlashcard} sx={{ mr: 2 }}>
                    Add Flashcard
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSaveFlashcards}>
                    Save Flashcards
                    </Button>
                </Box>
            )}
        </Container>
    );
}
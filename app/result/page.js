'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, CircularProgress, Typography, Box } from '@mui/material';

const ResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');

    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) {
                setError('Invalid session ID');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/checkout_session?session_id=${session_id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch session data');
                }
                const sessionData = await res.json();
                setSession(sessionData);
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchCheckoutSession();
    }, [session_id]);

    if (loading) {
        return (
            <Container maxWidth="100vw" sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress />
                <Typography variant="h6">Loading...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="100vw" sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h4">Error: {error}</Typography>
                <Typography variant="body1">
                    Please try again or contact support if the problem persists.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="100vw" sx={{ textAlign: 'center', mt: 4 }}>
            {session?.payment_status === 'paid' ? (
                <>
                    <Typography variant="h4">Thank you for your purchase!</Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">Session ID: {session_id}</Typography>
                        <Typography variant="body1">
                            We have received your payment. You will receive an email with the order details shortly.
                        </Typography>
                    </Box>
                </>
            ) : (
                <Typography variant="h4">Payment not completed. Please try again or contact support.</Typography>
            )}
        </Container>
    );
};

export default ResultPage;

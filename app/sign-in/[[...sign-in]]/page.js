import { AppBar, Typography, Container, Button, Toolbar, Box } from '@mui/material';
import Link from 'next/link'; // Import Link from next/link
import { SignIn } from '@clerk/nextjs'; // Importing Clerk's SignIn component

export default function SignInPage() {
    return (
        <Container maxWidth="100vw" disableGutters>
            {/* AppBar for navigation */}
            <AppBar position="static" sx={{ backgroundColor: '#3f50b5' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Flashcard SaaS
                    </Typography>
                    <Link href="/sign-up" passHref>
                        <Button color="inherit">Sign Up</Button>
                    </Link>
                </Toolbar>
            </AppBar>

            {/* Centered sign-in form */}
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 8, minHeight: '100vh' }} // Ensure full height of viewport
            >
                <Typography variant="h4" gutterBottom>
                    Sign In
                </Typography>
                <SignIn />
            </Box>
        </Container>
    );
}

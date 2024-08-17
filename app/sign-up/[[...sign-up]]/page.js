import { AppBar, Typography, Container, Button, Toolbar, Box } from '@mui/material';
import Link from 'next/link'; // Import Link from next/link
import { SignUp } from '@clerk/nextjs'; // Importing Clerk's SignUp component

export default function SignUpPage() {
    return (
        <Container maxWidth="100vw" disableGutters>
            {/* AppBar for navigation */}
            <AppBar position="static" sx={{ backgroundColor: '#3f50b5' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Flashcard SaaS
                    </Typography>
                    <Link href="/sign-in" passHref>
                        <Button color="inherit">Sign In</Button>
                    </Link>
                </Toolbar>
            </AppBar>

            {/* Centered sign-up form */}
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 8, minHeight: '100vh' }} // Ensure full height of viewport
            >
                <Typography variant="h4" gutterBottom>
                    Sign Up
                </Typography>
                <SignUp />
            </Box>
        </Container>
    );
}

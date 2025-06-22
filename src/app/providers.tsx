'use client'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import Navbar from '../../components/navbar'
import Box from '@mui/material/Box'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <Navbar />
            <Box component="main" sx={{ p: 3 }}>
                {children}
            </Box>
        </ThemeProvider>
    )
}

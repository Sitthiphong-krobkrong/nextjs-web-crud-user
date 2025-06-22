'use client'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import PeopleIcon from '@mui/icons-material/People'
import HomeIcon from '@mui/icons-material/Home'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircle from '@mui/icons-material/AccountCircle'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Link from 'next/link'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

// const menuItems = [
//     { text: 'หน้าแรก', icon: <HomeIcon />, href: '/' },
//     { text: 'จัดการผู้ใช้', icon: <PeopleIcon />, href: '/manage-user' }
// ]

type JwtPayload = {
    user_fname?: string
    user_lname?: string
    [key: string]: any
}

export default function Navbar() {
    const [token, setToken] = useState<string | null>(null)
    const [userFullName, setUserFullname] = useState<string | null>(null)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const jwt = localStorage.getItem('jwt')
            setToken(jwt)
            if (jwt) {
                try {
                    const payload = jwtDecode<JwtPayload>(jwt)
                    const fullName = `${payload.user_fname || payload.firstName || ''} ${payload.user_lname || payload.lastName || ''}`.trim()
                    setUserFullname(fullName || null)
                } catch {
                    setUserFullname(null)
                }
            } else {
                setUserFullname(null)
            }
            window.addEventListener('storage', syncToken)
        }
        return () => window.removeEventListener('storage', syncToken)
    }, [])

    const syncToken = () => {
        const jwt = localStorage.getItem('jwt')
        setToken(jwt)
        if (jwt) {
            try {
                const payload = jwtDecode<JwtPayload>(jwt)
                const fullName = `${payload.user_fname || payload.firstName || ''} ${payload.user_lname || payload.lastName || ''}`.trim()
                setUserFullname(fullName || null)
            } catch {
                setUserFullname(null)
            }
        } else {
            setUserFullname(null)
        }
    }

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = () => {
        handleClose()
        Swal.fire({
            title: 'ต้องการออกจากระบบ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ออกจากระบบ',
            cancelButtonText: 'ยกเลิก'
        }).then(result => {
            if (result.isConfirmed) {
                localStorage.removeItem('jwt')
                window.dispatchEvent(new Event('storage'))
                setToken(null)
                setUserFullname(null)
                router.push('/login')
            }
        })
    }

    const handleUserManagePage = () => {
        handleClose()
        router.push('/manage-user')
    }

    const handleHomePage = () => {
        handleClose()
        router.push('/home')
    }

    return (
        <AppBar position="static" color="primary" enableColorOnDark>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    nextjs-crud-user
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {!token ? (
                        <IconButton
                            color="inherit"
                            component={Link}
                            href="/login"
                            sx={{ mx: 0.5 }}
                        >
                            <LoginIcon />
                            <Typography variant="body1" sx={{ ml: 0.5, display: { xs: 'none', sm: 'inline' } }}>
                                เข้าสู่ระบบ
                            </Typography>
                        </IconButton>
                    ) : (
                        <>
                            {/* {menuItems.map(item => (
                                <IconButton
                                    color="inherit"
                                    component={Link}
                                    href={item.href}
                                    key={item.text}
                                    sx={{ mx: 0.5 }}
                                >
                                    {item.icon}
                                    <Typography variant="body1" sx={{ ml: 0.5, display: { xs: 'none', sm: 'inline' } }}>
                                        {item.text}
                                    </Typography>
                                </IconButton>
                            ))} */}
                            {/* Dropdown Account */}
                            <IconButton
                                size="large"
                                edge="end"
                                color="inherit"
                                onClick={handleMenu}
                                sx={{ ml: 2 }}
                            >
                                <AccountCircle />
                                <Typography variant="body1" sx={{ ml: 1, display: { xs: 'none', sm: 'inline' } }}>
                                    {userFullName || '-'}
                                </Typography>
                                <ArrowDropDownIcon sx={{ ml: 0.2 }} />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                keepMounted
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                {/* เพิ่มเมนูอื่น ๆ ได้ */}
                                {/* <MenuItem onClick={handleClose}>โปรไฟล์</MenuItem> */}
                                <MenuItem onClick={handleHomePage}>
                                    <HomeIcon fontSize="small" sx={{ mr: 1 }} />
                                    หน้าแรก
                                </MenuItem>
                                <MenuItem onClick={handleUserManagePage}>
                                    <PeopleIcon fontSize="small" sx={{ mr: 1 }} />
                                    จัดการผู้ใช้
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                                    ออกจากระบบ
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}

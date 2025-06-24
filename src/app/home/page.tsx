'use client'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

type JwtPayload = {
    user_fname?: string
    user_lname?: string
    [key: string]: any
}

function getToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('jwt')
    }
    return null
}

export default function HomePage() {
    const [token, setToken] = useState<string | null>(null)
    const [userFullName, setUserFullname] = useState<string | null>(null)
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

    return (


        <div>
            <h1 className='text-2xl'>Welcome to HomePage คุณ{userFullName}</h1>
            {/* Other components or content can be added here */}
        </div>
    )
}
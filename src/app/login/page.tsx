'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Container, Typography, TextField, Button, Paper, Box, Alert
} from '@mui/material'
import axios from 'axios'
import apiConfig from '../config/env.json'

const apiBase = apiConfig.apiBase

export default function LoginPage() {
    const router = useRouter()
    const [form, setForm] = useState({ userName: '', passWord: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        if (!form.userName || !form.passWord) {
            setError('กรุณากรอกข้อมูลให้ครบ')
            return
        }
        try {
            const res = await axios.post(`${apiBase}/auth/login`, form)
            const token = res.data.data.token
            localStorage.setItem('jwt', token)
            setTimeout(() => {
                setSuccess('เข้าสู่ระบบสำเร็จ!')
                router.push('/home') // หรือ '/usercrud' ตามชื่อ path ที่คุณใช้
                window.dispatchEvent(new Event('storage')) // เพิ่มบรรทัดนี้!
            }, 1000)
        } catch (err: any) {
            setError(err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ')
        }
    }

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>เข้าสู่ระบบ</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="userName"
                        label="ชื่อผู้ใช้"
                        value={form.userName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="passWord"
                        label="รหัสผ่าน"
                        type="password"
                        value={form.passWord}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button type="submit" variant="contained" fullWidth>เข้าสู่ระบบ</Button>
                    </Box>
                </form>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            </Paper>
        </Container>
    )
}

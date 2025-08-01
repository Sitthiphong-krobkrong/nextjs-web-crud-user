'use client'
import {  useEffect, useState } from 'react'
import {
    Container, Typography, TextField, Button,
    Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Box, Alert
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { AddCircle } from '@mui/icons-material'
import apiConfig from '../config/env.json'
const apiBase = apiConfig.apiBase;

type User = {
    user_id: number
    user_fname: string
    user_lname: string
    user_name?: string
    user_pass?: string
}

function getToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('jwt')
    }
    return null
}

// helper สำหรับแนบ header ทุกครั้ง
function axiosAuth() {
    return axios.create({
        baseURL: apiBase,
        headers: {
            Authorization: 'Bearer ' + getToken()
        }
    })
}

export default function ManageUserPage() {
    const [users, setUsers] = useState<User[]>([])
    const [form, setForm] = useState<Partial<User>>({ user_fname: '', user_lname: '', user_id: undefined })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()
    useEffect(() => {
        // เช็ค token ที่ localStorage (เฉพาะฝั่ง client)
        const token = localStorage.getItem('jwt')
        if (!token) {
            Swal.fire({
                title: 'Unauthorized',
                text: 'กรุณาเข้าสู่ระบบก่อนใช้งาน',
                timer: 2000,
                icon: 'warning',
            }).finally(() => {
                router.replace('/login') // redirect ไปหน้า login
            })
        }
    }, [router])

    useEffect(() => {
        fetchUsers()
        // eslint-disable-next-line
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await axiosAuth().get('/user/users')
            if (res.data.data === undefined) throw new Error('Load user failed')
            setUsers(res.data.data)
        } catch (e: any) {
            setError(e.response?.data?.message || e.message)
        }
        setLoading(false)
    }

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        if (!form.user_fname || !form.user_lname) {
            setError('กรุณากรอกชื่อ-นามสกุลให้ครบ')
            return
        }
        try {
            if (form.user_id) {
                const confirmResult = await Swal.fire({
                    title: 'ยืนยันการอัปเดต?',
                    text: 'คุณต้องการอัปเดตข้อมูลผู้ใช้นี้หรือไม่',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'ใช่, อัปเดต!',
                    cancelButtonText: 'ยกเลิก'
                })
                if (!confirmResult.isConfirmed) return
                await axiosAuth().patch('/user/update', {
                    user_id: form.user_id,
                    user_name: form.user_name,
                    user_pass: form.user_pass,
                    user_fname: form.user_fname,
                    user_lname: form.user_lname
                })
                Swal.fire({
                    icon: 'success',
                    title: 'อัปเดตผู้ใช้สำเร็จ!',
                    confirmButtonText: 'ตกลง',
                });
                setSuccess('อัปเดตข้อมูลสำเร็จ')
            } else {
                const confirmResult = await Swal.fire({
                    title: 'ยืนยันการเพิ่ม?',
                    text: 'คุณต้องการเพิ่มข้อมูลผู้ใช้นี้หรือไม่',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'ใช่, เพิ่ม!',
                    cancelButtonText: 'ยกเลิก'
                })
                if (!confirmResult.isConfirmed) return
                await axiosAuth().post('/user/create', {
                    user_name: form.user_name,
                    user_pass: form.user_pass,
                    user_fname: form.user_fname,
                    user_lname: form.user_lname
                })
                Swal.fire({
                    icon: 'success',
                    title: 'เพิ่มผู้ใช้สำเร็จ!',
                    confirmButtonText: 'ตกลง',
                });
                setSuccess('เพิ่มผู้ใช้สำเร็จ')
            }
            setForm({ user_fname: '', user_lname: '', user_id: undefined })
            fetchUsers()
        } catch (e: any) {
            setError(e.response?.data?.message || 'บันทึกข้อมูลผิดพลาด')
        }
    }

    const handleEdit = (user: User) => {
        setForm(user)
        setSuccess('')
        setError('')
    }

    const handleDelete = async (user_id: number) => {
        Swal.fire({
            title: 'ยืนยันการลบ?',
            text: "คุณต้องการลบผู้ใช้นี้จริงหรือไม่",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosAuth().delete(`/user/delete/${user_id}`)
                    Swal.fire({
                        icon: 'success',
                        title: 'ลบผู้ใช้สำเร็จ!',
                    })
                    fetchUsers()
                } catch (e: any) {
                    Swal.fire({
                        icon: 'error',
                        title: 'ลบข้อมูลผิดพลาด',
                        text: e.response?.data?.message || 'ลบข้อมูลผิดพลาด'
                    })
                }
            }
        })
    }

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Typography variant="h4" gutterBottom>จัดการผู้ใช้งาน</Typography>
            <Paper sx={{ p: { xs: 1.5, sm: 3 }, mb: 3 }}>
            <form onSubmit={handleSubmit}>
                <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                    mb: 3
                }}
                >
                <TextField
                    name="user_name"
                    label="ชื่อผู้ใช้"
                    value={form.user_name || ''}
                    onChange={handleChange}
                    required
                    fullWidth
                    size="small"
                />
                <TextField
                    name="user_pass"
                    label="รหัสผ่านผู้ใช้"
                    value={form.user_pass || ''}
                    onChange={handleChange}
                    required
                    fullWidth
                    type="password"
                    size="small"
                />
                </Box>

                <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                    mb: 3
                }}
                >
                <TextField
                    name="user_fname"
                    label="ชื่อ"
                    value={form.user_fname || ''}
                    onChange={handleChange}
                    required
                    fullWidth
                    size="small"
                />
                <TextField
                    name="user_lname"
                    label="นามสกุล"
                    value={form.user_lname || ''}
                    onChange={handleChange}
                    required
                    fullWidth
                    size="small"
                />
                </Box>
                <Box
                sx={{
                    gridColumn: { xs: '1', sm: '1 / span 2' },
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    mt: 1
                }}
                >
                {
                    form.user_id ? (
                    <Button type="submit" variant="contained" color="primary" fullWidth={true} sx={{ minWidth: 120 }}>
                        <EditIcon sx={{ mr: 1 }} /> อัพเดทข้อมูล
                    </Button>
                    ) : (
                    <Button type="submit" variant="contained" color="success" fullWidth={true} sx={{ minWidth: 120 }}>
                        <AddCircle sx={{ mr: 1 }} /> เพิ่มข้อมูล
                    </Button>
                    )
                }

                {form.user_id && (
                    <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => setForm({ user_fname: '', user_lname: '', user_id: undefined })}
                    fullWidth={true}
                    sx={{ minWidth: 120 }}
                    >ยกเลิก</Button>
                )}
                </Box>
            </form>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            </Paper>
            <Paper sx={{ width: '100%', overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 600 }}>
                <TableHead>
                <TableRow>
                    <TableCell>ชื่อผู้ใช้</TableCell>
                    <TableCell>รหัสผ่าน</TableCell>
                    <TableCell>ชื่อจริง</TableCell>
                    <TableCell>นามสกุล</TableCell>
                    <TableCell align="center" width={120}>Action</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {users.map(u => (
                    <TableRow key={u.user_id}>
                    <TableCell sx={{ wordBreak: 'break-word' }}>{u.user_name}</TableCell>
                    <TableCell>{u.user_pass ? '******' : ''}</TableCell>
                    <TableCell sx={{ wordBreak: 'break-word' }}>{u.user_fname}</TableCell>
                    <TableCell sx={{ wordBreak: 'break-word' }}>{u.user_lname}</TableCell>
                    <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleEdit(u)} size="small"><EditIcon /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(u.user_id)} size="small"><DeleteIcon /></IconButton>
                    </TableCell>
                    </TableRow>
                ))}
                {users.length === 0 && (
                    <TableRow>
                    <TableCell colSpan={5} align="center">{loading ? "Loading..." : "No data"}</TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </Paper>
        </Container>
    )
}

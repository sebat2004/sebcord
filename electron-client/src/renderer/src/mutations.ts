import { useMutation } from 'react-query'
import { API_URL } from './constants'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'

interface LoginData {
    email: string
    password: string
}

interface RegistrationData {
    username: string
    email: string
    password: string
}

export const useRegister = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (user: RegistrationData) => {
            return fetch(`${API_URL}/user/register`, {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
        },
        onSuccess: async (response) => {
            const data = await response.json()
            console.log('Registration successful:', data)
            toast.success(`Welcome, ${data.username}!`)
            navigate('/home')
        },
        onError: (error) => {
            console.error('Registration failed:', error)
            toast.error('Registration failed. Please try again.')
        }
    })
}

export const useLogin = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (user: LoginData) => {
            return fetch(`${API_URL}/user/login`, {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
        },
        onSuccess: async (response) => {
            const data = await response.json()
            console.log('Login successful:', data)
            toast.success(`Welcome back, ${data.username}`)
            navigate('/home')
        },
        onError: (error) => {
            console.error('Login failed:', error)
            toast.error('Login failed. Please try again.')
        }
    })
}

export const useAuthenticated = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: () => {
            return fetch(`${API_URL}/user/authenticated`, {
                method: 'GET',
                credentials: 'include'
            })
        },
        onSuccess: async (response) => {
            const data = await response.json()
            console.log('Authenticated:', data)
        },
        onError: (error) => {
            console.error('Authentication failed:', error)
            navigate('/login')
            toast.error('You need to login first.')
        }
    })
}

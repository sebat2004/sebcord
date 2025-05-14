import { useMutation, useQueryClient } from 'react-query'
import { API_URL } from '../lib/constants'
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
        mutationFn: async (user: RegistrationData) => {
            const response = await fetch(`${API_URL}/user/register`, {
                method: 'POST',

                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error('Registration failed. Please check your credentials.')
            }

            const data = await response.json()

            return data
        },
        onSuccess: async (data) => {
            navigate('/home')
            toast.success(`Welcome, ${data.username}!`)
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
        mutationFn: async (user: LoginData) => {
            const response = await fetch(`${API_URL}/user/login`, {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error('Login failed. Please check your credentials.')
            }

            const data = await response.json()
            return data
        },
        onSuccess: async (data) => {
            navigate('/home')
            toast.success(`Welcome back, ${data.username}`)
        },
        onError: (error) => {
            console.error('Login failed:', error)
            toast.error(`${error}`)
        }
    })
}

export const useAddFriend = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (userId: string) => {
            const response = await fetch(`${API_URL}/friends/requests/${userId}`, {
                method: 'POST',
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error('Failed to send friend request')
            }
        },
        onSuccess: () => {
            toast.success('Friend request sent!')
            queryClient.invalidateQueries(['friendRequests'])
        },
        onError: (error) => {
            toast.error(`${error}`)
        }
    })
}

export const useRemoveFriend = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (userId: string) => {
            const response = await fetch(`${API_URL}/friends/${userId}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error('Failed to remove friend')
            }
        },
        onSuccess: () => {
            toast.success('Friend removed!')
            queryClient.invalidateQueries(['friends'])
            queryClient.invalidateQueries(['friendRequests'])
        },
        onError: (error) => {
            console.error('Failed to remove friend:', error)
            toast.error('Failed to remove friend.')
        }
    })
}

export const useAcceptFriendRequest = () => {
    return useMutation({
        mutationFn: async (userId: string) => {
            const response = await fetch(`${API_URL}/friends/requests/accept/${userId}`, {
                method: 'POST',
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error('Failed to accept friend request')
            }
        },
        onSuccess: () => {
            toast.success('Friend request accepted!')
        },
        onError: (error) => {
            toast.error(`${error}`)
        }
    })
}

import { useQuery } from 'react-query'
import { API_URL } from '../lib/constants'
import { FormattedUser, User } from '../types'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { formatUser } from '@/formatters/formatUser'
import { useUserStore } from '@/stores/useUserStore'

export const useGetUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/user`, {
                method: 'GET',
                credentials: 'include'
            })
            if (!response.ok) {
                throw new Error('Unable to fetch users')
            }
            const data = (await response.json()) as User[]

            data.forEach((user) => {
                user = formatUser(user)
            })

            return data as FormattedUser[]
        },
        refetchOnWindowFocus: false,
        refetchInterval: 10000
    })
}

interface AuthenticatedResponse {
    authenticated: boolean
    user?: FormattedUser
}

export const useGetAuthenticated = () => {
    const navigate = useNavigate()
    const { setUser } = useUserStore()

    return useQuery({
        queryKey: ['authenticated'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/user/authenticated`, {
                method: 'GET',
                credentials: 'include'
            })
            if (!response.ok) {
                throw new Error('Unauthorized')
            }

            const data = await response.json()
            if (!data.authenticated) {
                throw new Error('Not authenticated')
            }

            data.user = formatUser(data.user)
            setUser(data.user)
            return data as AuthenticatedResponse
        },
        onError: (error) => {
            console.error('Authentication failed:', error)

            navigate('/login')
            toast.error('You need to login first.')
        },
        refetchOnWindowFocus: false,
        refetchInterval: 5000,
        retry: false
    })
}

export const useGetFriends = () => {
    return useQuery({
        queryKey: ['friends'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/friends`, {
                method: 'GET',
                credentials: 'include'
            })
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()

            data.forEach((user) => {
                user = formatUser(user)
            })

            return data as FormattedUser[]
        },
        refetchOnWindowFocus: false,
        refetchInterval: 10000
    })
}

export const useGetFriendRequests = () => {
    return useQuery({
        queryKey: ['friendRequests'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/friends/requests`, {
                method: 'GET',
                credentials: 'include'
            })
            if (!response.ok) {
                throw new Error(await response.text())
            }

            const data = await response.json()
            data.forEach((user) => {
                user = formatUser(user)
            })
            return data as FormattedUser[]
        },
        refetchOnWindowFocus: false,
        refetchInterval: 10000
    })
}

export const useGetSentFriendRequests = () => {
    return useQuery({
        queryKey: ['sentFriendRequests'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/friends/requests/sent`, {
                method: 'GET',
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error(await response.text())
            }

            const data = await response.json()
            data.forEach((user) => {
                user = formatUser(user)
            })
            return data as User[]
        }
    })
}

export const useSearchUsers = (query: string | undefined) => {
    return useQuery({
        queryKey: ['searchUsers', query],
        queryFn: async () => {
            if (!query) {
                return []
            }

            const response = await fetch(`${API_URL}/user/search?query=${query}`, {
                method: 'GET',
                credentials: 'include'
            })
            if (!response.ok) {
                throw new Error('Unable to search for users')
            }

            const data = await response.json()
            data.forEach((user) => {
                user = formatUser(user)
            })
            return data as FormattedUser[]
        },
        refetchOnWindowFocus: false
    })
}

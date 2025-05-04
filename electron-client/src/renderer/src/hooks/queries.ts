import { useQuery } from 'react-query'
import { API_URL } from '../constants'
import { User } from '../types'

export const useGetUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/user`, {
                method: 'GET',
                credentials: 'include'
            })
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()

            return data as User[]
        },
        refetchOnWindowFocus: false,
        refetchInterval: 10000
    })
}

import { create } from 'zustand'
import { FormattedUser } from '../lib/types'

type UserState = {
    user: FormattedUser | null
    setUser: (user: FormattedUser) => void
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user })
}))

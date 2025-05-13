import { FormattedUser, User } from '@/types'

export const formatUser = (user: User): FormattedUser => {
    const formattedUser = {
        ...user,
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_activity_at: user.last_activity_at,
        active: false
    } as FormattedUser

    if (user.last_activity_at) {
        const lastActivityDate = new Date(user.last_activity_at)
        const now = new Date()
        const timeDiff = Math.abs(now.getTime() - lastActivityDate.getTime())
        const diffMinutes = Math.floor(timeDiff / (1000 * 60))
        formattedUser.active = diffMinutes < 5
    }

    return formattedUser as FormattedUser
}

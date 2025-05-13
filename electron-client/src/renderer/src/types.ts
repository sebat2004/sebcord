export interface User {
    id: string
    username: string
    email: string
    last_activity_at: Date
    created_at: Date
    updated_at: Date
}

export interface FormattedUser {
    id: string
    username: string
    email: string
    last_activity_at: Date
    created_at: Date
    updated_at: Date
    active: boolean
}

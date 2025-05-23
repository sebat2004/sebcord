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

export interface RequestCallEvent {
    callerId: string
    receiverId: string
    offer: RTCSessionDescriptionInit
}

export interface AcceptCallEvent {
    callerId: string
    receiverId: string
    answer: RTCSessionDescriptionInit
}

export interface IceEvent {
    callerId: string
    receiverId: string
    candidate: RTCIceCandidateInit
}

export interface CallInfo {
    callerId: string
    receiverId: string
}

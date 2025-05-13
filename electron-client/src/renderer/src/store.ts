// useCallStore.ts
import { create } from 'zustand'
import { FormattedUser, User } from './types'

type CallState = {
    localStream: MediaStream | null
    remoteStream: MediaStream | null
    peerConnection: RTCPeerConnection | null
    dataChannel: RTCDataChannel | null
    isCallActive: boolean
    setLocalStream: (stream: MediaStream) => void
    setRemoteStream: (stream: MediaStream) => void
    setPeerConnection: (connection: RTCPeerConnection) => void
    setDataChannel: (channel: RTCDataChannel) => void
    setIsCallActive: (isActive: boolean) => void
    resetCallState: () => void
}

export const useCallStore = create<CallState>((set) => ({
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    dataChannel: null,
    isCallActive: false,
    setLocalStream: (stream) => set({ localStream: stream }),
    setRemoteStream: (stream) => set({ remoteStream: stream }),
    setPeerConnection: (connection) => set({ peerConnection: connection }),
    setDataChannel: (channel) => set({ dataChannel: channel }),
    setIsCallActive: (isActive) => set({ isCallActive: isActive }),
    resetCallState: () =>
        set({
            localStream: null,
            remoteStream: null,
            peerConnection: null,
            dataChannel: null,
            isCallActive: false
        })
}))

type UserState = {
    user: FormattedUser | null
    setUser: (user: FormattedUser) => void
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user })
}))

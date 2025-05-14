import { RequestCallEvent } from '@/types'
import { create } from 'zustand'

type CallFn = (targetId: string) => Promise<void>
type EmptyFn = () => Promise<void> | void

interface CallStore {
    call: CallFn
    accept: EmptyFn
    hangup: EmptyFn
    decline: EmptyFn
    localStream?: MediaStream | null
    remoteStream?: MediaStream | null
    incomingCall?: RequestCallEvent | null
    connectionState?: RTCPeerConnectionState | null

    setCall: (fn: CallFn) => void
    setAccept: (fn: EmptyFn) => void
    setHangup: (fn: EmptyFn) => void
    setDecline: (fn: EmptyFn) => void
    setLocalStream: (stream: MediaStream | undefined | null) => void
    setRemoteStream: (stream: MediaStream | undefined | null) => void
    setIncomingCall: (incoming: RequestCallEvent | undefined | null) => void
    setConnectionState: (state: RTCPeerConnectionState | undefined | null) => void
}

export const useCallStore = create<CallStore>((set) => ({
    call: async () => {},
    accept: () => {},
    hangup: () => {},
    decline: () => {},
    localStream: undefined,
    remoteStream: undefined,
    incomingCall: {} as RequestCallEvent,
    connectionState: undefined,

    setCall: (fn) => set({ call: fn }),
    setAccept: (fn) => set({ accept: fn }),
    setHangup: (fn) => set({ hangup: fn }),
    setDecline: (fn) => set({ decline: fn }),
    setLocalStream: (stream) => set({ localStream: stream }),
    setRemoteStream: (stream) => set({ remoteStream: stream }),
    setIncomingCall: (incoming) => set({ incomingCall: incoming }),
    setConnectionState: (state) => set({ connectionState: state })
}))

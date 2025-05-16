import { CallInfo, RequestCallEvent } from '@/lib/types'
import { create } from 'zustand'

type CallFn = (targetId: string, audio: boolean, video: boolean) => Promise<void>
type EmptyFn = () => Promise<void> | void

interface CallStore {
    call: CallFn
    accept: EmptyFn
    hangup: EmptyFn
    decline: EmptyFn
    toggleAudio: () => void
    toggleVideo: EmptyFn
    localStream: MediaStream | null
    remoteStream: MediaStream | null
    incomingCall: RequestCallEvent | null
    connectionState: RTCPeerConnectionState | null
    callInfo: CallInfo | null
    micOn: boolean
    videoOn: boolean
    screenOn: boolean

    setCall: (fn: CallFn) => void
    setAccept: (fn: EmptyFn) => void
    setHangup: (fn: EmptyFn) => void
    setDecline: (fn: EmptyFn) => void
    setLocalStream: (stream: MediaStream | null) => void
    setRemoteStream: (stream: MediaStream | null) => void
    setIncomingCall: (incoming: RequestCallEvent | null) => void
    setConnectionState: (state: RTCPeerConnectionState | null) => void
    setCallInfo: (info: CallInfo | null) => void
}

export const useCallStore = create<CallStore>((set) => ({
    call: async () => {},
    accept: () => {},
    hangup: () => {},
    decline: () => {},
    toggleAudio: () => {
        set((state) => ({
            micOn: !state.micOn
        }))
    },
    toggleVideo: () => {
        set((state) => ({
            videoOn: !state.videoOn
        }))
    },
    localStream: null,
    remoteStream: null,
    incomingCall: {} as RequestCallEvent,
    connectionState: null,
    callInfo: {} as CallInfo,
    micOn: true,
    videoOn: false,
    screenOn: false,

    setCall: (fn) => set({ call: fn }),
    setAccept: (fn) => set({ accept: fn }),
    setHangup: (fn) => set({ hangup: fn }),
    setDecline: (fn) => set({ decline: fn }),
    setLocalStream: (stream) => set({ localStream: stream }),
    setRemoteStream: (stream) => set({ remoteStream: stream }),
    setIncomingCall: (incoming) => set({ incomingCall: incoming }),
    setConnectionState: (state) => set({ connectionState: state }),
    setCallInfo: (info) => set({ callInfo: info })
}))

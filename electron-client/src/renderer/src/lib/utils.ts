import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getCallStatusText(connectionState: RTCPeerConnectionState) {
    switch (connectionState) {
        case 'connecting':
            return 'Connecting...'
        case 'connected':
            return 'Connected'
        case 'disconnected':
            return 'Disconnected'
        case 'failed':
            return 'Failed'
    }
    return 'Idle'
}

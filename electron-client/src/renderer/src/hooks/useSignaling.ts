import { AcceptCallEvent, IceEvent, RequestCallEvent } from '@/types'
import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

type Callback<T> = (payload: T) => void

export function useSignaling() {
    const socketRef = useRef<Socket | null>(null)
    const [connected, setConnected] = useState(false)

    // Listener registries
    const callListeners = useRef<Callback<RequestCallEvent>[]>([])
    const answerListeners = useRef<Callback<AcceptCallEvent>[]>([])
    const iceListeners = useRef<Callback<IceEvent>[]>([])

    useEffect(() => {
        setConnected(true)
        const socket = io('http://localhost:5001', { withCredentials: true })
        socketRef.current = socket

        socket.on('connect', () => {
            setConnected(true)
        })
        socket.on('disconnect', () => {
            setConnected(false)
        })

        socket.on('callUser', (data: RequestCallEvent) => {
            callListeners.current.forEach((cb) => cb(data))
        })

        socket.on('acceptCall', (data: AcceptCallEvent) => {
            answerListeners.current.forEach((cb) => cb(data))
        })

        socket.on('iceCandidate', (data: IceEvent) => {
            iceListeners.current.forEach((cb) => cb(data))
        })

        return () => {
            socket.disconnect()
            socketRef.current = null
            setConnected(false)
        }
    }, [])

    const onCall = useCallback((cb: Callback<RequestCallEvent>) => {
        callListeners.current.push(cb)
        return () => {
            callListeners.current = callListeners.current.filter((fn) => fn !== cb)
        }
    }, [])

    const onAnswer = useCallback((cb: Callback<AcceptCallEvent>) => {
        answerListeners.current.push(cb)
        return () => {
            answerListeners.current = answerListeners.current.filter((fn) => fn !== cb)
        }
    }, [])

    const onIce = useCallback((cb: Callback<IceEvent>) => {
        iceListeners.current.push(cb)
        return () => {
            iceListeners.current = iceListeners.current.filter((fn) => fn !== cb)
        }
    }, [])

    const callUser = useCallback((evt: RequestCallEvent) => {
        socketRef.current?.emit('callUser', evt)
    }, [])

    const acceptCall = useCallback((evt: AcceptCallEvent) => {
        socketRef.current?.emit('acceptCall', evt)
    }, [])

    const sendIce = useCallback((evt: IceEvent) => {
        socketRef.current?.emit('iceCandidate', evt)
    }, [])

    return {
        connected,
        onCall,
        onAnswer,
        onIce,
        callUser,
        acceptCall,
        sendIce
    }
}

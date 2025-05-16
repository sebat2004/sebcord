import { useState, useRef, useEffect, useCallback } from 'react'
import { RequestCallEvent, AcceptCallEvent, CallInfo } from '@/lib/types'
import { useSignaling } from '@/hooks/useSignaling'
import { useUserStore } from '@/stores/useUserStore'
import { useNavigate } from 'react-router'
import { useCallStore } from '@/stores/useCallStore'

// STUN configuration
const RTC_CONFIG: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
}

export function useWebRTC() {
    const { onCall, onAnswer, onIce, callUser, acceptCall, sendIce, connected } = useSignaling()
    const { user } = useUserStore()
    const { micOn, videoOn } = useCallStore()
    const navigate = useNavigate()

    if (!user) {
        throw new Error('User not found in store')
    }

    const pcRef = useRef<RTCPeerConnection | null>(null)
    const [localStream, setLocalStream] = useState<MediaStream | null>(null)
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
    const [connectionState, setConnectionState] = useState<
        RTCIceConnectionState | RTCPeerConnectionState
    >('new')
    const pendingIce = useRef<RTCIceCandidateInit[]>([])
    const [incomingCall, setIncomingCall] = useState<RequestCallEvent | null>(null)
    const [callInfo, setCallInfo] = useState<CallInfo | null>(null)

    useEffect(() => {
        if (localStream) {
            localStream.getVideoTracks().forEach((track) => {
                track.enabled = videoOn
            })
            localStream.getAudioTracks().forEach((track) => {
                track.enabled = micOn
            })
        }
    }, [localStream, micOn, videoOn])

    useEffect(() => {
        return onCall(async (evt: RequestCallEvent) => {
            setIncomingCall(evt)
        })
    }, [onCall, acceptCall, sendIce])

    // Handle incoming answer
    useEffect(() => {
        return onAnswer(async (evt: AcceptCallEvent) => {
            const pc = pcRef.current
            if (!pc) return
            await pc.setRemoteDescription(new RTCSessionDescription(evt.answer))
            pendingIce.current.forEach((c) => pc.addIceCandidate(new RTCIceCandidate(c)))
            pendingIce.current = []
        })
    }, [onAnswer])

    useEffect(() => {
        return onIce((evt) => {
            const pc = pcRef.current
            if (pc?.remoteDescription && pc.remoteDescription.type) {
                pc.addIceCandidate(new RTCIceCandidate(evt.candidate))
            } else {
                pendingIce.current.push(evt.candidate)
            }
        })
    }, [onIce])

    const call = useCallback(
        async (targetId: string, audio: boolean, video: boolean) => {
            if (!connected) throw new Error('Signaling not ready')
            const pc = new RTCPeerConnection(RTC_CONFIG)
            pcRef.current = pc

            if (videoOn || micOn) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                })
                stream.getTracks().forEach((track) => {
                    pc.addTrack(track, stream)
                })
                setLocalStream(stream)
            }

            const remote = new MediaStream()
            setRemoteStream(remote)
            pc.ontrack = (e) => remote.addTrack(e.track)

            pc.onicecandidate = (e) => {
                pc.oniceconnectionstatechange = () => setConnectionState(pc.iceConnectionState)
                pc.onconnectionstatechange = () => setConnectionState(pc.connectionState)
                if (e.candidate) {
                    sendIce({ callerId: '', receiverId: targetId, candidate: e.candidate })
                }
            }
            pc.oniceconnectionstatechange = () => setConnectionState(pc.iceConnectionState)

            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)
            callUser({ callerId: user.id, receiverId: targetId, offer })
            setCallInfo({ callerId: user.id, receiverId: targetId })
        },
        [connected, micOn]
    )

    const hangup = useCallback(() => {
        pcRef.current?.close()
        pcRef.current = null
        setLocalStream(null)
        setRemoteStream(null)
        setConnectionState('closed')
    }, [])

    const accept = useCallback(async () => {
        if (!incomingCall) throw new Error('No incoming call to accept')

        const pc = new RTCPeerConnection(RTC_CONFIG)

        pcRef.current = pc

        if (videoOn || micOn) {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            setLocalStream(stream)
            stream.getTracks().forEach((track) => pc.addTrack(track, stream))
        }

        const remote = new MediaStream()
        setRemoteStream(remote)
        pc.ontrack = (e) => remote.addTrack(e.track)

        pc.onicecandidate = (e) => {
            if (e.candidate)
                sendIce({
                    callerId: incomingCall.receiverId,
                    receiverId: incomingCall.callerId,
                    candidate: e.candidate
                })
        }
        pc.oniceconnectionstatechange = () => {
            setConnectionState(pc.iceConnectionState)
        }
        pc.onconnectionstatechange = () => {
            setConnectionState(pc.connectionState)
        }

        await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer))
        pendingIce.current.forEach((c) => pc.addIceCandidate(new RTCIceCandidate(c)))
        pendingIce.current = []

        const ans = await pc.createAnswer()
        await pc.setLocalDescription(ans)

        acceptCall({
            callerId: user.id,
            receiverId: incomingCall.callerId,
            answer: ans
        })
        setCallInfo({ callerId: user.id, receiverId: incomingCall.callerId })
        setIncomingCall(null)
        navigate(`/home/message/${incomingCall.callerId}`)
    }, [incomingCall, acceptCall, sendIce])

    const decline = useCallback(() => {
        if (!incomingCall) return
        setIncomingCall(null)
    }, [incomingCall, setIncomingCall])

    return {
        localStream,
        remoteStream,
        connectionState,
        incomingCall,
        callInfo,
        micOn,
        videoOn,
        call,
        accept,
        hangup,
        decline
    }
}

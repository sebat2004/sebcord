import { useEffect, useRef, useState } from 'react'
import { useAuthenticated } from '@/hooks/mutations'
import { useGetUsers } from '@/hooks/queries'
import { io, Socket } from 'socket.io-client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogDescription
} from '@/components/ui/dialog'

interface RequestCallEvent {
    offer: RTCSessionDescriptionInit
    callerId: string
    receiverId: string
}

interface AcceptCallEvent {
    answer: RTCSessionDescriptionInit
    callerId: string
    receiverId: string
}

function HomePage(): JSX.Element {
    const { mutate, data: authenticatedData } = useAuthenticated()
    const { data: users } = useGetUsers()
    const [pendingCall, setPendingCall] = useState<RequestCallEvent | null>(null)
    const socketCxn = useRef<null | Socket>(null)
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const localVideoRef = useRef<HTMLVideoElement>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)

    const rtcConfig: RTCConfiguration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    }

    useEffect(() => {
        if (!authenticatedData || !authenticatedData.user) {
            mutate()
            return
        }

        const socket = io(`http://localhost:5001`, {
            withCredentials: true
        })
        socket.connect()

        socket.on('callUser', (data: RequestCallEvent) => {
            if (data.receiverId !== authenticatedData.user!.id) {
                return
            }
            console.log('Incoming call from:', data.callerId)
            console.log('Offer:', data.offer)
            setPendingCall(data)
        })

        socket.on('acceptCall', async (data: AcceptCallEvent) => {
            console.log('Call accepted by:', data.receiverId)
            console.log('Answer:', data.answer)
            if (data.callerId !== authenticatedData.user!.id) {
                return
            }

            console.log(peerConnectionRef.current)
            if (data.answer) {
                peerConnectionRef.current
                    ?.setRemoteDescription(new RTCSessionDescription(data.answer))
                    .then((a) => console.log('done'))
            }
        })

        socket.on('iceCandidate', async (data: any) => {
            if (peerConnectionRef.current) {
                console.log(data)
                try {
                    await peerConnectionRef.current.addIceCandidate(
                        new RTCIceCandidate(data.candidate)
                    )
                } catch (err) {
                    console.error(err)
                }
            }
        })

        socketCxn.current = socket
    }, [authenticatedData])

    const handleCallUser = async (userId: string) => {
        toast.success('Calling user...')
        if (!socketCxn.current) {
            toast.error('Socket connection is not established')
            return
        }

        const peerConnection = new RTCPeerConnection(rtcConfig)
        peerConnectionRef.current = peerConnection

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        console.log('Got local stream', stream)
        localVideoRef.current!.srcObject = stream
        stream.getTracks().forEach((track) => {
            console.log('Adding track', track)
            peerConnection.addTrack(track, stream)
        })
        peerConnection.ontrack = (event) => {
            console.log('Remote track:', event)
            remoteVideoRef.current!.srcObject = event.streams[0]
        }

        const dataChannel = peerConnection.createDataChannel('voice-call')
        dataChannel.onopen = () => {
            console.log('Data channel is open')
        }

        peerConnection.onicecandidate = (event) => {
            if (!event.candidate) {
                return
            }

            console.log(event)
            console.log('Sending ICE candidate:', event.candidate)
            socketCxn.current?.emit('iceCandidate', {
                callerId: authenticatedData!.user!.id,
                receiverId: userId,
                candidate: event.candidate
            })
        }

        const offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)
        socketCxn.current!.emit('callUser', {
            callerId: authenticatedData!.user!.id,
            receiverId: userId,
            offer: offer
        })
    }

    const handleAcceptCall = async (pending: RequestCallEvent) => {
        if (!socketCxn.current) {
            toast.error('Socket connection is not established')
            return
        }

        const peerConnection = new RTCPeerConnection(rtcConfig)
        peerConnectionRef.current = peerConnection

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        console.log('Got local stream', stream)
        localVideoRef.current!.srcObject = stream
        stream.getTracks().forEach((track) => {
            console.log('Adding track', track)
            peerConnection.addTrack(track, stream)
        })
        peerConnection.ontrack = (event) => {
            console.log('Remote track:', event)
            remoteVideoRef.current!.srcObject = event.streams[0]
        }

        peerConnection.onicecandidate = (event) => {
            if (!event.candidate) {
                return
            }
            console.log('Sending ICE candidate:', event.candidate)
            socketCxn.current?.emit('iceCandidate', {
                callerId: pending.callerId,
                receiverId: pending.receiverId,
                candidate: event.candidate
            })
        }

        peerConnection.ondatachannel = (event) => {
            const dataChannel = event.channel
            dataChannel.onmessage = (e) => {
                console.log('Received message:', e.data)
            }
        }

        await peerConnection.setRemoteDescription(new RTCSessionDescription(pending.offer))
        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)

        socketCxn.current.emit('acceptCall', {
            callerId: pending.callerId,
            receiverId: pending.receiverId,
            answer: answer
        })

        setPendingCall(null)
    }

    if (authenticatedData?.user === undefined) {
        return <div>Loading...</div>
    }

    return (
        <section className="flex flex-col items-center justify-center h-screen space-y-6">
            <h1 className="text-xl">Hello, {authenticatedData.user.username}</h1>
            <div className="flex space-x-4 gap-20">
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-48 h-36 bg-black"
                />
                <video ref={remoteVideoRef} autoPlay playsInline className="w-48 h-36 bg-black" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {users?.map((u) => (
                    <Card key={u.id} className="p-4 flex flex-col items-center">
                        <h2 className="text-lg">{u.username}</h2>
                        <Button onClick={() => handleCallUser(u.id)}>Call</Button>
                    </Card>
                ))}
            </div>
            <Dialog open={!!pendingCall}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Incoming Call</DialogTitle>
                        <DialogDescription>From {pendingCall?.callerId}</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setPendingCall({} as RequestCallEvent)}
                        >
                            Decline
                        </Button>
                        <Button onClick={() => handleAcceptCall(pendingCall!)}>Accept</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    )
}

export default HomePage

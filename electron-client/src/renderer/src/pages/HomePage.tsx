import { useEffect, useRef, useState } from 'react'
import { useAuthenticated } from '@/hooks/mutations'
import { useGetUsers } from '@/hooks/queries'
import { io, Socket } from 'socket.io-client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { DialogHeader } from '@/components/ui/dialog'

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
    const [pendingCall, setPendingCall] = useState<RequestCallEvent>({} as RequestCallEvent)
    const socketCxn = useRef<null | Socket>(null)
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

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

        setPendingCall({} as RequestCallEvent)
    }

    if (authenticatedData?.user === undefined) {
        return <div>Loading...</div>
    }

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-xl">
                Welcome to the Home page, {authenticatedData.user.username}!
            </h1>
            <p className="text-gray-500">List of users from the database:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {users &&
                    users.map((user) => (
                        <Card
                            key={user.id}
                            className="flex flex-col justify-center p-4 border rounded"
                        >
                            <h2 className="text-lg text-center">{user.username}</h2>
                            <p className="text-gray-500 text-center">{user.email}</p>
                            <Button
                                className="mt-2"
                                variant="default"
                                onClick={() => handleCallUser(user.id)}
                            >
                                Call User
                            </Button>
                        </Card>
                    ))}
            </div>
            <Dialog open={pendingCall?.receiverId === authenticatedData.user!.id}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Incoming Call</DialogTitle>
                        <DialogDescription>
                            You have an incoming call from {pendingCall.callerId}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end">
                        <Button onClick={() => handleAcceptCall(pendingCall)}>Accept</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    )
}

export default HomePage

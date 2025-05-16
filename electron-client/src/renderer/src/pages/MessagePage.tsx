import { Button } from '@/components/ui/button'
import { useParams } from 'react-router'
import { useFetchUser } from '@/hooks/queries'
import ProfilePic from '@/components/profile-pic'
import Message from '@/components/message'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Input } from '@/components/ui/input'
import { PhoneCall, Plus, Video } from 'lucide-react'
import { useCallStore } from '@/stores/useCallStore'
import { useEffect, useRef } from 'react'
import CallWindow from '@/components/CallWindow'

export default function MessagePage() {
    const { id } = useParams()
    const { data: user } = useFetchUser(id)
    const { localStream, remoteStream, call, accept, decline, hangup, callInfo, videoOn } =
        useCallStore()

    if (!user) {
        return <div className="flex items-center justify-center h-full">Loading...</div>
    }

    const mockMessages = [
        {
            senderId: '1',
            message: 'Hello!',
            senderName: user.username,
            timestamp: new Date().toISOString(),
            prevSameSender: false
        },
        {
            senderId: '2',
            message: 'Hi there!',
            senderName: user.username,
            timestamp: new Date().toISOString(),
            prevSameSender: true
        },
        {
            senderId: '1',
            message: 'How are you?',
            senderName: 'Joe Biden',
            timestamp: new Date().toISOString(),
            prevSameSender: false
        },
        {
            senderId: '2',
            message: 'I am good, thanks! How about you?',
            senderName: user.username,
            timestamp: new Date().toISOString(),
            prevSameSender: false
        },
        {
            senderId: '1',
            message: 'I am doing well too!',
            senderName: 'Joe Biden',
            timestamp: new Date().toISOString(),
            prevSameSender: false
        },
        {
            senderId: '2',
            message: 'Great to hear that!',
            senderName: user.username,
            timestamp: new Date().toISOString(),
            prevSameSender: false
        },
        {
            senderId: '1',
            message: 'What are you up to?',
            senderName: 'Joe Biden',
            timestamp: new Date().toISOString(),
            prevSameSender: false
        },
        {
            senderId: '2',
            message: 'Just working on some projects.',
            senderName: user.username,
            timestamp: new Date().toISOString(),
            prevSameSender: false
        },
        {
            senderId: '1',
            message: 'Sounds good!',
            senderName: 'Joe Biden',
            timestamp: new Date().toISOString(),
            prevSameSender: false
        },
        {
            senderId: '2',
            message: 'Yeah, it is fun!',
            senderName: user.username,
            timestamp: new Date().toISOString(),
            prevSameSender: false
        },
        {
            senderId: '1',
            message: "Let's catch up later.",
            senderName: 'Joe Biden',
            timestamp: new Date().toISOString(),
            prevSameSender: false
        },
        {
            senderId: '2',
            message: 'Sure, take care!',
            senderName: user.username,
            timestamp: new Date().toISOString(),
            prevSameSender: false
        },
        {
            senderId: '1',
            message: 'Bye!',
            senderName: 'Joe Biden',
            timestamp: new Date().toISOString(),
            prevSameSender: false
        },
        {
            senderId: '2',
            message: 'See you later!',
            senderName: user.username,
            timestamp: new Date().toISOString(),
            prevSameSender: false
        },
        {
            senderId: '1',
            message: 'Take care!',
            senderName: 'Joe Biden',
            timestamp: new Date().toISOString(),
            prevSameSender: false
        },
        {
            senderId: '2',
            message: 'You too!',
            senderName: user.username,
            timestamp: new Date().toISOString(),
            prevSameSender: false
        }
    ]

    const callActive = localStream && remoteStream && callInfo?.receiverId === id

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-start gap-2 p-3 border-b-1 h-[5%]">
                <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center justify-center gap-1">
                        <ProfilePic username={user?.username} size={8} />
                        <h3 className="text-md font-medium">{user?.username}</h3>
                    </div>
                    <div className="hidden lg:flex items-center gap-2">
                        <Button variant="secondary" size="icon">
                            <PhoneCall className="w-4 h-4" />
                        </Button>
                        <Button variant="secondary" size="sm">
                            <Video />
                        </Button>
                        <Input type="text" placeholder="Search" className="w-64" />
                    </div>
                </div>
            </div>

            {/* Call Window */}
            {callActive && (
                <div className="h-[40%]">
                    <CallWindow />
                </div>
            )}

            <div className={`flex gap-2 border-b-1 ${callActive ? 'h-[55%]' : 'h-[95%]'}`}>
                <div
                    className={`flex flex-col justify-between p-4 gap-2 h-full w-full ${!callActive && 'w-[75%]'}`}
                >
                    <ScrollArea
                        scrollHideDelay={100}
                        className="flex flex-col gap-1 overflow-y-scroll"
                    >
                        {mockMessages.map((message, index) => (
                            <Message
                                key={index}
                                senderName={message.senderName}
                                senderId={message.senderId}
                                message={message.message}
                                timestamp={message.timestamp}
                                prevSameSender={message.prevSameSender}
                            />
                        ))}
                    </ScrollArea>
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm">
                            <Plus className="w-4 h-4" />
                        </Button>
                        <Input
                            type="text"
                            placeholder="Type a message..."
                            className="w-full p-4 h-16 border rounded-md"
                        />
                        <Button size="sm">Send</Button>
                    </div>
                </div>
                {!callActive && (
                    <div className="hidden lg:flex flex-col gap-3 w-92 border-l-1 p-4 px-6">
                        <ProfilePic username={user?.username} />
                        <h1 className="text-xl font-semibold">{user?.username}</h1>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    call(user.id, true, true)
                                }}
                            >
                                <PhoneCall />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

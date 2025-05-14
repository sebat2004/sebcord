import ProfilePic from './profile-pic'
import { Skeleton } from './ui/skeleton'

interface MessageProps {
    message: string
    timestamp: string
    senderName: string
    senderId: string
    prevSameSender: boolean
}

export default function Message({
    message,
    timestamp,
    senderName,
    senderId,
    prevSameSender
}: MessageProps) {
    return (
        <div className="flex gap-4 w-full hover:bg-gray-100 p-0.5 rounded-md duration-75">
            {!prevSameSender ? (
                <ProfilePic username={senderName} size={8} />
            ) : (
                <Skeleton className="w-8 rounded-full bg-transparent" />
            )}
            <div>
                {!prevSameSender && (
                    <div className="flex items-center gap-2 pb-1">
                        <h1 className="text-md font-semibold">{senderName}</h1>
                        <p className="text-sm text-gray-500">
                            {new Date(timestamp).toLocaleString()}
                        </p>
                    </div>
                )}
                <p className="text-md">{message}</p>
            </div>
        </div>
    )
}

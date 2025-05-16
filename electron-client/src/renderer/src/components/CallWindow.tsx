import { useCallStore } from '@/stores/useCallStore'
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { MicOff, PhoneMissed, Video, VideoOff } from 'lucide-react'
import { Mic } from 'lucide-react'

const CallWindow = () => {
    const {
        localStream,
        remoteStream,
        call,
        accept,
        decline,
        hangup,
        micOn,
        videoOn,
        toggleAudio,
        toggleVideo
    } = useCallStore()
    const [focusedCaller, setFocusedCaller] = useState<'local' | 'remote'>('local')

    const localVideoRef = useRef<HTMLVideoElement>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream
            setFocusedCaller('local')
        }
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream
            setFocusedCaller('remote')
        }
    }, [localStream, remoteStream])

    return (
        <section className="relative w-full h-full p-8 bg-gray-800 group">
            <div className="relative flex flex-col items-center justify-center h-full w-full">
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className={
                        `border-1 bottom-0 right-0 rounded-xl border-gray-500 bg-black ` +
                        (focusedCaller === 'local'
                            ? 'h-full w-full'
                            : 'absolute h-[35%] w-[35%] z-10')
                    }
                    onClick={() => setFocusedCaller('local')}
                ></video>
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    className={
                        `border-1  bottom-0 right-0 rounded-xl border-gray-500 bg-black ` +
                        (focusedCaller === 'remote'
                            ? 'h-full w-full'
                            : 'absolute h-[35%] w-[35%] z-10')
                    }
                    onClick={() => setFocusedCaller('remote')}
                />
            </div>
            <div className="opacity-0 absolute bottom-0 left-1/2 transform -translate-x-1/2 transition-all duration-150 delay-75 gap-4 group-hover:absolute group-hover:opacity-100 group-hover:bottom-4">
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="icon" onClick={toggleAudio}>
                        {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                    <Button variant="secondary" size="icon" onClick={toggleVideo}>
                        {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>

                    <Button variant="destructive" size="icon" onClick={hangup}>
                        <PhoneMissed className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default CallWindow

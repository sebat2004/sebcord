import { Toaster } from '@/components/ui/sonner'
import { Outlet } from 'react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { useCallStore } from '@/stores/useCallStore'
import { useEffect } from 'react'
import { useWebRTC } from '@/hooks/useWebRtc'
import { AcceptCallDialog } from '@/components/dialogs'

export default function SidebarLayout() {
    const {
        call,
        accept,
        hangup,
        decline,
        localStream,
        remoteStream,
        incomingCall,
        connectionState
    } = useWebRTC()
    const {
        setCall,
        setAccept,
        setHangup,
        setDecline,
        setLocalStream,
        setRemoteStream,
        setIncomingCall,
        setConnectionState
    } = useCallStore()

    useEffect(() => {
        setCall(call)
        setAccept(accept)
        setHangup(hangup)
        setDecline(decline)
        setLocalStream(localStream)
        setRemoteStream(remoteStream)
        setIncomingCall(incomingCall)
        setConnectionState(connectionState as RTCPeerConnectionState)
    }, [
        call,
        accept,
        hangup,
        decline,
        setCall,
        setAccept,
        setHangup,
        setDecline,
        setLocalStream,
        setRemoteStream,
        setIncomingCall,
        setConnectionState,
        localStream,
        remoteStream,
        incomingCall,
        connectionState
    ])

    return (
        <>
            <SidebarProvider>
                <div className="flex w-screen">
                    <AppSidebar />
                    <main className="flex-1 h-screen min-w-0">
                        <Outlet />
                    </main>
                </div>
                <AcceptCallDialog />
                <Toaster duration={2500} />
            </SidebarProvider>
        </>
    )
}

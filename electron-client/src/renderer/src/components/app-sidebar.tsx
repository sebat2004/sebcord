import {
    Users,
    Mail,
    Bean,
    Store,
    Plus,
    Wifi,
    PhoneMissed,
    Settings,
    Mic,
    MicOff
} from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar
} from '@/components/ui/sidebar'
import logo from '@/assets/sebcord.png'
import { Link } from 'react-router'
import { useGetAuthenticated, useGetFriends } from '@/hooks/queries'
import ProfilePic from './profile-pic'
import { Button } from './ui/button'
import { useCallStore } from '@/stores/useCallStore'
import { getCallStatusText } from '@/lib/utils'
import { TooltipWrapper } from './TooltipWrapper'

// Menu items.
const items = [
    {
        title: 'Friends',
        url: '/home/friends',
        icon: Users
    },
    {
        title: 'Message Requests',
        url: '#',
        icon: Mail
    },
    {
        title: 'Nitro',
        url: '#',
        icon: Bean,
        disabled: true
    },
    {
        title: 'Shop',
        url: '#',
        icon: Store,
        disabled: true
    }
]

export function AppSidebar() {
    const { data, isLoading } = useGetAuthenticated()
    const { open } = useSidebar()
    const { data: friends } = useGetFriends()
    const { connectionState, incomingCall, micOn, videoOn, hangup, toggleAudio } = useCallStore()

    if (isLoading || !data) {
        return null
    }

    const callStatusText = connectionState && getCallStatusText(connectionState)

    return (
        <Sidebar collapsible="icon">
            <SidebarContent className="flex flex-col gap-0">
                <SidebarHeader className="flex justify-center">
                    <div className="flex items-center justify-between">
                        {open && (
                            <Link to="/home" className="flex items-center gap-2">
                                <img src={logo} alt="User Avatar" className="h-10 w-10 " />
                                <h1 className="text-md font-bold">Sebcord</h1>
                            </Link>
                        )}
                        <SidebarTrigger className="hover:cursor-pointer" />
                    </div>
                    <hr className="h-0.5 border-t-0 bg-gray-200 dark:bg-white/10" />
                </SidebarHeader>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton disabled={item.disabled} asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <hr className="h-0.25 border-t-0 bg-gray-200 dark:bg-white/10" />
                <div className="flex items-center justify-between px-4 py-3">
                    {open && (
                        <h3 className="text-xs font-semibold text-black dark:text-gray-400">
                            Direct Messages
                        </h3>
                    )}
                    {/* TODO: Add DM popup after clicking + button */}
                    <Button variant="ghost" size="icon" asChild className="p-0">
                        <Plus className="h-4 w-4 hover:text-gray-600" />
                    </Button>

                    {/* TODO: Add list of DMs */}
                </div>
            </SidebarContent>
            <SidebarFooter className="rounded-t-2xl bg-gray-200 p-2">
                {/* Call Status */}
                {open &&
                    connectionState &&
                    connectionState !== 'new' &&
                    connectionState !== 'closed' && (
                        <div className="flex flex-col items-center justify-center border-b-1 pr-2 border-gray-200">
                            <div className="flex items-center justify-between w-full px-2">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-2 p-2">
                                        <Wifi className="text-sm text-green-700" />
                                        <h3 className="text-sm text-green-700">{callStatusText}</h3>
                                    </div>
                                    <h4>{incomingCall?.receiverId}</h4>
                                </div>
                                <TooltipWrapper content="End Call">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={hangup}
                                        className="p-0 hover:text-red-500"
                                    >
                                        <PhoneMissed className="h-4 w-4" />
                                    </Button>
                                </TooltipWrapper>
                            </div>
                        </div>
                    )}
                {/* User Profile */}
                <div className="flex items-center justify-between gap-2 p-2">
                    <div className="flex items-center justify-center">
                        <ProfilePic username={data.user?.username || ''} size={8} />
                        {open && (
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">{data.user?.username}</span>
                                <span className="text-xs text-gray-500">{data.user?.active}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="p-0"
                            onClick={toggleAudio}
                        >
                            {micOn ? (
                                <Mic className="h-4 w-4 hover:text-gray-600" />
                            ) : (
                                <MicOff className="h-4 w-4 hover:text-gray-600" />
                            )}
                        </Button>

                        <Button variant="ghost" size="icon" asChild className="p-0">
                            <Link to="/settings">
                                <Settings className="h-4 w-4 hover:text-gray-600" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

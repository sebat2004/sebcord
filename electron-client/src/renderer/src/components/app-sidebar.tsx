import { Users, Mail, Bean, Store, Plus } from 'lucide-react'

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

    if (isLoading || !data) {
        return null
    }

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
                    <h3 className="text-xs font-semibold text-black dark:text-gray-400">
                        Direct Messages
                    </h3>
                    {/* TODO: Add DM popup after clicking + button */}
                    <Button variant="ghost" size="icon" asChild className="p-0">
                        <Plus className="h-4 w-4 hover:text-gray-600" />
                    </Button>

                    {/* TODO: Add list of DMs */}
                </div>
            </SidebarContent>
            <SidebarFooter>
                {/* User Profile */}
                <div className="flex items-center gap-2 p-2">
                    <ProfilePic username={data.user?.username || ''} size={10} />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">{data.user?.username}</span>
                        <span className="text-xs text-gray-500">{data.user?.active}</span>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

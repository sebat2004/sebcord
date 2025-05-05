import { Users, Mail, Bean, Store } from 'lucide-react'

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
    SidebarTrigger
} from '@/components/ui/sidebar'
import logo from '@/assets/sebcord.png'
import { useAuthenticated } from '@/hooks/mutations'
import { useEffect } from 'react'

// Menu items.
const items = [
    {
        title: 'Friends',
        url: '#',
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
    const { mutate, data, isSuccess } = useAuthenticated()
    console.log(data, isSuccess)

    useEffect(() => {
        if (!data) {
            mutate()
        }
    }, [data])

    if (!data) {
        return null
    }

    return (
        <Sidebar collapsible="icon">
            <SidebarContent className="flex flex-col gap-0">
                <SidebarHeader className="p-1">
                    <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="User Avatar" className="h-10 w-10 " />
                            <h1 className="text-md font-bold">Sebcord</h1>
                        </div>
                        <SidebarTrigger />
                    </div>
                    <hr className="h-0.5 border-t-0 bg-gray-200 dark:bg-white/10" />
                </SidebarHeader>
                <SidebarGroup className="p-1">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <hr className="h-0.5 border-t-0 bg-gray-200 dark:bg-white/10" />
            </SidebarContent>
            <SidebarFooter>
                {/* User Profile */}
                <div className="flex items-center gap-2 p-2">
                    <h1 className="h-10 w-10 flex justify-center items-center bg-gray-200 rounded-full">
                        <h1>{data.user?.username?.at(0)?.toUpperCase()}</h1>
                    </h1>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">{data.user?.username}</span>
                        {/* <span className="text-xs text-gray-500">{data.user?.activityStatus}</span> */}
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

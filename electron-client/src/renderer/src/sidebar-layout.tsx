import { Toaster } from '@/components/ui/sonner'
import { Outlet } from 'react-router'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import { AppSidebar } from './components/app-sidebar'

export default function SidebarLayout() {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <main>
                    <Outlet />
                </main>
                <Toaster duration={2500} />
            </SidebarProvider>
        </>
    )
}

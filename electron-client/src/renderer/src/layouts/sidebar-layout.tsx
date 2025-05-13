import { Toaster } from '@/components/ui/sonner'
import { Outlet } from 'react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export default function SidebarLayout() {
    return (
        <>
            <SidebarProvider>
                <div className="flex w-screen">
                    <AppSidebar />
                    <main className="flex-1 min-w-0">
                        <Outlet />
                    </main>
                </div>
                <Toaster duration={2500} />
            </SidebarProvider>
        </>
    )
}

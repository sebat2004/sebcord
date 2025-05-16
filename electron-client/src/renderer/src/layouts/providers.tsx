import { SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@radix-ui/react-tooltip'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <TooltipProvider>{children}</TooltipProvider>
        </SidebarProvider>
    )
}

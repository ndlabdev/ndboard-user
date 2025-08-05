import { AppBreadcrumb } from '@/components/app-breadcrumb'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger
} from '@/components/ui/sidebar'
import { AuthProvider } from '@/features/auth'

export default function DashboardLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen flex-col">
            <AuthProvider>
                <SidebarProvider>
                    <AppSidebar />

                    <SidebarInset>
                        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b sticky top-0 z-10 bg-background">
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger className="-ml-1" />
                                <Separator
                                    orientation="vertical"
                                    className="mr-2 data-[orientation=vertical]:h-4"
                                />
                                <AppBreadcrumb />
                            </div>
                        </header>

                        <div className="relative flex-grow">
                            <div className="absolute inset-0">
                                {children}
                            </div>
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </AuthProvider>
        </div>
    )
}

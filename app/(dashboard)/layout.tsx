import { AuthProvider } from '@/features/auth'
import PrivateGuard from '@/components/guards/PrivateGuard'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <PrivateGuard>
                {children}
            </PrivateGuard>
        </AuthProvider>
    )
}

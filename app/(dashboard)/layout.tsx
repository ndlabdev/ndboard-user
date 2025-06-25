import { PrivateGuard } from '@/components/guards/PrivateGuard'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <PrivateGuard>{children}</PrivateGuard>
}

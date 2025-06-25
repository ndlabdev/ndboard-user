import { PublicGuard } from '@/components/guards/PublicGuard'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <PublicGuard>{children}</PublicGuard>
}

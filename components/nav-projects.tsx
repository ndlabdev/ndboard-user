'use client'

import { type LucideIcon } from 'lucide-react'
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { useAuth } from '@/features/auth'
import { usePathname } from 'next/navigation'

export function NavProjects({
    projects
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
    const { user } = useAuth()
    const pathname = usePathname()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarMenu>
                {projects.map((item) => {
                    const href = item.url.replace('[username]', user?.username as string)

                    const isActive =
                        pathname === href ||
                        pathname.startsWith(`${href}/`)

                    return (
                        <SidebarMenuItem key={item.name}>
                            <SidebarMenuButton asChild isActive={isActive}>
                                <Link href={href}>
                                    <item.icon />
                                    <span>{item.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}

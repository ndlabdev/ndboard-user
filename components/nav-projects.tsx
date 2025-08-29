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

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarMenu>
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <Link href={item.url.replace('[username]', user?.username as string)}>
                                <item.icon />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}

'use client'

import * as React from 'react'
import {
    AudioWaveform,
    Command,
    GalleryVerticalEnd,
    Users,
    Settings,
    Presentation
} from 'lucide-react'

import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail
} from '@/components/ui/sidebar'
import { Skeleton } from './ui/skeleton'
import { useAuth } from '@/features/auth'

const data = {
    teams: [
        {
            name: 'Acme Inc',
            logo: GalleryVerticalEnd,
            plan: 'Enterprise'
        },
        {
            name: 'Acme Corp.',
            logo: AudioWaveform,
            plan: 'Startup'
        },
        {
            name: 'Evil Corp.',
            logo: Command,
            plan: 'Free'
        }
    ],
    projects: [
        {
            name: 'Boards',
            url: '#',
            icon: Presentation
        },
        {
            name: 'Members',
            url: '#',
            icon: Users
        },
        {
            name: 'Settings',
            url: '#',
            icon: Settings
        }
    ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user, isLoading } = useAuth()

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>

            <SidebarContent>
                <NavProjects projects={data.projects} />
            </SidebarContent>

            <SidebarFooter>
                {isLoading && (
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="grid flex-1 space-y-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                )}
                {!isLoading && user && <NavUser user={user} />}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

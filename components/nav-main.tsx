import { ChevronRight, Airplay, Users, Settings, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useWorkspaceGetListQuery, WorkspaceCreateButton } from '@/features/workspace'

type SubMenuItem = {
    title: string
    icon?: LucideIcon
    url: string
}

type WorkspaceNavData = {
    id: string
    title: string
    imageUrl?: string | null
    items: SubMenuItem[]
}

function WorkspaceNavItem({ item }: { item: WorkspaceNavData }) {
    return (
        <Collapsible key={item.id} asChild className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        <Avatar className="w-6 h-6">
                            {item.imageUrl && <AvatarImage src={item.imageUrl} alt={item.title} title={item.title} />}

                            <AvatarFallback>
                                {item.title.slice(0, 1).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className='truncate'>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                    <Link href={subItem.url}>
                                        {subItem.icon && <subItem.icon />}
                                        <span>{subItem.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}

export function NavMain() {
    const { data } = useWorkspaceGetListQuery()
    const items: WorkspaceNavData[] =
        data?.data?.map((item) => ({
            id: item.id,
            title: item.name,
            imageUrl: item.imageUrl,
            items: [
                {
                    title: 'Boards',
                    icon: Airplay,
                    url: `/w/${item.slug}/boards`
                },
                {
                    title: 'Members',
                    icon: Users,
                    url: `/w/${item.slug}/members`
                },
                {
                    title: 'Settings',
                    icon: Settings,
                    url: `/w/${item.slug}/settings`
                }
            ]
        })) || []

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>

            <SidebarMenu>
                {items.map((item) => (
                    <WorkspaceNavItem item={item} key={item.id} />
                ))}

                <SidebarMenuItem className='mt-3'>
                    <SidebarMenuButton asChild>
                        <WorkspaceCreateButton />
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}

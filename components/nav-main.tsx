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
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

type SubMenuItem = {
    title: string
    isActive: boolean
    icon?: LucideIcon
    url: string
}

type WorkspaceNavData = {
    id: string
    title: string
    isActive: boolean
    imageUrl?: string | null
    items: SubMenuItem[]
}

const WORKSPACE_SUB_MENUS = [
    { title: 'Boards', icon: Airplay, path: 'boards' },
    { title: 'Members', icon: Users, path: 'members' },
    { title: 'Settings', icon: Settings, path: 'settings' }
] as const

function WorkspaceNavItem({ item }: { item: WorkspaceNavData }) {
    return (
        <Collapsible key={item.id} asChild defaultOpen={item.isActive} className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
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
                                <SidebarMenuSubButton asChild isActive={subItem.isActive}>
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
    const pathname = usePathname()
    const { data } = useWorkspaceGetListQuery()

    const items: WorkspaceNavData[] = useMemo(() => (
        data?.data?.map((ws) => {
            const slug = ws.slug
            const basePath = `/w/${slug}`

            return {
                id: ws.id,
                title: ws.name,
                imageUrl: ws.imageUrl,
                isActive: pathname.startsWith(basePath),
                items: WORKSPACE_SUB_MENUS.map((menu) => ({
                    title: menu.title,
                    icon: menu.icon,
                    isActive: pathname === `${basePath}/${menu.path}`,
                    url: `${basePath}/${menu.path}`
                }))
            }
        }) || []
    ), [data, pathname])

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

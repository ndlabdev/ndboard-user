import type { BoardBackground } from '@/types'
import { Users, Globe, LucideIcon, LockKeyhole } from 'lucide-react'

export const BOARD_VISIBILITY = {
    PRIVATE: 'private',
    WORKSPACE: 'workspace',
    PUBLIC: 'public'
} as const

export const BOARD_ROLE = {
    OWNER: 'owner',
    ADMIN: 'admin',
    MEMBER: 'member',
    VIEWER: 'viewer'
} as const

export const BOARD_VISIBILITY_ICONS: Record<string, LucideIcon> = {
    private: LockKeyhole,
    workspace: Users,
    public: Globe
}

export const BOARD_VISIBILITY_OPTIONS = [
    {
        id: BOARD_VISIBILITY.PRIVATE,
        label: 'Private',
        icon: BOARD_VISIBILITY_ICONS.private,
        description: 'Only board members can view and edit. This board is invisible to anyone else.'
    },
    {
        id: BOARD_VISIBILITY.WORKSPACE,
        label: 'Workspace',
        description: 'All members in this workspace can view and join the board. Only invited members can edit.'
    },
    {
        id: BOARD_VISIBILITY.PUBLIC,
        label: 'Public',
        description: 'Anyone with the link can view this board. Only invited members can make changes.'
    }
]

export const DEFAULT_BOARD_BACKGROUNDS: BoardBackground[] = [
    {
        key: 'unsplash-mountain',
        type: 'image',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=60',
        fullUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80'
    },
    {
        key: 'unsplash-forest',
        type: 'image',
        thumbnailUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=60',
        fullUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1600&q=80'
    },
    {
        key: 'unsplash-sea',
        type: 'image',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=60',
        fullUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80'
    },
    {
        key: 'unsplash-lake',
        type: 'image',
        thumbnailUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=400&q=60',
        fullUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1600&q=80'
    },
    {
        key: 'unsplash-city',
        type: 'image',
        thumbnailUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=60',
        fullUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80'
    },
    {
        key: 'unsplash-sunset',
        type: 'image',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=60',
        fullUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1600&q=80'
    },
    {
        key: 'unsplash-leaves',
        type: 'image',
        thumbnailUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=400&q=60',
        fullUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80'
    },
    {
        key: 'unsplash-sky',
        type: 'image',
        thumbnailUrl: 'https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=400&q=60',
        fullUrl: 'https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=1600&q=80'
    },

    // Gradient
    {
        key: 'gradient-blue-purple',
        type: 'gradient',
        thumbnailUrl: '',
        fullUrl: '',
        value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        key: 'gradient-green-blue',
        type: 'gradient',
        thumbnailUrl: '',
        fullUrl: '',
        value: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)'
    },
    {
        key: 'gradient-orange-pink',
        type: 'gradient',
        thumbnailUrl: '',
        fullUrl: '',
        value: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)'
    },
    {
        key: 'gradient-pink-yellow',
        type: 'gradient',
        thumbnailUrl: '',
        fullUrl: '',
        value: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)'
    },
    {
        key: 'gradient-teal-blue',
        type: 'gradient',
        thumbnailUrl: '',
        fullUrl: '',
        value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
        key: 'gradient-red-purple',
        type: 'gradient',
        thumbnailUrl: '',
        fullUrl: '',
        value: 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)'
    },
    {
        key: 'gradient-deepblue',
        type: 'gradient',
        thumbnailUrl: '',
        fullUrl: '',
        value: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)'
    }
]

export const LABEL_COLORS = [
    {
        name: 'green',
        subtle: 'bg-green-100 text-green-900',
        normal: 'bg-green-500 text-white',
        bold: 'bg-green-700 text-white'
    },
    {
        name: 'yellow',
        subtle: 'bg-yellow-100 text-yellow-900',
        normal: 'bg-yellow-400 text-gray-900',
        bold: 'bg-yellow-600 text-white'
    },
    {
        name: 'orange',
        subtle: 'bg-orange-100 text-orange-900',
        normal: 'bg-orange-400 text-gray-900',
        bold: 'bg-orange-600 text-white'
    },
    {
        name: 'red',
        subtle: 'bg-red-100 text-red-900',
        normal: 'bg-red-500 text-white',
        bold: 'bg-red-700 text-white'
    },
    {
        name: 'blue',
        subtle: 'bg-blue-100 text-blue-900',
        normal: 'bg-blue-500 text-white',
        bold: 'bg-blue-700 text-white'
    },
    {
        name: 'purple',
        subtle: 'bg-purple-100 text-purple-900',
        normal: 'bg-purple-500 text-white',
        bold: 'bg-purple-700 text-white'
    },
    {
        name: 'sky',
        subtle: 'bg-sky-100 text-sky-900',
        normal: 'bg-sky-400 text-gray-900',
        bold: 'bg-sky-600 text-white'
    },
    {
        name: 'pink',
        subtle: 'bg-pink-100 text-pink-900',
        normal: 'bg-pink-400 text-gray-900',
        bold: 'bg-pink-600 text-white'
    },
    {
        name: 'lime',
        subtle: 'bg-lime-100 text-lime-900',
        normal: 'bg-lime-400 text-gray-900',
        bold: 'bg-lime-600 text-white'
    },
    {
        name: 'teal',
        subtle: 'bg-teal-100 text-teal-900',
        normal: 'bg-teal-400 text-gray-900',
        bold: 'bg-teal-600 text-white'
    },
    {
        name: 'gray',
        subtle: 'bg-gray-200 text-gray-900',
        normal: 'bg-gray-400 text-gray-900',
        bold: 'bg-gray-700 text-white'
    },
    {
        name: 'black',
        subtle: 'bg-gray-700 text-white',
        normal: 'bg-black text-white',
        bold: 'bg-black text-white'
    }
]

export const LABEL_COLOR_NAMES = LABEL_COLORS.map((c) => c.name) as [string, ...string[]]
export type LabelColor = typeof LABEL_COLOR_NAMES[number]
export const LABEL_TONES = ['subtle', 'normal', 'bold'] as const
export type LabelTone = typeof LABEL_TONES[number]

export const COLOR_CLASSES = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    gray: 'bg-gray-500'
} as const

type OptionColor = keyof typeof COLOR_CLASSES

export const OPTION_COLORS: OptionColor[] = Object.keys(COLOR_CLASSES) as OptionColor[]

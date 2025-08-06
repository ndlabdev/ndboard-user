import { LABEL_COLORS } from '@/features/board'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getInitials(name: string, maxLen = 2) {
    if (!name) return ''

    return name
        .split(' ')
        .map((s) => s[0]?.toUpperCase())
        .join('')
        .slice(0, maxLen)
}

export function isUrl(text: string) {
    return /^https?:\/\/\S+$/i.test(text.trim())
}

export function getLabelClass(color: string, type: 'subtle' | 'normal' | 'bold' = 'normal') {
    const c = LABEL_COLORS.find((x) => x.name === color)

    return c ? c[type] : 'bg-gray-200 text-gray-900'
}

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

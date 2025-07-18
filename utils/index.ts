export function getTextColorByBg(hex?: string | null): 'black' | 'white' {
    if (!hex || typeof hex !== 'string') return 'black'

    if (!hex.startsWith('#') || hex.length < 7) return 'black'

    const cleanHex = hex.replace('#', '')
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000

    return brightness > 150 ? 'black' : 'white'
}

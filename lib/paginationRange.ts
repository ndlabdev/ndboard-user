export function getPaginationRange(current: number, total: number, siblingCount = 1): (number | '...')[] {
    const DOTS = '...'
    const totalPageNumbers = siblingCount * 2 + 5

    if (total <= totalPageNumbers) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    const leftSiblingIndex = Math.max(current - siblingCount, 1)
    const rightSiblingIndex = Math.min(current + siblingCount, total)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < total - 1

    if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItems = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1)

        return [...leftItems, DOTS, total]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItems = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => total - (3 + 2 * siblingCount) + 1 + i)

        return [1, DOTS, ...rightItems]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
        const middleItems = Array.from({ length: 2 * siblingCount + 1 }, (_, i) => current - siblingCount + i)

        return [1, DOTS, ...middleItems, DOTS, total]
    }

    return []
}

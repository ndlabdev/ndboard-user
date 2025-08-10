import { BoardCardChecklists } from '@/types'

export function calcChecklistProgress(list: BoardCardChecklists): number {
    const total = list.items.length
    if (total === 0) return 0
    const done = list.items.filter((i) => i.isChecked).length

    return Math.round((done / total) * 100)
}

export function calcAllChecklistsProgress(lists: BoardCardChecklists[]): number {
    const totals = lists.reduce(
        (acc, l) => {
            acc.total += l.items.length
            acc.done += l.items.filter((i) => i.isChecked).length

            return acc
        },
        { total: 0, done: 0 }
    )
    if (totals.total === 0) return 0

    return Math.round((totals.done / totals.total) * 100)
}

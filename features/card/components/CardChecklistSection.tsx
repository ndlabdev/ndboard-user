import React, { useMemo, useCallback, useRef, useState, Dispatch, SetStateAction } from 'react'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { calcAllChecklistsProgress, calcChecklistProgress, renameChecklistItemSchema, useCardAddChecklistItemMutation, useCardCompleteChecklistItemMutation, useCardDeleteChecklistItemMutation, useCardDeleteChecklistMutation, useCardRenameChecklistItemMutation } from '@/features/card'
import { BoardCardChecklists, BoardCardsResponse } from '@/types'
import { CardChecklistBlock } from './CardChecklistBlock'

type Props = {
  card: BoardCardsResponse
  lists: BoardCardChecklists[]
  setLists: Dispatch<SetStateAction<BoardCardChecklists[]>>
}

export function CardChecklistSection({ card, lists, setLists }: Props) {
    const [addingMap, setAddingMap] = useState<Record<string, string>>({})
    const [busyMap, setBusyMap] = useState<Record<string, boolean>>({})
    const [addOpen, setAddOpen] = useState<Record<string, boolean>>({})
    const [deletingMap, setDeletingMap] = useState<Record<string, boolean>>({})
    const [deletingChecklistMap, setDeletingChecklistMap] = useState<Record<string, boolean>>({})
    const [togglingMap, setTogglingMap] = useState<Record<string, boolean>>({})
    const [showCheckedMap, setShowCheckedMap] = useState<Record<string, boolean>>({})
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

    const overall = useMemo(() => calcAllChecklistsProgress(lists), [lists])

    // mutations
    const renameItemMutation = useCardRenameChecklistItemMutation()
    const completeItemMutation = useCardCompleteChecklistItemMutation(card.listId)
    const deleteChecklistMutation = useCardDeleteChecklistMutation(card.listId)
    const deleteItemMutation = useCardDeleteChecklistItemMutation(card.listId)
    const addItemMutation = useCardAddChecklistItemMutation(card.listId, (res) => {
        const it = res?.data
        if (!it?.id || !it?.checklistId) return
        setLists((prev) =>
            prev.map((l) => {
                if (l.id !== it.checklistId) return l
                const next = [...l.items]
                const idx = next.findIndex((x) => x.id.startsWith('temp_') && x.name === it.name)
                if (idx >= 0) next[idx] = it
                else next.push(it)
                
                return { ...l, items: next }
            })
        )
    })

    const openAddSection = useCallback((listId: string) => {
        setAddOpen((m) => ({ ...m, [listId]: true }))
        queueMicrotask(() => inputRefs.current[listId]?.focus())
    }, [])

    const cancelAddSection = useCallback((listId: string) => {
        setAddOpen((m) => ({ ...m, [listId]: false }))
        setAddingMap((m) => ({ ...m, [listId]: '' }))
    }, [])

    const toggleShowChecked = useCallback((listId: string) => {
        setShowCheckedMap((m) => ({ ...m, [listId]: !m[listId] }))
    }, [])

    const handleToggleItem = useCallback(
        async (checklistId: string, itemId: string, next: boolean) => {
            const key = `${checklistId}:${itemId}`
            const snapshot = lists
            setLists((prev) =>
                prev.map((l) =>
                    l.id !== checklistId
                        ? l
                        : { ...l, items: l.items.map((it) => (it.id === itemId ? { ...it, isChecked: next } : it)) }
                )
            )
            setTogglingMap((m) => ({ ...m, [key]: true }))
            try {
                await completeItemMutation.mutateAsync({ id: card.id, checklistId, itemId, completed: next })
            } catch {
                setLists(snapshot)
            } finally {
                setTogglingMap(({ [key]: _omit, ...rest }) => rest)
            }
        },
        [card.id, completeItemMutation, lists, setLists]
    )

    const handleAddItem = useCallback(
        async (checklistId: string) => {
            const name = (addingMap[checklistId] ?? '').trim()
            if (!name) return
            const target = lists.find((l) => l.id === checklistId)
            const order = target ? target.items.length : 0
            const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
            const tempItem: BoardCardChecklists['items'][number] = {
                id: tempId,
                name,
                isChecked: false,
                order,
                checklistId
            }

            setBusyMap((s) => ({ ...s, [checklistId]: true }))
            setLists((prev) => prev.map((l) => (l.id === checklistId ? { ...l, items: [...l.items, tempItem] } : l)))
            setAddingMap((m) => ({ ...m, [checklistId]: '' }))

            try {
                await addItemMutation.mutateAsync({ id: card.id, name, checklistId, order })
            } catch {
                setLists((prev) => prev.map((l) => (l.id === checklistId ? { ...l, items: l.items.filter((i) => i.id !== tempId) } : l)))
            } finally {
                setBusyMap((s) => ({ ...s, [checklistId]: false }))
            }
        },
        [addingMap, addItemMutation, card.id, lists, setLists]
    )

    const handleDeleteChecklist = useCallback(
        async (checklistId: string) => {
            const snapshot = lists
            setLists((prev) => prev.filter((l) => l.id !== checklistId))
            setDeletingChecklistMap((m) => ({ ...m, [checklistId]: true }))
            try {
                await deleteChecklistMutation.mutateAsync({ id: card.id, checklistId })
            } catch {
                setLists(snapshot)
            } finally {
                setDeletingChecklistMap(({ [checklistId]: _omit, ...rest }) => rest)
            }
        },
        [card.id, deleteChecklistMutation, lists, setLists]
    )

    const handleDeleteItem = useCallback(
        async (checklistId: string, itemId: string) => {
            const key = `${checklistId}:${itemId}`
            const snapshot = lists
            setLists((prev) =>
                prev.map((l) => (l.id === checklistId ? { ...l, items: l.items.filter((i) => i.id !== itemId) } : l))
            )
            setDeletingMap((m) => ({ ...m, [key]: true }))
            try {
                await deleteItemMutation.mutateAsync({ id: card.id, checklistId, itemId })
            } catch {
                setLists(snapshot)
            } finally {
                setDeletingMap(({ [key]: _omit, ...rest }) => rest)
            }
        },
        [card.id, deleteItemMutation, lists, setLists]
    )

    const handleRenameItem = useCallback(
        async (checklistId: string, itemId: string, name: string) => {
            const parsed = renameChecklistItemSchema.safeParse({
                id: card.id,
                checklistId,
                itemId,
                name
            })
            if (!parsed.success) return

            const payload = parsed.data

            let snapshot: BoardCardChecklists[] | null = null

            setLists((prev) => {
                snapshot = prev
                
                return prev.map((list) =>
                    list.id !== checklistId
                        ? list
                        : {
                            ...list,
                            items: list.items.map((it) =>
                                it.id === itemId ? { ...it, name: payload.name } : it
                            )
                        }
                )
            })

            try {
                await renameItemMutation.mutateAsync(payload)
            } catch {
                if (snapshot) setLists(snapshot)
            }
        },
        [card.id, renameItemMutation, setLists]
    )

    const setInputRef = useCallback((listId: string, el: HTMLInputElement | null) => {
        inputRefs.current[listId] = el
    }, [])

    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
                <div className="flex items-center gap-2">
                    <div className="text-xs font-medium text-muted-foreground">Overall</div>
                    <div className="text-xs text-muted-foreground">{overall}%</div>
                </div>
                <Progress value={overall} className="mt-1" />
                <Separator className="my-3" />
            </div>

            {lists.map((list) => (
                <CardChecklistBlock
                    key={list.id}
                    cardId={card.id}
                    list={list}
                    calcChecklistProgress={calcChecklistProgress}
                    addingValue={addingMap[list.id] ?? ''}
                    isBusy={!!busyMap[list.id]}
                    addOpen={!!addOpen[list.id]}
                    deletingChecklist={!!deletingChecklistMap[list.id]}
                    showChecked={!!showCheckedMap[list.id]}
                    deletingMap={deletingMap}
                    togglingMap={togglingMap}
                    onChangeAdding={(v) => setAddingMap((m) => ({ ...m, [list.id]: v }))}
                    onOpenAdd={() => openAddSection(list.id)}
                    onCancelAdd={() => cancelAddSection(list.id)}
                    onToggleShowChecked={() => toggleShowChecked(list.id)}
                    onToggleItem={handleToggleItem}
                    onAddItem={() => handleAddItem(list.id)}
                    onDeleteChecklist={() => handleDeleteChecklist(list.id)}
                    onDeleteItem={(itemId) => handleDeleteItem(list.id, itemId)}
                    onRenameItem={(itemId, newName) => handleRenameItem(list.id, itemId, newName)}
                    setInputRef={(el) => setInputRef(list.id, el)}
                />
            ))}
        </div>
    )
}

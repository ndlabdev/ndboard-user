import { Dispatch, SetStateAction, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { calcAllChecklistsProgress, calcChecklistProgress, useCardAddChecklistItemMutation, useCardCompleteChecklistItemMutation, useCardDeleteChecklistItemMutation, useCardDeleteChecklistMutation } from '@/features/card'
import { SquareCheckBig, Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { BoardCardChecklists, BoardCardsResponse } from '@/types'

interface Props {
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

    function openAddSection(listId: string) {
        setAddOpen((m) => ({ ...m, [listId]: true }))
        queueMicrotask(() => inputRefs.current[listId]?.focus())
    }

    function cancelAddSection(listId: string) {
        setAddOpen((m) => ({ ...m, [listId]: false }))
        setAddingMap((m) => ({ ...m, [listId]: '' }))
    }

    function toggleShowChecked(listId: string) {
        setShowCheckedMap((m) => ({ ...m, [listId]: !m[listId] }))
    }

    // ====== mutation: complete checklist item ======
    const completeItemMutation = useCardCompleteChecklistItemMutation()

    // ====== mutation: delete checklist ======
    const deleteChecklistMutation = useCardDeleteChecklistMutation()

    // ====== mutation: delete checklist item ======
    const deleteItemMutation = useCardDeleteChecklistItemMutation()

    // ====== mutation: add checklist item ======
    const addItemMutation = useCardAddChecklistItemMutation(
    // onSuccess
        (res) => {
            // NOTE: We reconcile the temp item with the real one returned by API.
            // Expecting shape: { data: { id, name, isChecked, order, checklistId }, meta?: {...} }
            const serverItem = res?.data
            const checklistId: string = serverItem?.checklistId

            if (!checklistId || !serverItem?.id) return

            setLists((prev) =>
                prev.map((list) => {
                    if (list.id !== checklistId) return list
                    // Replace the first temp item that has the same name and is temp-id
                    const nextItems = [...list.items]
                    const idx = nextItems.findIndex((i) => i.id.startsWith('temp_') && i.name === serverItem.name)
                    if (idx >= 0) nextItems[idx] = { ...nextItems[idx], ...serverItem, id: serverItem.id }
                    else nextItems.push(serverItem) // fallback if we didn't find temp
                    
                    return { ...list, items: nextItems }
                })
            )
        }
    )

    const handleToggleItem = async (checklistId: string, itemId: string, next: boolean) => {
        const itemKey = `${checklistId}:${itemId}`

        // optimistic update
        const snapshot = lists
        setLists((prev) =>
            prev.map((list) =>
                list.id !== checklistId
                    ? list
                    : {
                        ...list,
                        items: list.items.map((it) =>
                            it.id === itemId ? { ...it, isChecked: next } : it
                        )
                    }
            )
        )
        setTogglingMap((m) => ({ ...m, [itemKey]: true }))

        try {
            await completeItemMutation.mutateAsync({
                id: card.id,
                checklistId,
                itemId,
                completed: next
            })
        } catch {
            // revert on error
            setLists(snapshot)
        } finally {
            setTogglingMap((m) => {
                const { [itemKey]: _, ...rest } = m
                
                return rest
            })
        }
    }

    const handleAddItem = async (checklistId: string) => {
        const name = (addingMap[checklistId] ?? '').trim()
        if (!name) return

        const target = lists.find((l) => l.id === checklistId)
        const order = target ? target.items.length : 0

        // create a temp id for optimistic UI
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

        const tempItem: BoardCardChecklists['items'][number] = {
            id: tempId,
            name,
            isChecked: false,
            order,
            checklistId
        }

        setBusyMap((s) => ({ ...s, [checklistId]: true }))
        setLists((prev) =>
            prev.map((list) =>
                list.id !== checklistId
                    ? list
                    : { ...list, items: [...list.items, tempItem] }
            )
        )
        setAddingMap((m) => ({ ...m, [checklistId]: '' }))

        try {
            // await onAddItem?.(checklistId, name)
            await addItemMutation.mutateAsync({
                id: card.id,
                name,
                checklistId,
                order
            })
        } catch {
            setLists((prev) =>
                prev.map((list) =>
                    list.id !== checklistId
                        ? list
                        : { ...list, items: list.items.filter((i) => i.id !== tempId) }
                )
            )
        } finally {
            setBusyMap((s) => ({ ...s, [checklistId]: false }))
        }
    }

    const handleDeleteChecklist = async (checklistId: string) => {
        // optimistic snapshot
        const snapshot = lists

        // optimistic remove
        setLists((prev) => prev.filter((l) => l.id !== checklistId))
        setDeletingChecklistMap((m) => ({ ...m, [checklistId]: true }))

        try {
            await deleteChecklistMutation.mutateAsync({
                id: card.id,
                checklistId
            })
        } catch {
            // revert on error
            setLists(snapshot)
        } finally {
            setDeletingChecklistMap((m) => {
                const { [checklistId]: _, ...rest } = m
                
                return rest
            })
        }
    }

    const handleDeleteItem = async (checklistId: string, itemId: string) => {
        const itemKey = `${checklistId}:${itemId}`

        // optimistic snapshot to revert on error
        const snapshot = lists

        // optimistic remove
        setLists((prev) =>
            prev.map((list) =>
                list.id !== checklistId
                    ? list
                    : { ...list, items: list.items.filter((i) => i.id !== itemId) }
            )
        )

        // lock the button for this item
        setDeletingMap((m) => ({ ...m, [itemKey]: true }))

        try {
            // IMPORTANT: your API path expects `id` = card.id
            await deleteItemMutation.mutateAsync({
                id: card.id,
                checklistId,
                itemId
            })
        } catch {
            // revert on error
            setLists(snapshot)
        } finally {
            setDeletingMap((m) => {
                const { [itemKey]: _, ...rest } = m
                
                return rest
            })
        }
    }
  
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
        
            {/* Per-checklist blocks with own progress */}
            {lists.map((list) => {
                const per = calcChecklistProgress(list)
                const isBusy = !!busyMap[list.id]

                return (
                    <div key={list.id} className="col-span-12">
                        <div className="rounded-lg border bg-card p-3">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <SquareCheckBig className="size-4" />
                                    <h5 className="text-sm font-semibold">{list.title}</h5>
                                </div>

                                <div className="flex items-center">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => toggleShowChecked(list.id)}
                                    >
                                        {showCheckedMap[list.id] ? 'Hide Checked' : 'Show Checked'}
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 px-2 text-destructive hover:text-destructive"
                                        onClick={() => handleDeleteChecklist(list.id)}
                                        disabled={!!deletingChecklistMap[list.id]}
                                    >
                                        <Trash className="mr-1 size-4" />
                                        Delete
                                    </Button>
                                </div>
                            </div>

                            {/* Per-checklist progress (the only progress shown by default) */}
                            <div className="mt-2 flex items-center gap-2">
                                <div className="text-xs text-muted-foreground">{per}%</div>
                                <Progress value={per} />
                            </div>

                            <Separator className="my-3" />

                            {/* Items */}
                            {(!showCheckedMap[list.id] && per === 100 && list.items.length > 0) ? (
                                <p className="mt-2 text-sm text-green-600 font-medium">
                                    Everything in this checklist is complete!
                                </p>
                            ) : (
                                <ul className="space-y-2">
                                    {list.items
                                        .filter((item) => {
                                            if (!showCheckedMap[list.id] && item.isChecked) return false
                                        
                                            return true
                                        })
                                        .map((item) => (
                                            <li key={item.id} className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`chk-${list.id}-${item.id}`}
                                                        checked={item.isChecked}
                                                        onCheckedChange={(checked) =>
                                                            handleToggleItem(list.id, item.id, Boolean(checked))
                                                        }
                                                        aria-label={item.name}
                                                        disabled={
                                                            !!togglingMap[`${list.id}:${item.id}`] ||
                                                    !!deletingMap[`${list.id}:${item.id}`]
                                                        }
                                                    />
                                                    <Label
                                                        htmlFor={`chk-${list.id}-${item.id}`}
                                                        className={cn(
                                                            'text-sm cursor-pointer select-none',
                                                            item.isChecked && 'text-muted-foreground line-through'
                                                        )}
                                                    >
                                                        {item.name}
                                                    </Label>
                                                </div>

                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => handleDeleteItem(list.id, item.id)}
                                                    aria-label="Delete item"
                                                    disabled={!!deletingMap[`${list.id}:${item.id}`]}
                                                >
                                                    <Trash className="size-4" />
                                                </Button>
                                            </li>
                                        ))}
                                </ul>
                            )}

                            {/* Add item */}
                            <div className="mt-3">
                                {!addOpen[list.id] ? (
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => openAddSection(list.id)}
                                        disabled={isBusy}
                                    >
                                        Add an item
                                    </Button>
                                ) : (
                                // Expanded state: input + actions
                                    <div className="flex items-center gap-2">
                                        <Input
                                            ref={(el) => {
                                                inputRefs.current[list.id] = el
                                            }}
                                            placeholder="Add an item"
                                            value={addingMap[list.id] ?? ''}
                                            onChange={(e) =>
                                                setAddingMap((m) => ({ ...m, [list.id]: e.target.value }))
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleAddItem(list.id)
                                                if (e.key === 'Escape') cancelAddSection(list.id)
                                            }}
                                        />
                                        <Button
                                            size="sm"
                                            onClick={() => handleAddItem(list.id)}
                                            disabled={isBusy}
                                        >
                                            Add
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => cancelAddSection(list.id)}
                                            disabled={isBusy}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

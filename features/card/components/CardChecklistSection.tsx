import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { calcAllChecklistsProgress, calcChecklistProgress } from '@/features/card'
import { SquareCheckBig, Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export function CardChecklistSection({ card }) {
    const [lists, setLists] = useState<Checklist[]>(card?.checklists ?? [])
    const [addingMap, setAddingMap] = useState<Record<string, string>>({}) // checklistId -> input value
    const [busyMap, setBusyMap] = useState<Record<string, boolean>>({})
    const [addOpen, setAddOpen] = useState<Record<string, boolean>>({})
    const inputRefs = useRef<Record<string, HTMLInputElement>>({})

    const overall = useMemo(() => calcAllChecklistsProgress(lists), [lists])

    function openAddSection(listId: string) {
        setAddOpen((m) => ({ ...m, [listId]: true }))
        queueMicrotask(() => inputRefs.current[listId]?.focus())
    }

    function cancelAddSection(listId: string) {
        setAddOpen((m) => ({ ...m, [listId]: false }))
        setAddingMap((m) => ({ ...m, [listId]: '' }))
    }

    const handleToggleItem = async (checklistId: string, itemId: string, next: boolean) => {
    // optimistic update
        setLists((prev) =>
            prev.map((list) =>
                list.id !== checklistId
                    ? list
                    : {
                        ...list,
                        items: list.items.map((it) => (it.id === itemId ? { ...it, isChecked: next } : it))
                    }
            )
        )

        try {
            // await onToggleItem?.(checklistId, itemId, next)
        } catch {
            // revert on error
            setLists((prev) =>
                prev.map((list) =>
                    list.id !== checklistId
                        ? list
                        : {
                            ...list,
                            items: list.items.map((it) => (it.id === itemId ? { ...it, isChecked: !next } : it))
                        }
                )
            )
        }
    }

    const handleAddItem = async (checklistId: string) => {
        const name = (addingMap[checklistId] ?? '').trim()
        if (!name) return

        // create a temp id for optimistic UI
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

        setBusyMap((s) => ({ ...s, [checklistId]: true }))
        setLists((prev) =>
            prev.map((list) =>
                list.id !== checklistId
                    ? list
                    : { ...list, items: [...list.items, { id: tempId, name, isChecked: false }] }
            )
        )
        setAddingMap((m) => ({ ...m, [checklistId]: '' }))

        try {
            // await onAddItem?.(checklistId, name)
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
        const snapshot = lists
        setLists((prev) => prev.filter((l) => l.id !== checklistId))
        try {
            // await onDeleteChecklist?.(checklistId)
        } catch {
            setLists(snapshot)
        }
    }

    const handleDeleteItem = async (checklistId: string, itemId: string) => {
        const snapshot = lists
        setLists((prev) =>
            prev.map((list) =>
                list.id !== checklistId ? list : { ...list, items: list.items.filter((i) => i.id !== itemId) }
            )
        )
        try {
            // await onDeleteItem?.(checklistId, itemId)
        } catch {
            setLists(snapshot)
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

                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 px-2 text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteChecklist(list.id)}
                                >
                                    <Trash className="mr-1 size-4" />
                                    Delete
                                </Button>
                            </div>

                            {/* Per-checklist progress (the only progress shown by default) */}
                            <div className="mt-2 flex items-center gap-2">
                                <div className="text-xs text-muted-foreground">{per}%</div>
                                <Progress value={per} />
                            </div>

                            <Separator className="my-3" />

                            {/* Items */}
                            <ul className="space-y-2">
                                {list.items.map((item) => (
                                    <li key={item.id} className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={item.isChecked}
                                                onCheckedChange={(checked) =>
                                                    handleToggleItem(list.id, item.id, Boolean(checked))
                                                }
                                                aria-label={item.name}
                                            />
                                            <span className={cn('text-sm', item.isChecked && 'text-muted-foreground line-through')}>
                                                {item.name}
                                            </span>
                                        </div>

                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={() => handleDeleteItem(list.id, item.id)}
                                            aria-label="Delete item"
                                        >
                                            <Trash className="size-4" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>

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
                                            ref={(el) => (inputRefs.current[list.id] = el)}
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

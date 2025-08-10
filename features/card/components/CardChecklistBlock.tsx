import React, { memo, useMemo, KeyboardEventHandler } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { SquareCheckBig, Trash } from 'lucide-react'
import { BoardCardChecklists } from '@/types'
import { CardChecklistItem } from './CardChecklistItem'

type Props = {
    cardId: string
    list: BoardCardChecklists
    calcChecklistProgress: (_l: BoardCardChecklists) => number
    addingValue: string
    isBusy: boolean
    addOpen: boolean
    deletingChecklist: boolean
    showChecked: boolean
    deletingMap: Record<string, boolean>
    togglingMap: Record<string, boolean>
    onChangeAdding: (_v: string) => void
    onOpenAdd: () => void
    onCancelAdd: () => void
    onToggleShowChecked: () => void
    onToggleItem: (_checklistId: string, _itemId: string, _next: boolean) => void
    onAddItem: () => void
    onDeleteChecklist: () => void
    onDeleteItem: (_itemId: string) => void
    setInputRef: (_el: HTMLInputElement | null) => void
}

export const CardChecklistBlock = memo(function CardChecklistBlock({
    list,
    calcChecklistProgress,
    addingValue,
    isBusy,
    addOpen,
    deletingChecklist,
    showChecked,
    deletingMap,
    togglingMap,
    onChangeAdding,
    onOpenAdd,
    onCancelAdd,
    onToggleShowChecked,
    onToggleItem,
    onAddItem,
    onDeleteChecklist,
    onDeleteItem,
    setInputRef
}: Props) {
    const per = useMemo(() => calcChecklistProgress(list), [list, calcChecklistProgress])

    const filteredItems = useMemo(
        () => list.items.filter((it) => (showChecked ? true : !it.isChecked)),
        [list.items, showChecked]
    )

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') onAddItem()
        if (e.key === 'Escape') onCancelAdd()
    }

    return (
        <div className="col-span-12">
            <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <SquareCheckBig className="size-4" />
                        <h5 className="text-sm font-semibold">{list.title}</h5>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={onToggleShowChecked}>
                            {showChecked ? 'Hide Checked' : 'Show Checked'}
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-destructive hover:text-destructive"
                            onClick={onDeleteChecklist}
                            disabled={deletingChecklist}
                        >
                            <Trash className="mr-1 size-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="mt-2 flex items-center gap-2">
                    <div className="text-xs text-muted-foreground">{per}%</div>
                    <Progress value={per} />
                </div>

                <Separator className="my-3" />

                {!showChecked && per === 100 && list.items.length > 0 ? (
                    <p className="mt-2 text-sm text-green-600 font-medium">
                        Everything in this checklist is complete!
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {filteredItems.map((item) => {
                            const key = `${list.id}:${item.id}`
                            
                            return (
                                <CardChecklistItem
                                    key={item.id}
                                    listId={list.id}
                                    item={item}
                                    disabled={!!togglingMap[key] || !!deletingMap[key]}
                                    onToggle={(next) => onToggleItem(list.id, item.id, next)}
                                    onDelete={() => onDeleteItem(item.id)}
                                />
                            )
                        })}
                    </ul>
                )}

                <div className="mt-3">
                    {!addOpen ? (
                        <Button size="sm" variant="secondary" onClick={onOpenAdd} disabled={isBusy}>
                            Add an item
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Input
                                ref={setInputRef}
                                placeholder="Add an item"
                                value={addingValue}
                                onChange={(e) => onChangeAdding(e.target.value)}
                                onKeyDown={onKeyDown}
                            />
                            <Button size="sm" onClick={onAddItem} disabled={isBusy}>
                                Add
                            </Button>
                            <Button size="sm" variant="secondary" onClick={onCancelAdd} disabled={isBusy}>
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
})

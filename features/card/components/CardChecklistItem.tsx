import React, { memo } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BoardCardChecklists } from '@/types'

type Item = BoardCardChecklists['items'][number]

type Props = {
  listId: string
  item: Item
  disabled?: boolean
  onToggle: (_next: boolean) => void
  onDelete: () => void
}

export const CardChecklistItem = memo(function CardChecklistItem({
    listId,
    item,
    disabled,
    onToggle,
    onDelete
}: Props) {
    const inputId = `chk-${listId}-${item.id}`
    
    return (
        <li className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                <Checkbox
                    id={inputId}
                    checked={item.isChecked}
                    onCheckedChange={(c) => onToggle(Boolean(c))}
                    aria-label={item.name}
                    disabled={disabled}
                />
                <Label
                    htmlFor={inputId}
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
                onClick={onDelete}
                aria-label="Delete item"
                disabled={disabled}
            >
                <Trash className="size-4" />
            </Button>
        </li>
    )
})

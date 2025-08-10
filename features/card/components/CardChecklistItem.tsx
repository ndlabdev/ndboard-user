// CardChecklistItem.tsx
import React, { memo, useEffect, useRef, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  onRename: (_newName: string) => void
}

export const CardChecklistItem = memo(function CardChecklistItem({
    listId,
    item,
    disabled,
    onToggle,
    onDelete,
    onRename
}: Props) {
    const inputId = `chk-${listId}-${item.id}`
    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState(item.name)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus()
            inputRef.current?.select()
        }
    }, [editing])

    useEffect(() => {
        setValue(item.name)
    }, [item.name])

    const commit = () => {
        const next = value.trim()
        setEditing(false)
        if (next && next !== item.name) onRename(next)
    }

    const cancel = () => {
        setValue(item.name)
        setEditing(false)
    }

    return (
        <li className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                <Checkbox
                    id={inputId}
                    checked={item.isChecked}
                    onCheckedChange={(c) => onToggle(Boolean(c))}
                    aria-label={item.name}
                    disabled={disabled || editing}
                />

                {editing ? (
                    <Input
                        ref={inputRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={commit}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') commit()
                            if (e.key === 'Escape') cancel()
                        }}
                        disabled={disabled}
                        className="h-7"
                    />
                ) : (
                    <Label
                        htmlFor={inputId}
                        onClick={() => !disabled && setEditing(true)}
                        className={cn(
                            'text-sm cursor-pointer select-none',
                            item.isChecked && 'text-muted-foreground line-through'
                        )}
                        title="Click to rename"
                    >
                        {item.name}
                    </Label>
                )}
            </div>

            <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={onDelete}
                aria-label="Delete item"
                disabled={disabled || editing}
            >
                <Trash className="size-4" />
            </Button>
        </li>
    )
})

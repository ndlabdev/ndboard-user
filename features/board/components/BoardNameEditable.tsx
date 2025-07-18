import { memo, RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'

interface Props {
    name: string
    textColor: string
    onUpdate?: (_newName: string) => void
}

export const BoardNameEditable = memo(function BoardNameEditable({
    name,
    textColor,
    onUpdate
}: Props) {
    const [editing, setEditing] = useState(false)
    const [boardName, setBoardName] = useState(name)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setBoardName(name)
    }, [name])

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus()
            inputRef.current?.select()
        }
    }, [editing])

    const handleDoneEdit = useCallback(() => {
        setEditing(false)
        const newName = boardName.trim()
        if (newName && newName !== name) {
            onUpdate?.(newName)
        } else {
            setBoardName(name)
        }
    }, [boardName, name, onUpdate])

    useOnClickOutside(wrapperRef as RefObject<HTMLElement>, () => {
        if (editing) handleDoneEdit()
    })

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur()
        } else if (e.key === 'Escape') {
            setEditing(false)
            setBoardName(name)
        }
    }, [name])

    const inputClass = textColor === 'white'
        ? 'text-white placeholder:text-white/80'
        : 'text-black placeholder:text-black/80'

    return (
        <div ref={wrapperRef} className="inline-block">
            {editing ? (
                <Input
                    ref={inputRef}
                    value={boardName}
                    className={`${inputClass} font-semibold text-base px-1 h-6 w-[220px] max-w-xs bg-transparent border-none shadow-none`}
                    onChange={(e) => setBoardName(e.target.value)}
                    onBlur={handleDoneEdit}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    aria-label="Edit board name"
                />
            ) : (
                <span
                    className="cursor-pointer select-none"
                    tabIndex={0}
                    role="button"
                    aria-label="Edit board name"
                    onClick={() => setEditing(true)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setEditing(true)}
                >
                    <h1 className={`font-semibold text-base ${textColor === 'white' ? 'text-white' : 'text-black'}`}>
                        {name}
                    </h1>
                </span>
            )}
        </div>
    )
})

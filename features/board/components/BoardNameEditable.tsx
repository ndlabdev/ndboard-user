import { memo, RefObject, useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'

interface Props {
    name: string
    coverImageUrl: string
    onUpdate?: (_newName: string) => void
}

function getTextColorByBg(hex: string): 'black' | 'white' {
    hex = hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000

    return brightness > 150 ? 'black' : 'white'
}

export const BoardNameEditable = memo(function BoardNameEditable({
    name,
    coverImageUrl,
    onUpdate
}: Props) {
    const [editing, setEditing] = useState(false)
    const [boardName, setBoardName] = useState(name)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setBoardName(name)
    }, [name])

    useOnClickOutside(inputRef as RefObject<HTMLInputElement>, () => {
        setEditing(false)
        setBoardName(name)
    })

    const textColor = getTextColorByBg(coverImageUrl)

    return (
        <div className="inline-block py-2.5 px-4 backdrop-blur-md bg-black/10 shadow-lg">
            {editing ? (
                <Input
                    ref={inputRef}
                    autoFocus
                    value={boardName}
                    className={`
                        ${textColor === 'white' ? 'text-white placeholder:text-white/80' : 'text-black placeholder:text-black/80'}
                        font-semibold text-base px-1
                        w-[220px] max-w-xs
                        bg-transparent border-none shadow-none
                    `}
                    onChange={(e) => setBoardName(e.target.value)}
                    onBlur={() => {
                        setEditing(false)
                        if (boardName.trim() && boardName !== name) {
                            onUpdate?.(boardName.trim())
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            (e.target as HTMLInputElement).blur()
                        } else if (e.key === 'Escape') {
                            setEditing(false)
                            setBoardName(name)
                        }
                    }}
                />
            ) : (
                <span
                    className="cursor-pointer select-none"
                    onClick={() => setEditing(true)}
                >
                    <h1 className={`font-semibold text-base ${textColor === 'white' ? 'text-white' : 'text-black'}`}>
                        {name}
                    </h1>
                </span>
            )}
        </div>
    )
})

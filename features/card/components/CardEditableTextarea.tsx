'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useCardUpdateMutation } from '@/features/card'

interface EditableTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string
  cardId: string
  placeholder?: string
}

export function EditableTextarea({
    value,
    cardId,
    placeholder = '',
    className = '',
    ...props
}: EditableTextareaProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [internalValue, setInternalValue] = useState(value)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const { mutate } = useCardUpdateMutation()

    useEffect(() => {
        if (isEditing) {
            textareaRef.current?.focus()
            textareaRef.current?.select()
        }
    }, [isEditing])

    useEffect(() => {
        setInternalValue(value)
    }, [value])

    const handleSubmit = () => {
        if (internalValue.trim() !== '' && internalValue !== value) {
            mutate({
                id: cardId,
                name: internalValue
            })
        }
        setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }

        if (e.key === 'Escape') {
            setInternalValue(value)
            setIsEditing(false)
        }
    }

    return isEditing ? (
        <textarea
            ref={textareaRef}
            value={internalValue}
            onChange={(e) => setInternalValue(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            className={`w-full font-semibold text-xl px-1 py-0 resize-none bg-transparent outline-none ${className}`}
            rows={1}
            {...props}
        />
    ) : (
        <div
            onClick={() => setIsEditing(true)}
            className="w-full font-semibold text-xl px-1 py-0 cursor-pointer"
        >
            {value || placeholder}
        </div>
    )
}

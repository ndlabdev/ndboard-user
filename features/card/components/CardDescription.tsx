'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import type { JSONContent } from '@tiptap/core'
import { CardDescriptionEditor } from './CardDescriptionEditor'
import { CardDescriptionViewer } from './CardDescriptionViewer'
import { useCardUpdateMutation } from '@/features/card'
import { BoardCardsResponse } from '@/types'

type Props = {
    card: BoardCardsResponse
    initial?: JSONContent | null
    onPersist?: (_json: JSONContent) => Promise<void> | void
}

const EMPTY_DOC: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] }

export function CardDescription({ card, onPersist }: Props) {
    const [doc, setDoc] = useState<JSONContent | null>(card.description)
    const [isEditing, setIsEditing] = useState(false)
    const [draft, setDraft] = useState<JSONContent | null>(null)
    const lastStrRef = useRef<string>('')

    const { mutate } = useCardUpdateMutation()

    const stringify = useCallback((j: JSONContent | null) => {
        try { return JSON.stringify(j) } catch { return '' }
    }, [])

    const startEdit = useCallback(() => {
        const next = doc ?? EMPTY_DOC
        setDraft(next)
        lastStrRef.current = stringify(next)
        setIsEditing(true)
    }, [doc, stringify])

    const cancelEdit = useCallback(() => {
        setIsEditing(false)
        setDraft(null)
    }, [])

    const onDraftChange = useCallback((next: JSONContent) => {
        const s = stringify(next)
        if (s === lastStrRef.current) return
        lastStrRef.current = s
        setDraft(next)
    }, [stringify])

    const saveEdit = useCallback(async () => {
        const payload = draft ?? EMPTY_DOC
        await onPersist?.(payload)
        setDoc(payload)
        setIsEditing(false)
        setDraft(null)

        mutate({
            id: card.id,
            description: payload
        })
    }, [draft, onPersist, mutate, card.id])

    const header = useMemo(() => (
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Description</h1>
            {!isEditing ? (
                <button
                    type="button"
                    className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200"
                    onClick={startEdit}
                >
                    Edit
                </button>
            ) : (
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="px-3 py-1.5 rounded bg-black text-white hover:opacity-90"
                        onClick={saveEdit}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200"
                        onClick={cancelEdit}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    ), [isEditing, startEdit, saveEdit, cancelEdit])

    return (
        <section className="space-y-4">
            {header}

            {!isEditing && <CardDescriptionViewer json={doc} />}

            {isEditing && (
                <CardDescriptionEditor
                    initial={draft}
                    readOnly={false}
                    onChange={onDraftChange}
                    onSave={async (json) => { setDraft(json); await saveEdit() }}
                />
            )}
        </section>
    )
}

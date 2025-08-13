'use client'

import { useMemo } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Link from '@tiptap/extension-link'
import type { JSONContent } from '@tiptap/core'

type Props = {
  json?: JSONContent | null
  className?: string
}

const EMPTY_DOC: JSONContent = {
    type: 'doc',
    content: [{ type: 'paragraph' }]
}

export function CardDescriptionViewer({ json, className }: Props) {
    const extensions = useMemo(
        () => [
            StarterKit,
            TaskList,
            TaskItem.configure({ nested: true }),
            Link.configure({ openOnClick: true })
        ],
        []
    )

    const editor = useEditor({
        editable: false,
        extensions,
        content: json ?? EMPTY_DOC,
        immediatelyRender: false
    })

    if (!editor) return null

    return (
        <div className={className ?? 'prose max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-blockquote:my-3 prose-pre:my-3'}>
            <EditorContent editor={editor} />
        </div>
    )
}

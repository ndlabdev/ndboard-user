'use client'

import { useCallback, useMemo } from 'react'
import type { KeyboardEvent } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import type { Editor, JSONContent } from '@tiptap/core'

/** Generic, typed debounce (no any) */
function debounce<TArgs extends unknown[]>(
    fn: (..._args: TArgs) => void,
    ms = 400
) {
    let t: ReturnType<typeof setTimeout> | undefined
    
    return (...args: TArgs) => {
        if (t) clearTimeout(t)
        t = setTimeout(() => fn(...args), ms)
    }
}

type Props = {
  initial?: JSONContent | string | null
  readOnly?: boolean
  onChange?: (_json: JSONContent) => void
  onSave?: (_json: JSONContent) => Promise<void> | void
}

export function CardDescriptionEditor({
    initial,
    readOnly,
    onChange,
    onSave
}: Props) {
    const reportChange = useMemo(
        () =>
            debounce((json: JSONContent) => {
                onChange?.(json)
            }, 400),
        [onChange]
    )

    const editor = useEditor({
        editable: !readOnly,
        autofocus: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                codeBlock: {},
                blockquote: {}
            }),
            Link.configure({
                openOnClick: true,
                autolink: true,
                linkOnPaste: true
            }),
            Placeholder.configure({ placeholder: 'Write a description…' }),
            TaskList,
            TaskItem.configure({ nested: true })
        ],
        content:
      initial ??
      ({
          type: 'doc',
          content: [{ type: 'paragraph' }]
      } satisfies JSONContent),
        onUpdate: ({ editor }) => {
            reportChange(editor.getJSON())
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'focus:outline-none'
            }
        }
    })

    const handleKeyDown = useCallback(
        async (e: KeyboardEvent<HTMLDivElement>) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
                e.preventDefault()
                const json = editor?.getJSON()
                if (json && onSave) await onSave(json)
            }
        },
        [editor, onSave]
    )

    if (!editor) return null

    return (
        <div className="space-y-2" onKeyDown={handleKeyDown}>
            <Toolbar editor={editor} />
            <div className="prose max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-blockquote:my-3 prose-pre:my-3 rounded-lg border p-3">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

function Toolbar({ editor }: { editor: Editor }) {
    const btn = (active: boolean) =>
        `px-2 py-1 rounded ${active ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`

    return (
        <div className="flex flex-wrap gap-2">
            <button
                className={btn(editor.isActive('bold'))}
                onClick={() => editor.chain().focus().toggleBold().run()}
                type="button"
            >
                <b>B</b>
            </button>
            <button
                className={btn(editor.isActive('italic'))}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                type="button"
            >
                <i>I</i>
            </button>
            <button
                className={btn(editor.isActive('strike'))}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                type="button"
            >
                S
            </button>

            <button
                className={btn(editor.isActive('heading', { level: 1 }))}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                type="button"
            >
                H1
            </button>
            <button
                className={btn(editor.isActive('heading', { level: 2 }))}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                type="button"
            >
                H2
            </button>

            <button
                className={btn(editor.isActive('bulletList'))}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                type="button"
            >
                • List
            </button>
            <button
                className={btn(editor.isActive('orderedList'))}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                type="button"
            >
                1. List
            </button>

            <button
                className={btn(editor.isActive('taskList'))}
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                type="button"
            >
                ☑ Task
            </button>

            <button
                className={btn(editor.isActive('blockquote'))}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                type="button"
            >
                ❝ ❞
            </button>
            <button
                className={btn(editor.isActive('codeBlock'))}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                type="button"
            >
                {'<>'}
            </button>

            <button
                className={btn(false)}
                onClick={() => {
                    const url = window.prompt('Enter URL')
                    if (url) editor.chain().focus().setLink({ href: url }).run()
                }}
                type="button"
            >
                Link
            </button>
            <button
                className={btn(false)}
                onClick={() => editor.chain().focus().unsetLink().run()}
                type="button"
            >
                Unlink
            </button>
        </div>
    )
}

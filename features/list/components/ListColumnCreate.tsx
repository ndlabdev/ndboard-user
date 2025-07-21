import { useState } from 'react'
import { useListCreateMutation } from '@/features/list'
import { Loader2Icon, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { BoardDetailResponse } from '@/types'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
    board: BoardDetailResponse['data']
}

export function ListColumnCreate({ board }: Props) {
    const queryClient = useQueryClient()
    const [addingList, setAddingList] = useState<boolean>(false)
    const [newListTitle, setNewListTitle] = useState<string>('')
    const { mutateAsync, isPending } = useListCreateMutation()

    async function submitAddList() {
        const title = newListTitle.trim()
        if (!title) return

        await mutateAsync({
            boardId: board.id,
            name: title
        }, {
            onSuccess: ({ data }) => {
                toast.success('List Created Successfully!', {
                    description: 'Your new list has been created.'
                })

                queryClient.setQueryData(['boards', board.shortLink], (old: BoardDetailResponse | undefined) => {
                    if (!old || !old.data) return old

                    return {
                        ...old,
                        data: {
                            ...old.data,
                            lists: [...old.data.lists, data]
                        }
                    }
                })
            },
            onError: (error) => {
                const msg =
                    (error as { message?: string })?.message ||
                    'Create List Failed'

                toast.error(msg)
            }
        })

        setAddingList(false)
        setNewListTitle('')
    }

    return (
        <li className="list-none flex-none flex flex-col w-72 bg-white/90 rounded-xl max-h-full">
            {!addingList ? (
                <header
                    className="cursor-pointer select-none"
                    onClick={() => setAddingList(true)}
                >
                    <div className="flex items-center justify-start gap-1 px-4 py-3">
                        <Plus />
                        <h3>Add another list</h3>
                    </div>
                </header>
            ) : (
                <div className="flex flex-col gap-2 p-2">
                    <Textarea
                        value={newListTitle}
                        placeholder="Enter list title"
                        aria-placeholder="Enter list title"
                        autoFocus
                        onChange={(e) => setNewListTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                submitAddList()
                            }
                        }}
                    />

                    <div className="flex gap-1">
                        <Button type="submit" size="sm" disabled={isPending} onClick={() => submitAddList()}>
                            {isPending ? (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    Loading...
                                </>
                            ) : 'Add List'}
                        </Button>

                        <Button
                            type="reset"
                            size="sm"
                            variant="ghost"
                            disabled={isPending}
                            onClick={() => {
                                setAddingList(false)
                                setNewListTitle('')
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </li>
    )
}

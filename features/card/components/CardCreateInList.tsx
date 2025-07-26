import { useCardCreateMutation } from '@/features/card'
import { Dispatch, memo, SetStateAction } from 'react'
import { Copy, Loader2Icon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { TCard, TColumn } from '@/shared/data'

interface Props {
    column: TColumn
    cards: TCard[]
    addingIndex: number | 'end' | null
    setAddingIndex: Dispatch<SetStateAction<number | 'end' | null>>
    newCardTitle: string
    setNewCardTitle: Dispatch<SetStateAction<string>>
}

export const CardCreateInList = memo(function CardCreateInList({
    column,
    cards,
    addingIndex,
    setAddingIndex,
    newCardTitle,
    setNewCardTitle
}: Props) {
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useCardCreateMutation()

    async function submitAddCard(idx: number | 'end' | null) {
        const title = newCardTitle.trim()
        if (!title) {
            setAddingIndex(null)
            setNewCardTitle('')

            return
        }

        let index: number | undefined = undefined
        if (typeof idx === 'number') {
            index = idx
        } else if (idx === 'end' || idx === null) {
            index = cards.length
        }

        await mutateAsync({
            listId: column.id,
            name: title,
            index
        }, {
            onSuccess: ({ data }) => {
                queryClient.setQueryData(['cards', column.id], (old: { data: TCard[] }) => {
                    const prevCards: TCard[] = old?.data || []
                    const newCards = [...prevCards]
                    if (idx === 'end' || idx === null) {
                        newCards.push(data)
                    } else {
                        newCards.splice(idx, 0, data)
                    }

                    return { ...old, data: newCards }
                })

                toast.success('Card Created Successfully!')
            },
            onError: (error) => {
                const msg = (error as { message?: string })?.message || 'Create Card Failed'
                toast.error(msg)
            }
        })
        setAddingIndex(null)
        setNewCardTitle('')
    }

    return (
        <>
            {addingIndex === 'end' && !column.isFold ? (
                <div className="flex flex-col gap-2 px-3 my-2">
                    <Textarea
                        value={newCardTitle}
                        placeholder="Enter a title for this card"
                        autoFocus
                        className="bg-white"
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') submitAddCard('end')
                        }}
                    />
                    <div className="flex gap-1">
                        <Button size="sm" disabled={isPending} onClick={() => submitAddCard('end')}>
                            {isPending ? (
                                <>
                                    <Loader2Icon className="animate-spin" /> Loading...
                                </>
                            ) : (
                                'Add Card'
                            )}
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            disabled={isPending}
                            onClick={() => setAddingIndex(null)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-row gap-2 p-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setAddingIndex('end')
                            setNewCardTitle('')
                        }}
                        className="flex flex-grow flex-row gap-1 justify-start"
                    >
                        <Plus />
                        Add a card
                    </Button>

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setAddingIndex('end')
                            setNewCardTitle('')
                        }}
                    >
                        <Copy size={16} />
                    </Button>
                </div>
            )}
        </>
    )
})

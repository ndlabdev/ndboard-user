import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { CardItem, useCardCreateMutation } from '@/features/card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { BoardCardsResponse } from '@/types'
import { Loader2Icon, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Props {
    listId: string
    cards: BoardCardsResponse[]
    setCards?: Dispatch<SetStateAction<BoardCardsResponse[]>>
}

export function CardItemKanban({ listId, cards, setCards }: Props) {
    const [addingIndex, setAddingIndex] = useState<number | 'end' | null>(null)
    const [newCardTitle, setNewCardTitle] = useState('')
    const cardsIds = useMemo(() => cards.map((col) => col.id), [cards])
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
            listId,
            name: title,
            index
        }, {
            onSuccess: ({ data }) => {
                toast.success('Card Created Successfully!')
                if (setCards) {
                    setCards((prev) => {
                        const newCards = [...prev]
                        if (idx === 'end' || idx === null) {
                            newCards.push(data)
                        } else {
                            newCards.splice(idx, 0, data)
                        }
                        
                        return newCards
                    })
                }
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
        <SortableContext items={cardsIds} strategy={verticalListSortingStrategy}>
            <ul className="px-2 py-0 overflow-y-auto overflow-x-hidden h-full relative">
                {cards.map((card, idx) => (
                    <React.Fragment key={card.id}>
                        <div
                            className="flex items-center justify-center opacity-0 hover:opacity-100 -my-1 cursor-pointer"
                            onClick={() => {
                                setAddingIndex(idx)
                                setNewCardTitle('')
                            }}
                        >
                            <div className="w-1/2 border-1 border-dashed border-muted" />

                            <Button
                                size="icon"
                                className="size-5 rounded-sm cursor-pointer"
                                variant="default"
                            >
                                <Plus className="size-3" />
                            </Button>

                            <div className="w-1/2 border-1 border-dashed border-muted" />
                        </div>

                        {addingIndex === idx && (
                            <div className="flex flex-col gap-2 my-2">
                                <Textarea
                                    value={newCardTitle}
                                    placeholder="Enter a title for this card"
                                    autoFocus
                                    onChange={(e) => setNewCardTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') submitAddCard(idx)
                                    }}
                                />
                                <div className="flex gap-1">
                                    <Button size="sm" disabled={isPending} onClick={() => submitAddCard(idx)}>
                                        {isPending ? <><Loader2Icon className="animate-spin" /> Loading...</> : 'Add Card'}
                                    </Button>

                                    <Button size="sm" variant="ghost" disabled={isPending} onClick={() => setAddingIndex(null)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}

                        <CardItem
                            nearLastItem={idx === cards.length - 1}
                            card={card}
                        />
                    </React.Fragment>
                ))}

                <li className="sticky bottom-0 mt-2 bg-white">
                    {addingIndex === 'end' ? (
                        <div className="flex flex-col gap-2 my-2">
                            <Textarea
                                value={newCardTitle}
                                placeholder="Enter a title for this card"
                                autoFocus
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') submitAddCard('end')
                                }}
                            />
                            <div className="flex gap-1">
                                <Button size="sm" disabled={isPending} onClick={() => submitAddCard('end')}>
                                    {isPending ? <><Loader2Icon className="animate-spin" /> Loading...</> : 'Add Card'}
                                </Button>
                                <Button size="sm" variant="ghost" disabled={isPending} onClick={() => setAddingIndex(null)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            onClick={() => {
                                setAddingIndex('end')
                                setNewCardTitle('')
                            }}
                        >
                            <Plus className="mr-1" />
                            Add a card
                        </Button>
                    )}
                </li>
            </ul>
        </SortableContext>
    )
}

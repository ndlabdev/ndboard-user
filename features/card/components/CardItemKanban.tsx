import { Dispatch, SetStateAction, useMemo, useState } from 'react'
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
    const [addingCardListId, setAddingCardListId] = useState<string | null>(null)
    const [newCardTitles, setNewCardTitles] = useState<Record<string, string>>({})
    const cardsIds = useMemo(() => cards.map((col) => col.id), [cards])
    const { mutateAsync, isPending } = useCardCreateMutation()

    function openAddCard(listId: string) {
        setAddingCardListId(listId)
        setNewCardTitles((prev) => ({
            ...prev,
            [listId]: ''
        }))
    }

    function closeAddCard(listId: string) {
        setAddingCardListId(null)
        setNewCardTitles((prev) => ({
            ...prev,
            [listId]: ''
        }))
    }

    async function submitAddCard(listId: string) {
        const title = newCardTitles[listId]?.trim()
        if (!title) return closeAddCard(listId)

        await mutateAsync({
            listId,
            name: title
        }, {
            onSuccess: ({ data }) => {
                toast.success('Card Created Successfully!', {
                    description: 'Your new card has been added to the list.'
                })

                if (setCards) {
                    setCards((prev) => [...prev, data])
                }
            },
            onError: (error) => {
                const msg =
                (error as { message?: string })?.message ||
                'Create Card Failed'

                toast.error(msg)
            }
        })

        closeAddCard(listId)
    }

    return (
        <SortableContext items={cardsIds} strategy={verticalListSortingStrategy}>
            <ul className="p-2 pb-0 space-y-2 overflow-y-auto h-full">
                {cards.map((card) => (
                    <CardItem
                        key={card.id}
                        card={card}
                    />
                ))}

                {addingCardListId === listId ? (
                    <div className="flex flex-col gap-2">
                        <Textarea
                            value={newCardTitles[listId]}
                            placeholder="Enter a title for this card"
                            aria-placeholder="Enter a title for this card"
                            autoFocus
                            onChange={(e) => setNewCardTitles((prev) => ({
                                ...prev,
                                [listId]: e.target.value
                            }))}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    submitAddCard(listId)
                                }
                            }}
                        />

                        <div className="flex gap-1">
                            <Button type="submit" size="sm" disabled={isPending} onClick={() => submitAddCard(listId)}>
                                {isPending ? (
                                    <>
                                        <Loader2Icon className="animate-spin" />
                                        Loading...
                                    </>
                                ) : 'Add Card'}
                            </Button>

                            <Button
                                type="reset"
                                size="sm"
                                variant="ghost"
                                disabled={isPending}
                                onClick={() => closeAddCard(listId)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <li className="sticky bottom-0">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openAddCard(listId)}
                        >
                            <Plus />
                            Add a card
                        </Button>
                    </li>
                )}
            </ul>
        </SortableContext>
    )
}

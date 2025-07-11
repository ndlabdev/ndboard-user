import { useEffect, useMemo, useState } from 'react'
import { useCardGetListQuery, CardItem, useCardCreateMutation } from '@/features/card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CardGetListResponse } from '@/types'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
    listId: string
}

export function CardItemKanban({ listId }: Props) {
    const queryClient = useQueryClient()
    const { data: cards } = useCardGetListQuery(listId)
    const [addingCardListId, setAddingCardListId] = useState<string | null>(null)
    const [newCardTitles, setNewCardTitles] = useState<Record<string, string>>({})
    const [columns, setColumns] = useState<CardGetListResponse['data']>([])
    const cardsIds = useMemo(() => columns.map((col) => col.id), [columns])
    const { mutateAsync } = useCardCreateMutation()

    useEffect(() => {
        if (cards?.data) {
            setColumns(cards.data)
        }
    }, [cards?.data])

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
            onSuccess: () => {
                toast.success('Card Created Successfully!', {
                    description: 'Your new card has been added to the list.'
                })

                queryClient.invalidateQueries({ queryKey: ['cards', listId] })
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
                {columns.map((card) => (
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
                            <Button
                                type="submit"
                                size="sm"
                                onClick={() => submitAddCard(listId)}
                            >
                                Add Card
                            </Button>

                            <Button
                                type="reset"
                                size="sm"
                                variant="ghost"
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

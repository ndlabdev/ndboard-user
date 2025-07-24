import React, { memo, RefObject, useEffect, useRef, useState } from 'react'
import { CardDisplay, CardItem, useCardCreateMutation } from '@/features/card'
import { BoardCardsResponse } from '@/types'
import { Loader2Icon, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { useQueryClient } from '@tanstack/react-query'
import { getCardData, getCardDropTargetData, isCardData, isDraggingACard, TCard, TCardState, TColumn } from '@/shared/data'
import invariant from 'tiny-invariant'
import { isSafari } from '@/shared/is-safari'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source'
import {
    draggable,
    dropTargetForElements
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { isShallowEqual } from '@/shared/is-shallow-equal'
import {
    attachClosestEdge,
    extractClosestEdge
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { createPortal } from 'react-dom'

interface Props {
    listId: string
    column: TColumn
    card: TCard
    columnId: string
    cards: BoardCardsResponse[]
    addingIndex: number | 'end' | null
    setAddingIndex: (_idx: number | 'end' | null) => void
    newCardTitle: string
    setNewCardTitle: (_t: string) => void
    isCardsLoading?: boolean
}

const idle: TCardState = { type: 'idle' }

export const CardItemKanban = memo(function CardItemKanban({
    listId,
    column,
    cards,
    addingIndex,
    setAddingIndex,
    newCardTitle,
    setNewCardTitle,
    card,
    columnId,
    isCardsLoading = false
}: Props) {
    // const { cards } = column
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useCardCreateMutation()

    const outerRef = useRef<HTMLDivElement | null>(null)
    const innerRef = useRef<HTMLDivElement | null>(null)
    const [state, setState] = useState<TCardState>(idle)

    useEffect(() => {
        const outer = outerRef.current
        const inner = innerRef.current
        invariant(outer && inner)

        return combine(
            draggable({
                element: inner,
                getInitialData: ({ element }) =>
                    getCardData({ card, columnId, rect: element.getBoundingClientRect() }),
                onGenerateDragPreview({ nativeSetDragImage, location, source }) {
                    const data = source.data
                    invariant(isCardData(data))
                    setCustomNativeDragPreview({
                        nativeSetDragImage,
                        getOffset: preserveOffsetOnSource({ element: inner, input: location.current.input }),
                        render({ container }) {
                            // Demonstrating using a react portal to generate a preview
                            setState({
                                type: 'preview',
                                container,
                                dragging: inner.getBoundingClientRect()
                            })
                        }
                    })
                },
                onDragStart() {
                    setState({ type: 'is-dragging' })
                },
                onDrop() {
                    setState(idle)
                }
            }),
            dropTargetForElements({
                element: outer,
                getIsSticky: () => true,
                canDrop: isDraggingACard,
                getData: ({ element, input }) => {
                    const data = getCardDropTargetData({ card, columnId })

                    return attachClosestEdge(data, { element, input, allowedEdges: ['top', 'bottom'] })
                },
                onDragEnter({ source, self }) {
                    if (!isCardData(source.data)) {
                        return
                    }
                    if (source.data.card.id === card.id) {
                        return
                    }
                    const closestEdge = extractClosestEdge(self.data)
                    if (!closestEdge) {
                        return
                    }

                    setState({ type: 'is-over', dragging: source.data.rect, closestEdge })
                },
                onDrag({ source, self }) {
                    if (!isCardData(source.data)) {
                        return
                    }
                    if (source.data.card.id === card.id) {
                        return
                    }
                    const closestEdge = extractClosestEdge(self.data)
                    if (!closestEdge) {
                        return
                    }
                    // optimization - Don't update react state if we don't need to.
                    const proposed: TCardState = { type: 'is-over', dragging: source.data.rect, closestEdge }
                    setState((current) => {
                        if (isShallowEqual(proposed, current)) {
                            return current
                        }

                        return proposed
                    })
                },
                onDragLeave({ source }) {
                    if (!isCardData(source.data)) {
                        return
                    }
                    if (source.data.card.id === card.id) {
                        setState({ type: 'is-dragging-and-left-self' })

                        return
                    }
                    setState(idle)
                },
                onDrop() {
                    setState(idle)
                }
            })
        )
    }, [card, columnId])

    if (isCardsLoading) {
        return (
            <div className="px-2 pt-1 space-y-2 pb-2 min-h-[60px]">
                <Skeleton className="h-8 rounded-lg" />
                <Skeleton className="h-8 rounded-lg" />
                <Skeleton className="h-8 rounded-lg" />
            </div>
        )
    }

    async function submitAddCard(idx: number | 'end' | null) {
        // const title = newCardTitle.trim()
        // if (!title) {
        //     setAddingIndex(null)
        //     setNewCardTitle('')

        //     return
        // }

        // let index: number | undefined = undefined
        // if (typeof idx === 'number') {
        //     index = idx
        // } else if (idx === 'end' || idx === null) {
        //     index = cards.length
        // }

        // await mutateAsync({
        //     listId,
        //     name: title,
        //     index
        // }, {
        //     onSuccess: ({ data }) => {
        //         queryClient.setQueryData(['cards', listId], (old: { data: BoardCardsResponse[] }) => {
        //             const prevCards: BoardCardsResponse[] = old?.data || []
        //             const newCards = [...prevCards]
        //             if (idx === 'end' || idx === null) {
        //                 newCards.push(data)
        //             } else {
        //                 newCards.splice(idx, 0, data)
        //             }

        //             return { ...old, data: newCards }
        //         })

        //         toast.success('Card Created Successfully!')
        //     },
        //     onError: (error) => {
        //         const msg = (error as { message?: string })?.message || 'Create Card Failed'
        //         toast.error(msg)
        //     }
        // })
        // setAddingIndex(null)
        // setNewCardTitle('')
    }

    return (
        <>
            <CardDisplay outerRef={outerRef} innerRef={innerRef} state={state} card={card} />
            {state.type === 'preview'
                ? createPortal(<CardDisplay state={state} card={card} />, state.container)
                : null}
        </>
    )
})

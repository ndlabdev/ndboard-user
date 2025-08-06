import React, { memo, useEffect, useRef, useState } from 'react'
import { CardDisplay } from '@/features/card'
import { getCardData, getCardDropTargetData, isCardData, isDraggingACard, TCard, TCardState } from '@/shared/data'
import invariant from 'tiny-invariant'
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
import { BoardDetailResponse } from '@/types'

interface Props {
    card: TCard
    columnId: string
    board: BoardDetailResponse['data']
}

const idle: TCardState = { type: 'idle' }

export const CardItemKanban = memo(function CardItemKanban({
    card,
    board,
    columnId
}: Props) {
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

    return (
        <>
            <CardDisplay
                outerRef={outerRef}
                innerRef={innerRef}
                state={state}
                card={card}
                board={board}
            />
            {state.type === 'preview'
                ? createPortal(<CardDisplay state={state} card={card} board={board} />, state.container)
                : null}
        </>
    )
})

import { CardItemKanban, CardShadow } from '@/features/card'
import { ListFold } from '@/features/list'
import { BoardCardsResponse, BoardDetailResponse, BoardListsResponse } from '@/types'
import { memo, useEffect, useRef, useState } from 'react'
import invariant from 'tiny-invariant'
import {
    draggable,
    dropTargetForElements
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element'
import { unsafeOverflowAutoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { DragLocationHistory } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types'
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source'
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'
import { blockBoardPanningAttr, getColumnData, isCardData, isCardDropTargetData, isColumnData, isDraggingACard, isDraggingAColumn, settings, TCardData, TColumn, TColumnState } from '@/shared/data'
import { isShallowEqual } from '@/shared/is-shallow-equal'
import { isSafari } from '@/shared/is-safari'
import { Copy, Ellipsis, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
    index?: number
    board: BoardDetailResponse['data']
    column: TColumn
    cards: BoardCardsResponse[]
    isCardsLoading?: boolean
}

const stateStyles: { [Key in TColumnState['type']]: string } = {
    idle: 'cursor-grab',
    'is-card-over': 'outline outline-2 outline-neutral-50',
    'is-dragging': 'opacity-40',
    'is-column-over': '!bg-slate-900'
}

const idle = { type: 'idle' } satisfies TColumnState

const CardList = memo(function CardList({ column }: { column: TColumn }) {
    return column.cards.map((card) => <CardItemKanban key={card.id} card={card} columnId={column.id} />)
})

export const ListColumn = memo(function ListColumn({
    board,
    column,
    cards,
    index = 0,
    isCardsLoading = false
}: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [addingIndex, setAddingIndex] = useState<number | 'end' | null>(null)
    const [newCardTitle, setNewCardTitle] = useState('')
    const scrollableRef = useRef<HTMLDivElement | null>(null)
    const outerFullHeightRef = useRef<HTMLDivElement | null>(null)
    const headerRef = useRef<HTMLDivElement | null>(null)
    const innerRef = useRef<HTMLDivElement | null>(null)
    const [state, setState] = useState<TColumnState>(idle)

    useEffect(() => {
        const outer = outerFullHeightRef.current
        const scrollable = scrollableRef.current
        const header = headerRef.current
        const inner = innerRef.current
        invariant(outer)
        invariant(scrollable)
        invariant(header)
        invariant(inner)

        const data = getColumnData({ column })

        function setIsCardOver({ data, location }: { data: TCardData; location: DragLocationHistory }) {
            const innerMost = location.current.dropTargets[0]
            const isOverChildCard = Boolean(innerMost && isCardDropTargetData(innerMost.data))

            const proposed: TColumnState = {
                type: 'is-card-over',
                dragging: data.rect,
                isOverChildCard
            }
            // optimization - don't update state if we don't need to.
            setState((current) => {
                if (isShallowEqual(proposed, current)) {
                    return current
                }

                return proposed
            })
        }

        return combine(
            draggable({
                element: header,
                getInitialData: () => data,
                onGenerateDragPreview({ source, location, nativeSetDragImage }) {
                    const data = source.data
                    invariant(isColumnData(data))
                    setCustomNativeDragPreview({
                        nativeSetDragImage,
                        getOffset: preserveOffsetOnSource({ element: header, input: location.current.input }),
                        render({ container }) {
                            // Simple drag preview generation: just cloning the current element.
                            // Not using react for this.
                            const rect = inner.getBoundingClientRect()
                            const preview = inner.cloneNode(true)
                            invariant(preview instanceof HTMLElement)
                            preview.style.width = `${rect.width}px`
                            preview.style.height = `${rect.height}px`

                            // rotation of native drag previews does not work in safari
                            if (!isSafari()) {
                                preview.style.transform = 'rotate(4deg)'
                            }

                            container.appendChild(preview)
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
                getData: () => data,
                canDrop({ source }) {
                    return isDraggingACard({ source }) || isDraggingAColumn({ source })
                },
                getIsSticky: () => true,
                onDragStart({ source, location }) {
                    if (isCardData(source.data)) {
                        setIsCardOver({ data: source.data, location })
                    }
                },
                onDragEnter({ source, location }) {
                    if (isCardData(source.data)) {
                        setIsCardOver({ data: source.data, location })

                        return
                    }
                    if (isColumnData(source.data) && source.data.column.id !== column.id) {
                        setState({ type: 'is-column-over' })
                    }
                },
                onDropTargetChange({ source, location }) {
                    if (isCardData(source.data)) {
                        setIsCardOver({ data: source.data, location })

                        return
                    }
                },
                onDragLeave({ source }) {
                    if (isColumnData(source.data) && source.data.column.id === column.id) {
                        return
                    }
                    setState(idle)
                },
                onDrop() {
                    setState(idle)
                }
            }),
            autoScrollForElements({
                canScroll({ source }) {
                    if (!settings.isOverElementAutoScrollEnabled) {
                        return false
                    }

                    return isDraggingACard({ source })
                },
                getConfiguration: () => ({ maxScrollSpeed: settings.columnScrollSpeed }),
                element: scrollable
            }),
            unsafeOverflowAutoScrollForElements({
                element: scrollable,
                getConfiguration: () => ({ maxScrollSpeed: settings.columnScrollSpeed }),
                canScroll({ source }) {
                    if (!settings.isOverElementAutoScrollEnabled) {
                        return false
                    }

                    if (!settings.isOverflowScrollingEnabled) {
                        return false
                    }

                    return isDraggingACard({ source })
                },
                getOverflow() {
                    return {
                        forTopEdge: {
                            top: 1000
                        },
                        forBottomEdge: {
                            bottom: 1000
                        }
                    }
                }
            })
        )
    }, [column])

    if (!column) return null

    return (
        <div className={`flex flex-shrink-0 select-none flex-col ${column.isFold ? 'w-14 px-0 py-3' : 'w-72'}`} ref={outerFullHeightRef}>
            <div
                className={`flex max-h-full flex-col rounded-lg bg-white ${stateStyles[state.type]}`}
                ref={innerRef}
                {...{ [blockBoardPanningAttr]: true }}
            >
                {/* Extra wrapping element to make it easy to toggle visibility of content when a column is dragging over */}
                <div
                    className={`flex max-h-full flex-col ${state.type === 'is-column-over' ? 'invisible' : ''}`}
                >
                    <ListFold
                        board={board}
                        column={column}
                        headerRef={headerRef}
                        isMenuOpen={isMenuOpen}
                        setIsMenuOpen={setIsMenuOpen}
                        setAddingIndex={setAddingIndex}
                        setNewCardTitle={setNewCardTitle}
                    />

                    <div
                        className="flex flex-col overflow-y-auto"
                        ref={scrollableRef}
                    >
                        {!column.isFold && (
                            <>
                                <CardList column={column} />
                                {state.type === 'is-card-over' && !state.isOverChildCard ? (
                                    <div className="flex-shrink-0 px-3 py-1">
                                        <CardShadow dragging={state.dragging} />
                                    </div>
                                ) : null}
                            </>
                        )}
                    </div>

                    <div className="flex flex-row gap-2 p-3">
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
                </div>
            </div>
        </div>
    )
})

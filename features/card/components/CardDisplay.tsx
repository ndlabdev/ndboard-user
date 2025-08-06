import { isSafari } from '@/shared/is-safari'
import { CardShadow } from './CardShadow'
import { TCard, TCardState } from '@/shared/data'
import { RefObject } from 'react'
import { CardItem } from './CardItem'
import { BoardDetailResponse } from '@/types'

// eslint-disable-next-line no-unused-vars
const innerStyles: { [Key in TCardState['type']]?: string } = {
    idle: 'hover:outline outline-2 outline-neutral-50 cursor-grab',
    'is-dragging': 'opacity-40'
}

// eslint-disable-next-line no-unused-vars
const outerStyles: { [Key in TCardState['type']]?: string } = {
    'is-dragging-and-left-self': 'hidden'
}

export function CardDisplay({
    card,
    state,
    outerRef,
    innerRef,
    board
}: {
    card: TCard;
    state: TCardState;
    outerRef?: RefObject<HTMLDivElement | null>;
    innerRef?: RefObject<HTMLDivElement | null>;
    board: BoardDetailResponse['data'];
}) {
    return (
        <div
            ref={outerRef}
            className={`flex flex-shrink-0 flex-col gap-2 px-3 py-1 ${outerStyles[state.type] || ''}`}
        >
            {/* Put a shadow before the item if closer to the top edge */}
            {state.type === 'is-over' && state.closestEdge === 'top' ? (
                <CardShadow dragging={state.dragging} />
            ) : null}
            <div
                className={`rounded-lg group ${innerStyles[state.type] || ''}`}
                ref={innerRef}
                style={
                    state.type === 'preview'
                        ? {
                            width: state.dragging.width,
                            height: state.dragging.height,
                            transform: !isSafari() ? 'rotate(4deg)' : undefined
                        }
                        : undefined
                }
            >
                <CardItem
                    card={card}
                    board={board}
                />
            </div>

            {state.type === 'is-over' && state.closestEdge === 'bottom' ? (
                <CardShadow dragging={state.dragging} />
            ) : null}
        </div>
    )
}

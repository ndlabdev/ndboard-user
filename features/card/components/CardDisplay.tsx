import { isSafari } from '@/shared/is-safari'
import { TCard, TCardState } from '@/shared/data'
import { RefObject } from 'react'
import { BoardDetailResponse } from '@/types'
import { isUrl } from '@/lib/utils'
import {
    CardLinkPreview,
    CardItemLabels,
    CardChecklistSummary,
    CardItemDueDate,
    CardItemCustomFields,
    CardItemAssignees,
    CardItem,
    CardShadow
} from '@/features/card'

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
                >
                    <div className={'bg-white rounded-lg shadow border border-white hover:border-primary group list-none cursor-pointer'}>
                        {isUrl(card.name) && card.meta
                            ? <CardLinkPreview meta={card.meta} />
                            : (
                                <div className="p-3">
                                    <CardItemLabels card={card} />
                                    <h4 className="font-semibold text-sm">{card.name}</h4>
                                    <CardChecklistSummary card={card} />
                                    <CardItemDueDate card={card} />
                                    <CardItemCustomFields
                                        card={card}
                                        board={board}
                                    />
                                    <CardItemAssignees card={card} />
                                </div>
                            )}
                    </div>
                </CardItem>
            </div>

            {state.type === 'is-over' && state.closestEdge === 'bottom' ? (
                <CardShadow dragging={state.dragging} />
            ) : null}
        </div>
    )
}

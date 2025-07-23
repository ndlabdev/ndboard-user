import { BoardCardsResponse, BoardListsResponse } from '@/types'
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types'

export type TColumnState =
    | {
        type: 'is-card-over';
        isOverChildCard: boolean;
        dragging: DOMRect;
    }
    | {
        type: 'is-column-over';
    }
    | {
        type: 'idle';
    }
    | {
        type: 'is-dragging';
    };

export type TCardState =
    | {
        type: 'idle';
    }
    | {
        type: 'is-dragging';
    }
    | {
        type: 'is-dragging-and-left-self';
    }
    | {
        type: 'is-over';
        dragging: DOMRect;
        closestEdge: Edge;
    }
    | {
        type: 'preview';
        container: HTMLElement;
        dragging: DOMRect;
    };

export type TCard = BoardCardsResponse;

export type TColumn = BoardListsResponse & {
    cards: BoardCardsResponse[]
    isLoading: boolean
    isError: boolean
}

export type TBoard = {
    columns: TColumn[];
};

export const blockBoardPanningAttr = 'data-block-board-panning' as const

const cardKey = Symbol('card')
export type TCardData = {
    [cardKey]: true;
    card: TCard;
    columnId: string;
    rect: DOMRect;
};

export function getCardData({
    card,
    rect,
    columnId
}: Omit<TCardData, typeof cardKey> & { columnId: string }): TCardData {
    return {
        [cardKey]: true,
        rect,
        card,
        columnId
    }
}

export function isCardData(value: Record<string | symbol, unknown>): value is TCardData {
    return Boolean(value[cardKey])
}

export function isDraggingACard({
    source
}: {
    source: { data: Record<string | symbol, unknown> };
}): boolean {
    return isCardData(source.data)
}

const cardDropTargetKey = Symbol('card-drop-target')
export type TCardDropTargetData = {
    [cardDropTargetKey]: true;
    card: TCard;
    columnId: string;
};

export function isCardDropTargetData(
    value: Record<string | symbol, unknown>
): value is TCardDropTargetData {
    return Boolean(value[cardDropTargetKey])
}

export function getCardDropTargetData({
    card,
    columnId
}: Omit<TCardDropTargetData, typeof cardDropTargetKey> & {
    columnId: string;
}): TCardDropTargetData {
    return {
        [cardDropTargetKey]: true,
        card,
        columnId
    }
}

const columnKey = Symbol('column')
export type TColumnData = {
    [columnKey]: true;
    column: TColumn;
};

export function getColumnData({ column }: Omit<TColumnData, typeof columnKey>): TColumnData {
    return {
        [columnKey]: true,
        column
    }
}

export function isColumnData(value: Record<string | symbol, unknown>): value is TColumnData {
    return Boolean(value[columnKey])
}

export function isDraggingAColumn({
    source
}: {
    source: { data: Record<string | symbol, unknown> };
}): boolean {
    return isColumnData(source.data)
}

export const settings = {
    isBoardMoreObvious: false,
    isOverElementAutoScrollEnabled: true,
    boardScrollSpeed: 'fast' as 'standard' | 'fast',
    columnScrollSpeed: 'standard' as 'standard' | 'fast',
    isFPSPanelEnabled: false,
    isCPUBurnEnabled: false,
    isOverflowScrollingEnabled: true
}
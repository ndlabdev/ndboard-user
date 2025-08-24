import { memo } from 'react'
import { BoardCardsResponse, BoardDetailResponse } from '@/types'
import { format } from 'date-fns'

interface Props {
    card: BoardCardsResponse
    board: BoardDetailResponse['data']
}

export const CardItemCustomFields = memo(function CardItemCustomFields({
    card,
    board
}: Props) {
    return (
        <>
            {board.customFields &&
                board.customFields
                    .filter((f) => f.showOnCard)
                    .map((field) => {
                        const cf = card.customFields?.find((v) => v.id === field.id)
                        const value = cf?.value ?? ''

                        if (!value) return null

                        return (
                            <div
                                key={field.id}
                                className="mt-1 text-xs text-muted-foreground flex items-center gap-1"
                            >
                                <span className="font-medium">{field.name}:</span>
                                {field.type === 'checkbox' ? (
                                    <span>{value === 'true' ? '✅' : '❌'}</span>
                                ) : field.type === 'date' ? (
                                    <span>{format(new Date(value), 'dd MMM yyyy HH:mm')}</span>
                                ) : field.type === 'select' ? (
                                    (() => {
                                        const opt = field.options?.find((o) => o.id === value)
                                        
                                        return opt ? (
                                            <span className="inline-flex items-center">
                                                <span
                                                    className={`inline-block size-2 rounded-full mr-1 bg-${opt.color}-500`}
                                                />
                                                {opt.label}
                                            </span>
                                        ) : (
                                            '--'
                                        )
                                    })()
                                ) : (
                                    <span>{value}</span>
                                )}
                            </div>
                        )
                    })}
        </>
    )
})

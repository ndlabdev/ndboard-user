export function CardShadow({ dragging }: { dragging: DOMRect }) {
    return <div className="flex-shrink-0 rounded bg-secondary" style={{ height: dragging.height }} />
}

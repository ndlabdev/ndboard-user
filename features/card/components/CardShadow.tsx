export function CardShadow({ dragging }: { dragging: DOMRect }) {
    return <div className="flex-shrink-0 rounded bg-slate-900" style={{ height: dragging.height }} />
}
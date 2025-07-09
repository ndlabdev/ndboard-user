export function WorkspaceSkeleton() {
    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3 pt-4">
                <div className="rounded-full bg-muted animate-pulse w-12 h-12" />
                <div className="flex flex-col gap-2">
                    <div className="w-48 h-6 rounded bg-muted animate-pulse" />
                    <div className="w-36 h-4 rounded bg-muted animate-pulse" />
                </div>
            </div>
        </section>
    )
}
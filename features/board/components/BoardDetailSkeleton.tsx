import { Skeleton } from '@/components/ui/skeleton'

export function BoardDetailSkeleton() {
    return (
        <section className="relative min-h-[calc(100vh-52px)] w-full">
            <div className="relative z-20 flex flex-col h-[calc(100vh-40px)] w-full">
                <div className="backdrop-blur-md bg-black/10 shadow-lg inline-block py-2.5 px-4">
                    <Skeleton className="h-6 w-32 rounded" />
                </div>

                <div className="flex-1 overflow-x-auto overflow-y-hidden">
                </div>
            </div>
        </section>
    )
}

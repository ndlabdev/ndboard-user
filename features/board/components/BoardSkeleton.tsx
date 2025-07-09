import { Skeleton } from '@/components/ui/skeleton'

export function BoardSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
                <div key={idx} className="flex flex-col space-y-3">
                    <Skeleton className="h-[125px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-2/4" />
                    </div>
                </div>
            ))}
        </div>
    )
}

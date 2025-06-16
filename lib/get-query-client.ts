import {
    QueryClient,
    defaultShouldDehydrateQuery,
    isServer
} from '@tanstack/react-query'

function makeQueryClient () {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 2 * 60 * 1000,
                gcTime: 10 * 60 * 1000,
                refetchOnWindowFocus: false,
                retry: 1,
                refetchOnMount: true,
                refetchOnReconnect: true
            },
            mutations: {
                retry: 0
            },
            dehydrate: {
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) ||
                    query.state.status === 'pending'
            }
        }
    })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient () {
    if (isServer) {
        return makeQueryClient()
    } else {
        if (!browserQueryClient) browserQueryClient = makeQueryClient()

        
        return browserQueryClient
    }
}

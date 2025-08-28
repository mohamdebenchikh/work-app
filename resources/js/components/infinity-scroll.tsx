import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { router } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

interface InfinityScrollProps<T> {
    initialData: PaginatedResponse<T>;
    renderItem: (item: T) => ReactNode;
    resourceName: string; // e.g., 'serviceRequests', 'offers'
}

export default function InfinityScroll<T>({ initialData, renderItem, resourceName }: InfinityScrollProps<T>) {
    const [items, setItems] = useState<T[]>(initialData.data);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(initialData.links.next);
    const [loading, setLoading] = useState(false);

    const loadMoreItems = useCallback(() => {
        if (loading || !nextPageUrl) return;

        setLoading(true);
        router.get(nextPageUrl, {}, {
            preserveScroll: true,
            preserveState: true,
            only: [resourceName],
            onSuccess: (page) => {
                const newPaginatedData = (page.props as any)[resourceName];
                setItems(prev => [...prev, ...newPaginatedData.data]);
                setNextPageUrl(newPaginatedData.links.next);
                setLoading(false);
            },
            onError: (errors) => {
                console.error('Error loading more items:', errors);
                setLoading(false);
            },
        });
    }, [loading, nextPageUrl, resourceName]);

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200;

            if (isNearBottom && !loading && nextPageUrl) {
                loadMoreItems();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMoreItems, loading, nextPageUrl]);

    return (
        <>
            {items.map(renderItem)}

            {loading && (
                <div className="flex justify-center mt-6">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            )}

            {!nextPageUrl && items.length > 0 && (
                <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                        You've reached the end of the list.
                    </p>
                </div>
            )}
        </>
    );
}

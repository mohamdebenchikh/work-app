export type ServiceStatus = 'draft' | 'active' | 'inactive';

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export enum ProviderServiceStatus {
    DRAFT = 'draft',
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

export interface ProviderService {
    id: number;
    user_id: number;
    category_id: number;
    title: string;
    description: string;
    price: number | null;
    country: string;
    city: string;
    is_local_only: boolean;
    latitude: number | null;
    longitude: number | null;
    include_transport: boolean;
    status: ProviderServiceStatus;
    duration: number;
    avg_rating?: number | null;
    reviews_count?: number;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
        phone?: string;
        avatar_url?: string;
        location?: {
            city?: string;
        };
        created_at: string;
    };
    provider?: {
        id: number;
        name: string;
        avatar_url?: string;
        location?: {
            city?: string;
        };
    };
    category?: {
        id: number;
        name: string;
        slug: string;
    };
}

export interface CreateProviderServiceData {
    title: string;
    description: string;
    price: number | null;
    category_id: number;
    country: string;
    city: string;
    is_local_only: boolean;
    latitude?: number | null;
    longitude?: number | null;
    include_transport: boolean;
    status: ProviderServiceStatus;
}

export type UpdateProviderServiceData = Partial<CreateProviderServiceData>;

export interface ProviderServiceFilters {
    search?: string;
    status?: ProviderServiceStatus;
    category_id?: number;
    country?: string;
    city?: string;
    is_local_only?: boolean;
    include_transport?: boolean;
    min_price?: number;
    max_price?: number;
}

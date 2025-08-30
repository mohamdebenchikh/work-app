import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { ProviderService } from './provider-service';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    categories: Category[];
    skills: skill[];
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    profession?: string;
    years_of_experience?: string;
    gender?: 'male' | 'female' | string;
    role?: 'provider' | 'client' | string;
    birthdate?: string;
    country?: string;
    state?: string;
    city?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    response_time?: string;
    email_verified_at: string | null;
    avatar_verified_at?: string;
    skills: Skill[];
    categories: Category[];
    created_at: string;
    updated_at: string;
    is_mine?: boolean;
    rating_average?: number;
    reviews_count?: number;
    reviews_given_count?: number;
    reviews_received_count?: number;
    reviews_avg_rating?: number;
    reviews_received?: Review[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface Review {
    id: number;
    reviewer_id: number;
    provider_id: number;
    rating: number;
    comment?: string;
    created_at: string;
    updated_at: string;
    user: User; // The user who made the review
    reviewer: User; // The user who made the review
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string;
    [key: string]: unknown;
}

export interface Skill {
    id: number;
    name: string;
    slug: string;
}

export interface ServiceRequest {
    id: number;
    title: string;
    description: string;
    budget: number;
    deadline_date: string;
    status: string;
    user: User;
    category: Category;
    skills: Skill[];
    category_id: number;
    country: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    created_at: string;
    updated_at: string;
    offers_count?: number;
    top_offers?: Offer[];
    is_mine?: boolean;
    [key: string]: unknown;
}

export interface Offer {
    id: number;
    user_id: number;
    service_request_id: number;
    price: number;
    message: string;
    status: 'pending' | 'accepted' | 'rejected' | string;
    user: User;
    service_request: ServiceRequest;
    created_at: string;
    updated_at: string;
    is_mine?: boolean;
    [key: string]: unknown;
}

export type PaginatedOffers = PaginatedResponse<Offer>;

export interface PaginatedResponse<T> {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
            page?: number;
        }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
        first_page_url: string;
        last_page_url: string;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
}

export interface Notification {
    id: string;
    type: string;
    data: {
        type: string;
        [key: string]: unknown;
    };
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface LocationDetails {
    lat?: number;
    lng?: number;
    country?: string;
    state?: string;
    city?: string;
    street?: string;
    fullAddress?: string;
    address?: string;
    [key: string]: unknown;
}

export interface InfinityScrollProps<T> {
    initialData: { data: T[]; next_page_url: string | null };
    renderItem: (item: T) => React.ReactNode;
    resourceName: string;
}

export interface Booking {
    id: number;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
    scheduled_at: string;
    duration: number;
    price: number | null;
    currency: string;
    created_at: string;
    updated_at: string;
    provider_service: ProviderService;
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
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
        phone?: string;
        created_at: string;
    };
    category?: {
        id: number;
        name: string;
        slug: string;
    };
}

import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

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
    categories:Category[];
    skills:skill[];
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
    gender?:"male" | "female" | string;
    role?: 'provider' | 'client' | string;
    birthdate?: string;
    country?: string;
    state?: string;
    city?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    email_verified_at: string | null;
    skills:Skill[];
    categories:Category[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}


export interface Category  {
    id:number;
    name:string;
    slug:string;
    icon?:string;
    [key:string]: unknown
}

export  interface Skill {
    id:number;
    name:string;
    slug:string;
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
    [key: string]: unknown;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}


export  interface LocationDetails {
    lat?: number;
    lng?: number;
    country?: string;
    state?: string;
    city?: string;
    street?: string;
    fullAddress?: string;
    address?:string;
    [key: string]: unknown;

}
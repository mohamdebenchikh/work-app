import { Page } from '@inertiajs/core';
import { AxiosInstance } from 'axios';

declare module '@inertiajs/core' {
    interface PageProps {
        auth: {
            user: {
                id: number;
                name: string;
                email: string;
                role: string;
                email_verified_at: string | null;
                created_at: string;
                updated_at: string;
            };
        };
    }
}

declare module '@/types/app' {
    export interface PaginatedResponse<T = undefined> {
        data: T[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    }
}

declare global {
  interface Window {
    axios: AxiosInstance;
  }

  type PageProps<T = Record<string, unknown>> = T & {
    auth: {
      user: {
        id: number;
        name: string;
        email: string;
        role: string;
        email_verified_at: string | null;
        created_at: string;
        updated_at: string;
      };
    };
  };

  interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: {
      first: string | null;
      last: string | null;
      prev: string | null;
      next: string | null;
    };
  }




  interface InertiaSharedProps<T = Record<string, unknown>> {
    component: string;
    props: T;
    url: string;
    version: string | null;
    scrollRegions: Array<{ top: number; left: number }>;
    rememberedState: Record<string, unknown>;
    resolvedErrors: Record<string, string>;
  }

  interface InertiaPage extends Page {
    component: string;
    props: Record<string, unknown>;
    url: string;
    version: string | null;
    scrollRegions: Array<{ top: number; left: number }>;
    rememberedState: Record<string, unknown>;
    resolvedErrors: Record<string, string>;
  }

  interface InertiaSharedProps<T = Record<string, unknown>>
    extends InertiaPageProps<T> {
    auth: {
      user: {
        id: number;
        name: string;
        email: string;
        role: string;
        email_verified_at: string | null;
        created_at: string;
        updated_at: string;
      };
    };
  }
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.bmp' {
  const content: string;
  export default content;
}

declare module '*.tiff' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.avif' {
  const content: string;
  export default content;
}

declare module '*.woff' {
  const content: string;
  export default content;
}

declare module '*.woff2' {
  const content: string;
  export default content;
}

declare module '*.eot' {
  const content: string;
  export default content;
}

declare module '*.ttf' {
  const content: string;
  export default content;
}

declare module '*.otf' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}

declare module '*.sass' {
  const content: string;
  export default content;
}

declare module '*.less' {
  const content: string;
  export default content;
}

declare module '*.styl' {
  const content: string;
  export default content;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.styl' {
  const classes: { [key: string]: string };
  export default classes;
}

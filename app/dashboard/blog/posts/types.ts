export interface PostFormData {
    id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image: string;
    status: 'draft' | 'published';
    categories: string[];
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    is_indexable: boolean;
    canonical_url: string;
    categoriesWith?: Category[];
    created_at?: string;
}

export interface Category {
    id: string;
    name: string;
    parent_id: string | null;
    children?: Category[];
} 
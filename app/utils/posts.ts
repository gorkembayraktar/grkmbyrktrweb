import { SupabaseClient } from "@supabase/supabase-js";
import { Category, PostFormData } from "../dashboard/blog/posts/types";
import { adminClient } from "./supabase/server";

export async function getPosts(limit: number = 3) {
    const supabase = await adminClient();

    // Önce postları al
    const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`*`)
        .eq('status', 'published')
        .limit(limit)
        .order('created_at', { ascending: false });

    if (postsError) {
        console.error('Error fetching posts:', postsError);
        return [];
    }

    // Her post için kategorileri al
    return await Promise.all(getWithCategories(supabase, posts)) as PostFormData[] || [];
}

function getWithCategories(client: SupabaseClient, posts: PostFormData[]) {
    return posts?.map(async (post: PostFormData) => {
        const postCategories = await getPostSingleCategory(client, post);

        if (postCategories) {
            const list = postCategories as any;

            post.categoriesWith = list.map((pc: PostCategoriesType) => ({
                id: pc.categories.id,
                name: pc.categories.name,
                slug: pc.categories.slug,
                parent_id: pc.categories.parent_id
            } as Category)) || [];
        }

        return post;
    })
}
async function getPostSingleCategory(client: SupabaseClient, post: PostFormData) {
    const { data: postCategories, error: categoriesError } = await client
        .from('post_categories')
        .select(`
            post_id,
            categories!inner(
                id,
                name,
                slug,
                parent_id
            ) 
        `)
        .eq('post_id', post.id);

    if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
    }
    return postCategories;
}

export async function getPostsFiltered(props: GetPostsFilteredProps) {
    const supabase = await adminClient();
    const itemsPerPage = props.perPage;

    // Base query builder
    const buildQuery = (query: any) => {
        let q = query.eq('status', 'published');

        if (props.search) {
            q = q.or(`title.ilike.%${props.search}%, content.ilike.%${props.search}%`);
        }

        if (props.category) {
            q = q.eq('post_categories.categories.slug', props.category);
        }

        return q;
    };

    const selectQuery = `
        *,
        post_categories!inner (
            categories!inner (
                slug
            )
        )
    `;

    // Count query with joins
    let baseQuery = supabase
        .from('posts')
        .select(selectQuery, { count: 'exact', head: true });

    baseQuery = buildQuery(baseQuery);
    const { count } = await baseQuery;

    const totalPages = Math.ceil((count || 0) / itemsPerPage);
    const page = props.page > totalPages ? 1 : props.page;
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    // Data query with joins
    let query = supabase
        .from('posts')
        .select(selectQuery)
        .eq('status', 'published')
        .order(props.orderBy, { ascending: props.order === "asc" })
        .range(from, to);

    query = buildQuery(query);
    const { data, error } = await query;

    if (error) {
        console.error('Error fetching posts:', error);
        return { posts: [], total: count || 0 };
    }

    const posts = await Promise.all(getWithCategories(supabase, data)) as PostFormData[];

    return {
        posts,
        total: count || 0
    };
}

export async function getPostById(slug: string) {
    const supabase = await adminClient();
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (error) {
        console.error('Error fetching post:', error);
        return null;
    }

    data.categoriesWith = await getPostSingleCategory(supabase, data);
    // Yazarın bilgilerini al
    const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select(`
         id,
         full_name,
         avatar_url
     `)
        .eq('id', data.author_id)
        .single();

    if (userError) {
        console.error('Error fetching user:', userError);
    } else {
        data.author = userData;
    }

    return data;
}

export async function getRelatedPosts(postId: string, categoryIds: string[], limit: number = 3) {
    const supabase = await adminClient();
    const { data, error } = await supabase
        .from('post_categories')
        .select(`
            posts!inner(
                id,
                title,
                content,
                slug,
                excerpt,
                created_at,
                author:profiles!inner(
                    id,
                    full_name,
                    avatar_url
                )
            ),
            categories!inner(
                id,
                name,
                slug
            )
        `)
        .in('category_id', categoryIds)
        .neq('posts.id', postId)
        .eq('posts.status', 'published')
        .limit(limit);

    if (error) {
        console.error('Error fetching related posts:', error);
        return [];
    }

    const uniquePosts = Array.from(new Set(data?.map((item: any) => item.posts.id)))
        .map(id => data?.find((item: any) => item.posts.id === id)?.posts);



    return uniquePosts;
}


export async function getRecentPosts(limit: number = 3) {
    const supabase = await adminClient();
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            author:profiles!inner(
                    id,
                    full_name,
                    avatar_url
                )
            `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error) {
        console.error('Error fetching recent posts:', error);
        return [];
    }

    return data;

}

export async function getAdjacentPosts(currentPostId: string) {
    const supabase = await adminClient();
    // Önceki ve sonraki yazıları getir
}

interface PostCategoriesType {
    post_id: string;
    categories: CategoriesType;
}
interface CategoriesType {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
}

interface GetPostsFilteredProps {
    category: string;
    perPage: number;
    search: string;
    page: number;
    orderBy: string;
    order: string;
}
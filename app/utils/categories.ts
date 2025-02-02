import { Category } from "../dashboard/blog/posts/types";
import { adminClient } from "./supabase/server";

export async function getCategories() {
    const client = await adminClient();
    const { data, error } = await client.from('categories').select('*');
    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data as Category[];
}
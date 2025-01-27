import { createClient } from './supabase/client'

export async function incrementPageView(pagePath: string) {
    const supabase = createClient()

    // First try to update existing record
    const { data, error: updateError } = await supabase
        .from('views')
        .update({ view_count: supabase.rpc('increment_counter', { row_id: null }) })
        .eq('page_path', pagePath)
        .select()
        .single()

    if (updateError || !data) {
        // If no record exists, create a new one
        const { error: insertError } = await supabase
            .from('views')
            .insert([{ page_path: pagePath, view_count: 1 }])

        if (insertError) {
            console.error('Error incrementing page view:', insertError)
        }
    }
}

export async function getPageViews(pagePath: string): Promise<number> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('views')
        .select('view_count')
        .eq('page_path', pagePath)
        .single()

    if (error) {
        console.error('Error getting page views:', error)
        return 0
    }

    return data?.view_count || 0
}

export async function getTotalPageViews(): Promise<number> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('views')
        .select('view_count')

    if (error) {
        console.error('Error getting total page views:', error)
        return 0
    }

    return data?.reduce((total, row) => total + (row.view_count || 0), 0) || 0
} 
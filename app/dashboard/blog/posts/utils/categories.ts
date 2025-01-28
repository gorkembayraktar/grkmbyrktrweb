import { Category } from '../types'
import { createClient } from '@/app/utils/supabase/client'

// Kategorileri yükle
export async function loadCategories() {
    const supabase = createClient()
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('id, name, parent_id')
            .order('name')

        if (error) throw error

        // Kategori ağacını oluştur
        const categoryTree = buildCategoryTree(data)
        return { categories: categoryTree, defaultCategory: data.find(c => c.name === 'Genel') }
    } catch (error) {
        console.error('Error loading categories:', error)
        throw error
    }
}

// Düz kategori listesinden ağaç yapısı oluştur
export function buildCategoryTree(flatCategories: Category[]): Category[] {
    const categoryMap = new Map<string, Category>()
    const rootCategories: Category[] = []

    // Önce tüm kategorileri map'e ekle
    flatCategories.forEach(category => {
        categoryMap.set(category.id, { ...category, children: [] })
    })

    // Sonra parent-child ilişkilerini kur
    flatCategories.forEach(category => {
        const categoryWithChildren = categoryMap.get(category.id)!
        if (category.parent_id) {
            const parent = categoryMap.get(category.parent_id)
            if (parent) {
                parent.children = parent.children || []
                parent.children.push(categoryWithChildren)
            }
        } else {
            rootCategories.push(categoryWithChildren)
        }
    })

    return rootCategories
}

// Post kategorilerini güncelle
export async function updatePostCategories(postId: string, categories: string[]) {
    const supabase = createClient()
    try {
        // Mevcut kategorileri sil
        const { error: deleteError } = await supabase
            .from('post_categories')
            .delete()
            .eq('post_id', postId)

        if (deleteError) throw deleteError

        // Yeni kategorileri ekle
        if (categories.length > 0) {
            const { error: categoryError } = await supabase
                .from('post_categories')
                .insert(
                    categories.map(categoryId => ({
                        post_id: postId,
                        category_id: categoryId
                    }))
                )

            if (categoryError) throw categoryError
        }
    } catch (error) {
        console.error('Error updating post categories:', error)
        throw error
    }
} 
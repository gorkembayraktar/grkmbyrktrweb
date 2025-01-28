import { Accordion } from '../Accordion'
import { URLSettings } from './URLSettings'
import { CategorySettings } from './CategorySettings'
import { FeaturedImageSettings } from './FeaturedImageSettings'
import { SEOSettings } from './SEOSettings'
import { SEOAnalysis } from '../SEOAnalysis'
import { Category, PostFormData } from '../../types'
import { FaChartBar } from 'react-icons/fa'
import { AccordionItem } from '../Accordion'

interface PostSettingsProps {
    formData: PostFormData;
    categories: Category[];
    onChange: (field: string, value: any) => void;
}

export function PostSettings({ formData, categories, onChange }: PostSettingsProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <Accordion defaultOpen="url">
                <URLSettings
                    slug={formData.slug}
                    title={formData.title}
                    onChange={(slug) => onChange('slug', slug)}
                />
                <CategorySettings
                    categories={categories}
                    selectedCategories={formData.categories}
                    onChange={(categories) => onChange('categories', categories)}
                />
                <FeaturedImageSettings
                    imageUrl={formData.featured_image}
                    onChange={(url) => onChange('featured_image', url)}
                />
                <SEOSettings
                    metaTitle={formData.meta_title}
                    metaDescription={formData.meta_description}
                    metaKeywords={formData.meta_keywords}
                    isIndexable={formData.is_indexable}
                    onChange={onChange}
                />
                <AccordionItem id="seo-analysis" icon={<FaChartBar />} title="SEO Analizi">
                    <SEOAnalysis content={formData.content} formData={formData} />
                </AccordionItem>
            </Accordion>
        </div>
    )
} 
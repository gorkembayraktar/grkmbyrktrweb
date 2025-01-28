import { FaTags } from 'react-icons/fa'
import { AccordionItem } from '../Accordion'
import { Category } from '../../types'
import { CategoryTree } from './CategoryTree'

interface CategorySettingsProps {
    categories: Category[];
    selectedCategories: string[];
    onChange: (categories: string[]) => void;
}

export function CategorySettings({ categories, selectedCategories, onChange }: CategorySettingsProps) {
    return (
        <AccordionItem id="categories" icon={<FaTags />} title="Kategoriler">
            <div className="max-h-48 overflow-y-auto custom-scrollbar">
                <CategoryTree
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onChange={onChange}
                />
            </div>
        </AccordionItem>
    )
} 
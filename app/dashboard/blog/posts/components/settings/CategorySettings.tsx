import { FaTags } from 'react-icons/fa'
import { AccordionItem } from '../Accordion'
import { Category } from '../../types'
import { CategoryTree } from './CategoryTree'
import { useState } from 'react';

interface CategorySettingsProps {
    categories: Category[];
    selectedCategories: string[];
    onChange: (categories: string[]) => void;
}

export function CategorySettings({ categories, selectedCategories, onChange }: CategorySettingsProps) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <AccordionItem id="categories" icon={<FaTags />} title="Kategoriler" isOpen={isOpen} onToggle={() => {
            setIsOpen(!isOpen)
        }}>
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
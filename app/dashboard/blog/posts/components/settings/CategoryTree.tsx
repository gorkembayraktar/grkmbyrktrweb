import { FaChevronRight } from 'react-icons/fa'
import { Category } from '../../types'

interface CategoryTreeProps {
    categories: Category[];
    selectedCategories: string[];
    onChange: (categories: string[]) => void;
    level?: number;
}

export function CategoryTree({ categories, selectedCategories, onChange, level = 0 }: CategoryTreeProps) {
    return categories.map(category => (
        <div key={category.id}>
            <label className="flex items-center">
                <div style={{ width: `${level * 20}px` }} />
                <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            onChange([...selectedCategories, category.id])
                        } else {
                            if (selectedCategories.length > 1) {
                                onChange(selectedCategories.filter(id => id !== category.id))
                            }
                        }
                    }}
                    className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                />
                <div className="ml-2 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    {category.children && category.children.length > 0 && (
                        <FaChevronRight className="h-3 w-3 text-gray-400" />
                    )}
                    <span>{category.name}</span>
                </div>
            </label>
            {category.children && category.children.length > 0 && (
                <div className="ml-2">
                    <CategoryTree
                        categories={category.children}
                        selectedCategories={selectedCategories}
                        onChange={onChange}
                        level={level + 1}
                    />
                </div>
            )}
        </div>
    ))
} 
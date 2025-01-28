import { FaCog } from 'react-icons/fa'
import { AccordionItem } from '../Accordion'

interface SEOSettingsProps {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    isIndexable: boolean;
    onChange: (field: string, value: string | boolean) => void;
}

export function SEOSettings({ metaTitle, metaDescription, metaKeywords, isIndexable, onChange }: SEOSettingsProps) {
    return (
        <AccordionItem id="seo" icon={<FaCog />} title="SEO Ayarları">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Meta Başlık
                    </label>
                    <input
                        type="text"
                        value={metaTitle}
                        onChange={(e) => onChange('metaTitle', e.target.value)}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                        placeholder="SEO başlığı..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Meta Açıklama
                    </label>
                    <textarea
                        value={metaDescription}
                        onChange={(e) => onChange('metaDescription', e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                        placeholder="SEO açıklaması..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Anahtar Kelimeler
                    </label>
                    <input
                        type="text"
                        value={metaKeywords}
                        onChange={(e) => onChange('metaKeywords', e.target.value)}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                        placeholder="Virgülle ayırarak yazın..."
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={isIndexable}
                        onChange={(e) => onChange('isIndexable', e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                    />
                    <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        Arama motorlarında indekslenebilir
                    </label>
                </div>
            </div>
        </AccordionItem>
    )
} 
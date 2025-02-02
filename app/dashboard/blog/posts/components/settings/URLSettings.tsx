import { FaLink } from 'react-icons/fa'
import { AccordionItem } from '../Accordion'
import { useState } from 'react';
import { generateSlug } from '@/app/utils/slug';

interface URLSettingsProps {
    slug: string;
    title: string;
    onChange: (slug: string) => void;
}

export function URLSettings({ slug, title, onChange }: URLSettingsProps) {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <AccordionItem id="url" icon={<FaLink />} title="URL Ayarları" isOpen={isOpen} onToggle={() => {
            setIsOpen(!isOpen)
        }}   >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Kalıcı Bağlantı
                    </label>
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                /blog/
                            </span>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => onChange(e.target.value)}
                                className="pl-14 w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                            />
                        </div>
                        <button
                            onClick={() => {
                                const newSlug = generateSlug(title);
                                onChange(newSlug);
                            }}
                            className="shrink-0 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium"
                        >
                            URL Oluştur
                        </button>
                    </div>
                </div>
            </div>
        </AccordionItem>
    )
} 
import { FaImage, FaTimes } from 'react-icons/fa'
import { AccordionItem } from '../Accordion'

interface FeaturedImageSettingsProps {
    imageUrl: string;
    onChange: (url: string) => void;
}

export function FeaturedImageSettings({ imageUrl, onChange }: FeaturedImageSettingsProps) {
    return (
        <AccordionItem id="featured" icon={<FaImage />} title="Öne Çıkan Görsel">
            <div className="space-y-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => onChange(e.target.value)}
                        className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                        placeholder="Görsel URL'si"
                    />
                    <button className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                        <FaImage size={16} />
                    </button>
                </div>
                {imageUrl && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img
                            src={imageUrl}
                            alt="Öne çıkan görsel"
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={() => onChange('')}
                            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/75"
                        >
                            <FaTimes size={12} />
                        </button>
                    </div>
                )}
            </div>
        </AccordionItem>
    )
} 
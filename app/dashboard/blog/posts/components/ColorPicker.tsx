import { createPortal } from 'react-dom'
import { Editor } from '@tiptap/react'
import { TEXT_COLORS } from '../constants'
import { toast } from 'react-hot-toast'

interface ColorPickerProps {
    isOpen: boolean;
    onClose: () => void;
    position: {
        top: number;
        left: number;
        buttonWidth: number;
        buttonHeight: number;
    };
    editor: Editor;
    onColorSelect: (color: string) => void;
}

export function ColorPicker({ isOpen, onClose, position, editor, onColorSelect }: ColorPickerProps) {
    if (!isOpen || typeof window === 'undefined') return null;

    const PICKER_WIDTH = 256; // w-64 = 256px
    const PICKER_HEIGHT = 400; // tahmini yükseklik
    const MARGIN = 8;

    // Ekran sınırlarını kontrol et
    const adjustedPosition = {
        top: position.top,
        left: position.left
    };

    // Sağa taşma kontrolü
    if (position.left + PICKER_WIDTH > window.innerWidth) {
        adjustedPosition.left = position.left - PICKER_WIDTH + position.buttonWidth;
    }

    // Alta taşma kontrolü
    if (position.top + PICKER_HEIGHT > window.innerHeight) {
        adjustedPosition.top = position.top - PICKER_HEIGHT - MARGIN;
    }

    // Sola taşma kontrolü
    if (adjustedPosition.left < MARGIN) {
        adjustedPosition.left = MARGIN;
    }

    // Üste taşma kontrolü
    if (adjustedPosition.top < MARGIN) {
        adjustedPosition.top = position.top + position.buttonHeight + MARGIN;
    }

    return createPortal(
        <div className="fixed inset-0 z-50" onClick={onClose}>
            <div
                className="absolute p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64"
                style={{
                    top: adjustedPosition.top,
                    left: adjustedPosition.left,
                    maxHeight: 'calc(100vh - 100px)',
                    overflowY: 'auto'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Hazır Renkler */}
                <div className="space-y-3">
                    {Object.entries(TEXT_COLORS).map(([group, colors]) => (
                        <div key={group}>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                                {group}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {colors.map(color => (
                                    <button
                                        key={color.value}
                                        onClick={() => onColorSelect(color.value)}
                                        className={`
                                            w-7 h-7 rounded-lg border hover:scale-110 transition-transform
                                            ${color.value === '#FFFFFF' ? 'border-gray-300' : 'border-transparent'}
                                            ${editor.getAttributes('textStyle').color === color.value ? 'ring-2 ring-primary ring-offset-2' : ''}
                                        `}
                                        style={{ backgroundColor: color.value }}
                                        title={color.label}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Özel Renk Seçici */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Özel Renk
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            onChange={(e) => onColorSelect(e.target.value)}
                            value={editor.getAttributes('textStyle').color || '#000000'}
                            className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                        />
                        <button
                            onClick={() => {
                                editor.chain().unsetColor().run();
                                onClose();
                            }}
                            className="flex-1 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Rengi Temizle
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
} 
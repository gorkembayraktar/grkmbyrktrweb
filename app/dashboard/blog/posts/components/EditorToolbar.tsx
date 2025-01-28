import React, { useState, useRef } from 'react'
import { Editor } from '@tiptap/react'
import {
    FaBold, FaItalic, FaUnderline, FaStrikethrough,
    FaListUl, FaListOl, FaQuoteRight, FaLink, FaUnlink,
    FaImage, FaTable, FaAlignLeft, FaAlignCenter,
    FaAlignRight, FaAlignJustify, FaCode, FaRedo,
    FaUndo, FaPalette, FaHeading
} from 'react-icons/fa'
import { ToolbarButton } from './ToolbarButton'
import { ColorPicker } from './ColorPicker'
import { FONT_FAMILIES, FONT_SIZES } from '../constants'
import toast from 'react-hot-toast'

interface EditorToolbarProps {
    editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
    if (!editor) return null;

    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const [colorPickerPosition, setColorPickerPosition] = useState({
        top: 0,
        left: 0,
        buttonWidth: 0,
        buttonHeight: 0
    });
    const colorButtonRef = useRef<HTMLButtonElement>(null);

    const addImage = () => {
        const url = window.prompt('Görsel URL\'si girin:')
        if (url) {
            editor.chain().setImage({ src: url }).run()
        }
    }

    const addLink = () => {
        const url = window.prompt('Link URL\'si girin:')
        if (url) {
            editor.chain().setLink({ href: url }).run()
        }
    }

    const addTable = () => {
        editor.chain().insertTable({ rows: 3, cols: 3 }).run()
    }

    return (
        <div className="flex items-center gap-2 p-2 min-w-max">
            {/* Geri/İleri */}
            <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().undo().run()}
                    disabled={!editor.can().undo()}
                    icon={<FaUndo size={14} />}
                    tooltip="Geri Al"
                />
                <ToolbarButton
                    onClick={() => editor.chain().redo().run()}
                    disabled={!editor.can().redo()}
                    icon={<FaRedo size={14} />}
                    tooltip="İleri Al"
                />
            </div>

            {/* Başlık Seviyeleri */}
            <select
                onChange={(e) => {
                    const level = parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 | 0;
                    level === 0
                        ? editor.chain().setParagraph().run()
                        : editor.chain().toggleHeading({ level }).run()
                }}
                className="h-8 px-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm mr-2"
            >
                <option value="0">Paragraf</option>
                <option value="1">Başlık 1</option>
                <option value="2">Başlık 2</option>
                <option value="3">Başlık 3</option>
                <option value="4">Başlık 4</option>
                <option value="5">Başlık 5</option>
                <option value="6">Başlık 6</option>
            </select>

            {/* Metin Biçimlendirme */}
            <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().toggleBold().run()}
                    active={editor.isActive('bold')}
                    icon={<FaBold size={14} />}
                    tooltip="Kalın"
                />
                <ToolbarButton
                    onClick={() => editor.chain().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    icon={<FaItalic size={14} />}
                    tooltip="İtalik"
                />
                <ToolbarButton
                    onClick={() => editor.chain().toggleUnderline().run()}
                    active={editor.isActive('underline')}
                    icon={<FaUnderline size={14} />}
                    tooltip="Altı Çizili"
                />
                <ToolbarButton
                    onClick={() => editor.chain().toggleStrike().run()}
                    active={editor.isActive('strike')}
                    icon={<FaStrikethrough size={14} />}
                    tooltip="Üstü Çizili"
                />
            </div>

            {/* Liste ve Alıntı */}
            <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    icon={<FaListUl size={14} />}
                    tooltip="Sırasız Liste"
                />
                <ToolbarButton
                    onClick={() => editor.chain().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    icon={<FaListOl size={14} />}
                    tooltip="Sıralı Liste"
                />
                <ToolbarButton
                    onClick={() => editor.chain().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                    icon={<FaQuoteRight size={14} />}
                    tooltip="Alıntı"
                />
            </div>

            {/* Link ve Medya */}
            <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
                <ToolbarButton
                    onClick={addLink}
                    active={editor.isActive('link')}
                    icon={<FaLink size={14} />}
                    tooltip="Link Ekle"
                />
                {editor.isActive('link') && (
                    <ToolbarButton
                        onClick={() => editor.chain().unsetLink().run()}
                        icon={<FaUnlink size={14} />}
                        tooltip="Linki Kaldır"
                    />
                )}
                <ToolbarButton
                    onClick={addImage}
                    icon={<FaImage size={14} />}
                    tooltip="Görsel Ekle"
                />
                <ToolbarButton
                    onClick={addTable}
                    icon={<FaTable size={14} />}
                    tooltip="Tablo Ekle"
                />
            </div>

            {/* Hizalama */}
            <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().setTextAlign('left').run()}
                    active={editor.isActive({ textAlign: 'left' })}
                    icon={<FaAlignLeft size={14} />}
                    tooltip="Sola Hizala"
                />
                <ToolbarButton
                    onClick={() => editor.chain().setTextAlign('center').run()}
                    active={editor.isActive({ textAlign: 'center' })}
                    icon={<FaAlignCenter size={14} />}
                    tooltip="Ortala"
                />
                <ToolbarButton
                    onClick={() => editor.chain().setTextAlign('right').run()}
                    active={editor.isActive({ textAlign: 'right' })}
                    icon={<FaAlignRight size={14} />}
                    tooltip="Sağa Hizala"
                />
                <ToolbarButton
                    onClick={() => editor.chain().setTextAlign('justify').run()}
                    active={editor.isActive({ textAlign: 'justify' })}
                    icon={<FaAlignJustify size={14} />}
                    tooltip="İki Yana Yasla"
                />
            </div>

            {/* Kod */}
            <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().toggleCode().run()}
                    active={editor.isActive('code')}
                    icon={<FaCode size={14} />}
                    tooltip="Satır İçi Kod"
                />
            </div>

            {/* Font Ayarları */}
            <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
                {/* Font Ailesi */}
                <select
                    onChange={(e) => editor.chain().setFontFamily(e.target.value).run()}
                    value={editor.getAttributes('textStyle').fontFamily || 'Inter'}
                    className="h-8 px-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                >
                    {FONT_FAMILIES.map(font => (
                        <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                            {font.label}
                        </option>
                    ))}
                </select>

                {/* Font Boyutu */}
                <select
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === 'custom') {
                            const size = prompt('Font boyutu girin (örn: 22):');
                            if (size) {
                                if (/^\d$/.test(size)) {
                                    editor.chain().setFontSize(size + 'px').run();
                                } else {
                                    toast.error('Geçerli bir piksel değeri girin (örn: 22px)');
                                }
                            }
                        } else {
                            editor.chain().setFontSize(value).run();
                        }
                    }}
                    value={editor.getAttributes('textStyle').fontSize || ''}
                    className="h-8 px-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                >
                    {FONT_SIZES.map(size => (
                        <option key={size.value} value={size.value}>
                            {size.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Renk Seçici */}
            <div className="relative group">
                <button
                    ref={colorButtonRef}
                    onClick={(e) => {
                        e.preventDefault();
                        const rect = colorButtonRef.current?.getBoundingClientRect();
                        if (rect) {
                            setColorPickerPosition({
                                top: rect.bottom + window.scrollY,
                                left: rect.left + window.scrollX,
                                buttonWidth: rect.width,
                                buttonHeight: rect.height
                            });
                            setColorPickerOpen(!colorPickerOpen);
                        }
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    title="Yazı Rengi"
                >
                    <FaPalette size={14} />
                    <div
                        className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-600"
                        style={{
                            backgroundColor: editor.getAttributes('textStyle').color || '#000000',
                            borderColor: editor.getAttributes('textStyle').color === '#FFFFFF' ? '#718096' : 'transparent'
                        }}
                    />
                </button>
                <ColorPicker
                    isOpen={colorPickerOpen}
                    onClose={() => setColorPickerOpen(false)}
                    position={colorPickerPosition}
                    editor={editor}
                    onColorSelect={(color) => {
                        editor.chain().focus().setColor(color).run();
                        setColorPickerOpen(false);
                    }}
                />
            </div>
        </div>
    );
} 
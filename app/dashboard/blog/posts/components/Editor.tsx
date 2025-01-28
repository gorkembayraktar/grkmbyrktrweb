import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import FontSize from '@tiptap/extension-font-size'
import { EditorToolbar } from './EditorToolbar'
import { useEffect, useRef } from 'react'

interface EditorProps {
    content: string;
    onChange: (content: string) => void;
}

export function Editor({ content, onChange }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary hover:text-primary/80 underline'
                }
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full'
                }
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse table-auto w-full'
                }
            }),
            TableRow,
            TableHeader,
            TableCell,
            TextStyle,
            Color.configure({
                types: ['textStyle']
            }),
            FontFamily.configure({
                types: ['textStyle']
            }),
            FontSize.configure({
                types: ['textStyle']
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph']
            }),
            Highlight.configure({
                multicolor: true
            }),
            Typography
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none dark:prose-invert focus:outline-none min-h-[500px]'
            }
        },
        autofocus: false,
        content: content,
        onUpdate: ({ editor }) => {
            const timeoutId = setTimeout(() => {
                onChange(editor.getHTML());
            }, 300);

            return () => clearTimeout(timeoutId);
        }
    });
    const only = useRef(false);
    useEffect(() => {
        if (editor && content && !only.current) {
            editor.commands.setContent(content, false);
            only.current = true;
        }
    }, [editor, content]);
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="sticky top-[71px] z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                {editor && (
                    <div className="border-b border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="overflow-x-auto">
                            <EditorToolbar editor={editor} />
                        </div>
                    </div>
                )}
            </div>
            <div className="p-6">
                <EditorContent
                    editor={editor}
                    className="prose prose-lg max-w-none dark:prose-invert focus:outline-none min-h-[500px]"
                    autoFocus={false}
                />
            </div>
        </div>
    );
} 
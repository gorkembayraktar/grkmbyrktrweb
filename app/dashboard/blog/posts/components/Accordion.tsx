import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

interface AccordionProps {
    children: React.ReactNode;
    defaultOpen?: string;
}

interface AccordionItemProps {
    id: string;
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    isOpen?: boolean;
    onToggle?: () => void;
}

export function Accordion({ children, defaultOpen = '' }: AccordionProps) {
    const [openItem, setOpenItem] = useState(defaultOpen);

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {React.Children.map(children, (child: React.ReactNode) => {
                if (React.isValidElement(child)) {
                    if ((child as any).props.id) {
                        return React.cloneElement(child, {
                            isOpen: openItem === (child as any).props.id,
                            onToggle: () => setOpenItem(openItem === (child as any).props.id ? '' : (child as any).props.id)
                        });
                    }
                }
                return child;
            })}
        </div>
    );
}

export function AccordionItem({ id, icon, title, children, isOpen, onToggle }: AccordionItemProps) {
    return (
        <div>
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full p-4 text-left"
            >
                <div className="flex items-center gap-2">
                    <span className="text-gray-400">{icon}</span>
                    <span className="font-medium">{title}</span>
                </div>
                <FaChevronDown
                    className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && (
                <div className="p-4 pt-0">
                    {children}
                </div>
            )}
        </div>
    );
}

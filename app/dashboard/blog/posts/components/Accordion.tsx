import React, { useState, useEffect } from 'react'

interface AccordionProps {
    children: React.ReactNode;
    defaultOpen?: string;
}

interface AccordionChildProps {
    id: string;
    isOpen?: boolean;
    onToggle?: () => void;
}

export function Accordion({ children, defaultOpen = '' }: AccordionProps) {
    const [openItem, setOpenItem] = useState(defaultOpen);

    // defaultOpen değiştiğinde openItem'ı güncelle
    useEffect(() => {
        setOpenItem(defaultOpen);
    }, [defaultOpen]);

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {React.Children.map(children, (child: React.ReactNode) => {
                if (React.isValidElement<AccordionChildProps>(child) && 'id' in child.props) {
                    return React.cloneElement(child, {
                        ...child.props,
                        isOpen: openItem === child.props.id,
                        onToggle: () => {
                            setOpenItem(openItem === child.props.id ? '' : child.props.id);
                        }
                    });
                }
                return child;
            })}
        </div>
    );
}

interface AccordionItemProps {
    id: string;
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    isOpen?: boolean;
    onToggle?: () => void;
}

export function AccordionItem({ id, icon, title, children, isOpen = false, onToggle }: AccordionItemProps) {
    return (
        <div>
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-gray-400">{icon}</span>
                    <span className="font-medium">{title}</span>
                </div>
                <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>
            {isOpen && (
                <div className="p-4 pt-0">
                    {children}
                </div>
            )}
        </div>
    );
}

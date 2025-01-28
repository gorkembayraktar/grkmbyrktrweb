import React from 'react'

interface ToolbarButtonProps {
    onClick: (e: React.MouseEvent) => void;
    icon: React.ReactNode;
    active?: boolean;
    disabled?: boolean;
    tooltip: string;
}

export function ToolbarButton({ onClick, icon, active = false, disabled = false, tooltip }: ToolbarButtonProps) {
    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            disabled={disabled}
            className={`
                p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                transition-colors relative group
                ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            title={tooltip}
        >
            <span className="text-gray-600 dark:text-gray-300">
                {icon}
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs 
                           text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 
                           transition-opacity whitespace-nowrap pointer-events-none">
                {tooltip}
            </div>
        </button>
    );
} 
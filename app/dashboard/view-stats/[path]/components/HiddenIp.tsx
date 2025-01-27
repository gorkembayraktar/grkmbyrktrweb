'use client';
import { useState } from 'react';

export default function HiddenIp({ ip }: { ip: string }) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <button
            onClick={() => setIsVisible(!isVisible)}
            className="text-left hover:text-blue-500 focus:outline-none"
            title={isVisible ? "Gizlemek için tıklayın" : "Görmek için tıklayın"}
        >
            {isVisible ? ip : '***.***.***.**'}
        </button>
    );
} 
'use client';

import { getFlagUrl } from '@/lib/utils';

interface CountryFlagProps {
    code: string;
    name: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeMap = {
    sm: 'w-5 h-4',
    md: 'w-8 h-6',
    lg: 'w-12 h-8',
};

export function CountryFlag({ code, name, size = 'sm', className = '' }: CountryFlagProps) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={getFlagUrl(code)}
            alt={`${name} flag`}
            className={`${sizeMap[size]} object-cover rounded-sm flex-shrink-0 ${className}`}
            width={size === 'lg' ? 48 : size === 'md' ? 32 : 20}
            height={size === 'lg' ? 32 : size === 'md' ? 24 : 15}
        />
    );
}

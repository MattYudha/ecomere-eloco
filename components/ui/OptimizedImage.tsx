'use client';

import Image, { ImageProps } from 'next/image';
import { cloudinaryLoader } from '@/lib/cloudinaryLoader';

export default function OptimizedImage({ alt = '', ...props }: ImageProps) {
    // If priority is true, we must NOT set loading='lazy'
    const safeLoading = props.priority ? undefined : (props.loading ?? 'lazy');

    return (
        <Image
            loader={cloudinaryLoader}
            alt={alt}
            {...props}
            loading={safeLoading}
        />
    );
}

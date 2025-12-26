'use client';

import Image, { ImageProps } from 'next/image';
import { cloudinaryLoader } from '@/lib/cloudinaryLoader';

export default function OptimizedImage(props: ImageProps) {
    return (
        <Image
            loader={cloudinaryLoader}
            {...props}
        />
    );
}

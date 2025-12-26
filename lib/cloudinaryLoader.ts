import type { ImageLoaderProps } from 'next/image';

export const cloudinaryLoader = ({
    src,
    width,
    quality,
}: ImageLoaderProps) => {
    const q = quality || 'auto';

    // 1. Handle Local Assets (start with /)
    // Bypass Cloudinary for these unless you have auto-upload configured.
    // We simply return the src as-is (Next.js will treat it as a static import or public file).
    // Note: By returning just 'src', we lose dynamic resizing for local files unless we use the default loader.
    // Use `config` or environmental switch if you want to force everything.
    if (src.startsWith('/')) {
        return src;
    }

    // 2. Handle Remote URLs (start with http/https)
    // Use Cloudinary "Fetch" feature (type: 'fetch')
    if (src.startsWith('http')) {
        const params = [`f_auto`, `q_${q}`, `w_${width}`];
        return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/fetch/${params.join(',')}/${src}`;
    }

    // 3. Handle Cloudinary Public IDs
    // Standard upload path
    const params = [`f_auto`, `q_${q}`, `w_${width}`];
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${params.join(',')}/${src}`;
};

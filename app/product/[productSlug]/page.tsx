import { Metadata } from 'next';
import ProductPageClient from './ProductPageClient';

interface ProductPageProps {
    params: { productSlug: string };
}

// Generate dynamic metadata for SEO and social sharing
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { productSlug } = params;

    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
        const response = await fetch(`${baseUrl}/api/slugs/${productSlug}`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            return {
                title: 'Produk Tidak Ditemukan | ELOQO.CO',
                description: 'Produk yang Anda cari tidak tersedia.'
            };
        }

        const product = await response.json();

        const getImageUrl = (path: string | null | undefined) => {
            if (!path) return '/product_placeholder.jpg';
            if (path.startsWith('http')) return path;
            return `/${path.replace(/^\//, '')}`;
        };

        const imageUrl = getImageUrl(product.mainImage);
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eloqo.co';
        const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`;

        return {
            title: `${product.title} | ELOQO.CO`,
            description: product.description
                ? product.description.substring(0, 160)
                : `Beli ${product.title} dengan harga terbaik. Produk berkualitas untuk kepuasan Anda.`,
            openGraph: {
                title: product.title,
                description: product.description?.substring(0, 200) || `Beli ${product.title} sekarang!`,
                images: [{
                    url: fullImageUrl,
                    width: 1200,
                    height: 630,
                    alt: product.title
                }],
                type: 'website',
                siteName: 'ELOQO.CO',
                locale: 'id_ID'
            },
            twitter: {
                card: 'summary_large_image',
                title: product.title,
                description: product.description?.substring(0, 200) || `Beli ${product.title} sekarang!`,
                images: [fullImageUrl]
            }
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'ELOQO.CO',
            description: 'Belanja online terpercaya'
        };
    }
}

export default function ProductPage({ params }: ProductPageProps) {
    return <ProductPageClient params={params} />;
}

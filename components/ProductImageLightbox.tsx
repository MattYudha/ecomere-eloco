// *********************
// Role of the component: Product image lightbox with zoom and gallery
// Name of the component: ProductImageLightbox.tsx
// Developer: Eloco E-commerce Team
// Version: 1.0 - Library-based (yet-another-react-lightbox)
// Component call: <ProductImageLightbox images={images} open={open} onClose={onClose} index={index} />
// Input parameters: ProductImageLightboxProps interface
// Output: Fullscreen image gallery with zoom, swipe, and thumbnails
// *********************

'use client';

import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';

// Import styles
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

interface ProductImageLightboxProps {
    images: string[];        // Array of image URLs
    open: boolean;           // Lightbox open state
    onClose: () => void;     // Close callback
    index?: number;          // Initial image index
}

const ProductImageLightbox: React.FC<ProductImageLightboxProps> = ({
    images,
    open,
    onClose,
    index = 0,
}) => {
    // Transform image URLs to lightbox format
    const slides = images.map((src) => ({
        src,
        alt: 'Product image',
    }));

    return (
        <Lightbox
            open={open}
            close={onClose}
            slides={slides}
            index={index}
            // ✅ Enable controlled features only
            plugins={[Zoom, Thumbnails, Fullscreen]}
            // Zoom configuration
            zoom={{
                maxZoomPixelRatio: 3,      // Max 3x zoom
                zoomInMultiplier: 2,        // Double tap zoom
                doubleTapDelay: 300,        // Double tap delay
                doubleClickDelay: 300,      // Double click delay
                doubleClickMaxStops: 2,     // Max zoom stops
                keyboardMoveDistance: 50,   // Arrow key move distance
                wheelZoomDistanceFactor: 100, // Scroll zoom sensitivity
                pinchZoomDistanceFactor: 100, // Pinch zoom sensitivity
                scrollToZoom: true,         // Enable scroll to zoom
            }}
            // Thumbnails configuration
            thumbnails={{
                position: 'bottom',         // Position at bottom
                width: 80,                  // Thumbnail width
                height: 80,                 // Thumbnail height
                border: 2,                  // Border width
                borderRadius: 8,            // Border radius
                padding: 4,                 // Padding
                gap: 8,                     // Gap between thumbnails
                imageFit: 'cover',          // Image fit
            }}
            // Animation settings
            animation={{
                fade: 300,                  // Fade duration
                swipe: 300,                 // Swipe duration
                easing: {
                    fade: 'ease-in-out',
                    swipe: 'ease-out',
                    navigation: 'ease-in-out',
                },
            }}
            // Carousel settings
            carousel={{
                finite: false,              // Loop navigation
                preload: 1,                 // ✅ Preload only 1 before & 1 after
                padding: '0px',
                spacing: '0px',
                imageFit: 'contain',
            }}
            // Controller settings
            controller={{
                closeOnBackdropClick: true, // Close on backdrop click
                closeOnPullDown: true,      // Close on pull down (mobile)
                closeOnPullUp: false,
            }}
            // Render settings
            render={{
                buttonPrev: images.length <= 1 ? () => null : undefined,
                buttonNext: images.length <= 1 ? () => null : undefined,
            }}
            // Styles
            styles={{
                container: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                },
            }}
        />
    );
};

export default ProductImageLightbox;

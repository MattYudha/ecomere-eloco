import React from 'react';
import { AboutHero } from '@/components/about/AboutHero';
import { AboutStory } from '@/components/about/AboutStory';
import { MissionSection } from '@/components/about/MissionSection';
import { WhyChooseUs } from '@/components/about/WhyChooseUs';
import { StatsCounter } from '@/components/about/StatsCounter';
import { PartnerSlider } from '@/components/about/PartnerSlider';
import { DocSlider } from '@/components/about/DocSlider';
import { AboutCTA } from '@/components/about/AboutCTA';

export const metadata = {
    title: 'Tentang Kami | Eloco',
    description: 'Profil Perusahaan Eloco - Premium Snack Brand.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white text-gray-900 font-dm-sans selection:bg-orange-100">
            {/* 1. Hero Section */}
            <AboutHero />

            {/* 2. Story Section (Narrative) */}
            <AboutStory />

            {/* 3. Vision & Mission (Icon Grid) */}
            <MissionSection />

            {/* 4. Values (Nilai Kami List) */}
            <WhyChooseUs />

            {/* 5. Statistics Strip */}
            <StatsCounter />

            {/* 6. Partners Slider */}
            <PartnerSlider />

            {/* 7. Documentation Slider */}
            <DocSlider />

            {/* 8. Trust Badges & 9. CTA */}
            <AboutCTA />
        </main>
    );
}

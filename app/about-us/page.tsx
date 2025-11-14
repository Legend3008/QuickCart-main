'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/about/hero-section';
import { StorySection } from '@/components/about/story-section';
import { ValuesSection } from '@/components/about/values-section';
import { StatsSection } from '@/components/about/stats-section';
import { FeaturedSection } from '@/components/about/featured-section';
import { CTASection } from '@/components/about/cta-section';

export default function AboutUsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-neutral-950"
    >
      {/* Hero Section */}
      <HeroSection />

      {/* Story Section */}
      <StorySection />

      {/* Stats Section */}
      <StatsSection />

      {/* Values Section */}
      <ValuesSection />

      {/* Featured Products Section */}
      <FeaturedSection />

      {/* CTA Section */}
      <CTASection />
    </motion.div>
  );
}

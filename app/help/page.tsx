'use client';

import { useState } from 'react';
import HeroSection from '@/components/help/HeroSection';
import HelpTopics from '@/components/help/HelpTopics';
import FAQSection from '@/components/help/FAQSection';
import ContactSupport from '@/components/help/ContactSupport';
import DealsSection from '@/components/help/DealsSection';
import FeedbackForm from '@/components/help/FeedbackForm';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Scroll to FAQ section
    const faqSection = document.getElementById('faq-section');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      <HeroSection onSearch={handleSearch} />
      <HelpTopics />
      <div id="faq-section">
        <FAQSection searchQuery={searchQuery} />
      </div>
      <ContactSupport />
      <DealsSection />
      <FeedbackForm />
    </main>
  );
}

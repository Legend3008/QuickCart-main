'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, ThumbsUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface FAQSectionProps {
  searchQuery?: string;
}

export default function FAQSection({ searchQuery = '' }: FAQSectionProps) {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState('');
  const queryClient = useQueryClient();

  // Use external search query if provided, otherwise use local
  const activeSearch = searchQuery || localSearch;

  const { data, isLoading, error } = useQuery({
    queryKey: ['faqs', selectedCategory, activeSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (activeSearch) params.append('search', activeSearch);

      const res = await fetch(`/api/help/faqs?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch FAQs');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const markHelpfulMutation = useMutation({
    mutationFn: async (faqId: string) => {
      const res = await fetch('/api/help/faqs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqId, action: 'helpful' }),
      });
      if (!res.ok) throw new Error('Failed to mark as helpful');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });

  const faqs: FAQ[] = data?.faqs || [];

  const categories = useMemo(() => {
    const cats = new Set(faqs.map(faq => faq.category));
    return ['all', ...Array.from(cats)];
  }, [faqs]);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const handleMarkHelpful = (faqId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markHelpfulMutation.mutate(faqId);
  };

  if (error) {
    return (
      <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-neutral-600 dark:text-neutral-400">
            Unable to load FAQs. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Quick answers to common questions
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Local Search */}
          {!searchQuery && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-white dark:bg-neutral-800 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* FAQs List */}
        {!isLoading && faqs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              No FAQs found. Try a different search or category.
            </p>
          </motion.div>
        )}

        {!isLoading && faqs.length > 0 && (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <button
                  onClick={() => toggleFAQ(faq._id)}
                  className="w-full text-left p-6 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {faq.question}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400">
                        {faq.category}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: openFAQ === faq._id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-6 h-6 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {openFAQ === faq._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                            {faq.answer}
                          </p>
                          
                          {/* Helpful Button */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => handleMarkHelpful(faq._id, e)}
                              disabled={markHelpfulMutation.isPending}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-sm font-medium disabled:opacity-50"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span>Helpful</span>
                              {faq.helpful > 0 && (
                                <span className="ml-1 text-xs">({faq.helpful})</span>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

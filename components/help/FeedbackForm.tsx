'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface FeedbackFormData {
  name: string;
  email: string;
  category: string;
  message: string;
}

export default function FeedbackForm() {
  const { user } = useUser();
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: user?.fullName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    category: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<FeedbackFormData>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    'General Inquiry',
    'Technical Support',
    'Account Issue',
    'Payment Problem',
    'Shipping Query',
    'Product Feedback',
    'Feature Request',
    'Other'
  ];

  const mutation = useMutation({
    mutationFn: async (data: FeedbackFormData & { userId?: string }) => {
      const res = await fetch('/api/help/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.message || 'Failed to submit feedback');
      }
      
      return result;
    },
    onSuccess: () => {
      setShowSuccess(true);
      setFormData({
        name: user?.fullName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        category: '',
        message: ''
      });
      setErrors({});
      
      setTimeout(() => setShowSuccess(false), 5000);
    }
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<FeedbackFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    mutation.mutate({
      ...formData,
      userId: user?.id
    });
  };

  const handleChange = (field: keyof FeedbackFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-neutral-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Send us a message and we'll get back to you within 24 hours
          </p>
        </motion.div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-xl bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-start gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-900 dark:text-green-100 font-medium">
                Thank you for your feedback!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                We've received your message and will respond within 24 hours.
              </p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {mutation.isError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-900 dark:text-red-100 font-medium">
                Failed to submit feedback
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {mutation.error?.message || 'Please try again later'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Name & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-neutral-200 dark:border-neutral-700'
                } bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all`}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.email
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-neutral-200 dark:border-neutral-700'
                } bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
              Issue Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.category
                  ? 'border-red-500 dark:border-red-400'
                  : 'border-neutral-200 dark:border-neutral-700'
              } bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all`}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
              Message *
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              rows={6}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.message
                  ? 'border-red-500 dark:border-red-400'
                  : 'border-neutral-200 dark:border-neutral-700'
              } bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all resize-none`}
              placeholder="Describe your issue or question in detail..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
            )}
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              {formData.message.length} characters (minimum 10 required)
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
          >
            {mutation.isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

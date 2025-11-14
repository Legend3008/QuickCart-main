'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageCircle, ExternalLink } from 'lucide-react';

export default function ContactSupport() {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone Support',
      value: '+91-9279139087',
      description: 'Mon-Fri, 9 AM - 6 PM IST',
      gradient: 'from-blue-500 to-cyan-500',
      action: 'tel:+919279139087'
    },
    {
      icon: Mail,
      title: 'Email Support',
      value: 'yesimyadav@gmail.com',
      description: 'Response within 24 hours',
      gradient: 'from-purple-500 to-pink-500',
      action: 'mailto:yesimyadav@gmail.com'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      value: 'Chat with us',
      description: 'Average wait time: 2 minutes',
      gradient: 'from-green-500 to-emerald-500',
      action: '#' // Could link to a chat widget
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: 'Mumbai, Maharashtra, India',
      description: 'By appointment only',
      gradient: 'from-orange-500 to-red-500',
      action: '#'
    }
  ];

  const supportHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM IST' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM IST' },
    { day: 'Sunday & Holidays', hours: 'Closed' }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Our support team is always ready to help you with any questions or concerns
          </p>
        </motion.div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            
            return (
              <motion.a
                key={method.title}
                href={method.action}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-transparent transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl"
              >
                {/* Gradient border on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="absolute inset-[2px] rounded-2xl bg-white dark:bg-neutral-900" />

                <div className="relative">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${method.gradient} mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {method.value}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">
                    {method.description}
                  </p>

                  {/* Arrow */}
                  <ExternalLink className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute top-6 right-6 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Support Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Support Hours
              </h3>
            </div>

            <div className="space-y-4">
              {supportHours.map((schedule, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                >
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {schedule.day}
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200 text-center">
                <strong>Note:</strong> For urgent matters outside business hours, please email us and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

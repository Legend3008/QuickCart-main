import * as React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lightbulb, Heart, Leaf, Zap, Users } from 'lucide-react';

export function ValuesSection() {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your data and transactions are protected with bank-level security. We never compromise on your privacy.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We constantly evolve our platform with cutting-edge technology to enhance your shopping experience.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Every decision we make starts with you. Your satisfaction and happiness drive our success.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'We\'re committed to eco-friendly practices and reducing our environmental footprint.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Speed & Efficiency',
      description: 'Lightning-fast delivery, quick support, and seamless checkout — your time matters to us.',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a vibrant community of smart shoppers and trusted sellers who grow together.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
              Our Core Values
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              The principles that guide us in delivering exceptional experiences every day
            </p>
          </motion.div>

          {/* Values Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className="relative rounded-2xl bg-white dark:bg-neutral-800 p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700 h-full">
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    {/* Icon */}
                    <div className={`relative rounded-xl bg-gradient-to-br ${value.gradient} w-14 h-14 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">{value.title}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

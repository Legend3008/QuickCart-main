import * as React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, Award, Users } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: '2M+',
      label: 'Happy Customers',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30'
    },
    {
      icon: ShoppingBag,
      value: '50K+',
      label: 'Products Listed',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30'
    },
    {
      icon: TrendingUp,
      value: '98%',
      label: 'Satisfaction Rate',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/30'
    },
    {
      icon: Award,
      value: '5000+',
      label: 'Trusted Sellers',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-neutral-950">
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
              SmartBazar by the Numbers
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Real metrics that showcase our commitment to excellence and growth
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                  className="text-center"
                >
                  <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-900 p-8 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition-all duration-300">
                    {/* Icon */}
                    <div className={`${stat.bgColor} ${stat.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    
                    {/* Value */}
                    <div className="text-4xl sm:text-5xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">
                      {stat.value}
                    </div>
                    
                    {/* Label */}
                    <div className="text-neutral-600 dark:text-neutral-400 font-medium">
                      {stat.label}
                    </div>
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

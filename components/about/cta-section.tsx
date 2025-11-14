import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  const features = [
    {
      icon: Smartphone,
      text: 'Shop anywhere, anytime'
    },
    {
      icon: Zap,
      text: 'Lightning-fast checkout'
    },
    {
      icon: Globe,
      text: 'Global marketplace access'
    }
  ];

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 dark:from-primary-900 dark:via-purple-900 dark:to-pink-900" />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Join Millions of Smart Shoppers
            </h2>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Discover deals that make sense. Experience shopping reimagined.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{feature.text}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-white/90 text-lg px-8 py-6 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                onClick={() => window.location.href = '/all-products'}
              >
                Start Shopping Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-6 rounded-full font-semibold transition-all duration-300"
                onClick={() => window.location.href = '/deals'}
              >
                Explore Today's Deals
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

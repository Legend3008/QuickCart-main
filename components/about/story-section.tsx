import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Target, Eye, Rocket } from 'lucide-react';

export function StorySection() {
  const milestones = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To revolutionize online shopping by providing a seamless, trustworthy, and intelligent platform that connects buyers with quality products at the best prices.'
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To become the world\'s most trusted e-commerce destination, where technology meets humanity, and every transaction creates lasting value.'
    },
    {
      icon: Rocket,
      title: 'Our Journey',
      description: 'Founded with a dream to democratize online commerce, SmartBazar has grown from a simple idea to a thriving marketplace serving millions of satisfied customers.'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-neutral-950">
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
              The SmartBazar Story
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Born from a passion to transform the way people shop online, SmartBazar 
              combines cutting-edge technology with genuine care for our customers.
            </p>
          </motion.div>

          {/* Main Story Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
                alt="SmartBazar Team"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Building Trust, One Transaction at a Time
              </h3>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                What started as a small startup in 2020 has evolved into a comprehensive 
                e-commerce platform serving customers worldwide. We believe that shopping 
                should be more than just transactions — it should be an experience built 
                on trust, quality, and innovation.
              </p>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Every product, every seller, and every review on SmartBazar is carefully 
                curated to ensure you get nothing but the best. Our commitment to excellence 
                drives everything we do.
              </p>
            </motion.div>
          </div>

          {/* Mission, Vision, Journey Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <motion.div
                  key={milestone.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="group"
                >
                  <div className="relative rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 p-8 border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-all duration-300 h-full">
                    {/* Icon */}
                    <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Title */}
                    <h4 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">{milestone.title}</h4>

                    {/* Description */}
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {milestone.description}
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

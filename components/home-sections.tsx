'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, ShieldCheck, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const categories = [
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    href: '/all-products?category=Electronics',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    href: '/all-products?category=Fashion',
    color: 'from-pink-500 to-rose-500',
  },
  {
    name: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400',
    href: '/all-products?category=Home',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
    href: '/all-products?category=Sports',
    color: 'from-orange-500 to-amber-500',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Delivery',
    description: 'Get your orders delivered within 24-48 hours',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: '100% secure and encrypted payment processing',
  },
  {
    icon: TrendingUp,
    title: 'Best Prices',
    description: 'Competitive prices with daily deals and discounts',
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Badge variant="secondary" className="w-fit">
              ✨ Welcome to SmartBazar
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Discover Amazing
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {' '}
                Deals{' '}
              </span>
              Every Day
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Shop from millions of products across all categories. Great prices, fast shipping, and
              hassle-free returns guaranteed.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/all-products">
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/deals">View Today's Deals</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm">
              <Image
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"
                alt="Shopping Experience"
                fill
                className="object-cover opacity-90"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-background border rounded-lg p-4 shadow-lg">
              <p className="text-sm font-semibold">🎉 Special Offer</p>
              <p className="text-2xl font-bold text-primary">Up to 70% OFF</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-secondary/5 rounded-full blur-3xl" />
    </section>
  );
}

export function CategoriesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of categories and find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={category.href}>
                <Card className="group relative overflow-hidden aspect-square transition-all duration-300 hover:shadow-xl">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-white/80 text-sm group-hover:text-white transition-colors">
                      Explore →
                    </p>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DealsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
            <Badge variant="destructive" className="w-fit">
              🔥 Limited Time Offer
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Don't Miss Today's
              <span className="text-primary"> Featured Deals</span>
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Grab amazing discounts on top products before they're gone. New deals added daily!
            </p>
            <Button size="lg" asChild>
              <Link href="/deals">
                View All Deals
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="flex-1 relative">
            <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
              <Image
                src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600"
                alt="Daily Deals"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground rounded-full px-4 py-2 font-bold shadow-lg">
                UP TO 70% OFF
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

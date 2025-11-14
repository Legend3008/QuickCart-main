'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingCart, User, Heart, X, ChevronDown, Package } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/nextjs';
import { useUIStore, useCartStore, useWishlistStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { BagIcon, CartIcon, HomeIcon, BoxIcon } from '@/assets/assets';

const categories = [
  {
    name: 'Electronics',
    subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Headphones', 'Smart Watches'],
  },
  {
    name: 'Fashion',
    subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories', 'Jewelry', 'Bags'],
  },
  {
    name: 'Home & Garden',
    subcategories: ['Furniture', 'Kitchen', 'Bedding', 'Decor', 'Garden Tools', 'Lighting'],
  },
  {
    name: 'Sports',
    subcategories: ['Fitness', 'Outdoor', 'Cycling', 'Team Sports', 'Water Sports', 'Gym Equipment'],
  },
  {
    name: 'Books',
    subcategories: ['Fiction', 'Non-Fiction', 'Comics', 'Textbooks', 'Children\'s Books', 'eBooks'],
  },
];

export function Header() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showMegaMenu, setShowMegaMenu] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const menuTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const { isMobileMenuOpen, isSearchOpen, toggleMobileMenu, toggleSearch, openCart } = useUIStore();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistItems = useWishlistStore((state) => state.items);
  const { openSignIn } = useClerk();
  const { isSignedIn, user: clerkUser } = useUser();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleMenuEnter = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setShowMegaMenu(true);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setShowMegaMenu(false);
    }, 300); // 300ms delay before closing
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/all-products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex h-10 items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-muted-foreground">
                Welcome to SmartBazar - Your One-Stop Shop
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/seller" className="text-muted-foreground hover:text-foreground transition-colors">
                Sell
              </Link>
              <span className="text-muted-foreground">|</span>
              <Link href="/my-orders" className="text-muted-foreground hover:text-foreground transition-colors">
                Track Order
              </Link>
              <span className="text-muted-foreground hidden sm:inline">|</span>
              <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex items-center">
              <ShoppingCart className="h-7 w-7 text-primary" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                SmartBazar
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl">
            <div className="relative flex w-full">
              <Input
                type="search"
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pr-12 rounded-r-none border-r-0"
              />
              <Button
                type="submit"
                size="sm"
                className="rounded-l-none h-10 px-6"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleSearch}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex">
                <Heart className="h-5 w-5" />
                {mounted && wishlistItems.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                    {wishlistItems.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* My Orders */}
            <Link href="/my-orders">
              <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex">
                <Package className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* User Account */}
            {!mounted ? (
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex" disabled>
                <User className="h-5 w-5" />
              </Button>
            ) : isSignedIn ? (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={openCart} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => window.location.href = '/my-orders'} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => window.location.href = '/'} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="Products" labelIcon={<BoxIcon />} onClick={() => window.location.href = '/all-products'} />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden sm:inline-flex" 
                onClick={() => openSignIn()}
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="lg:hidden pb-4">
            <div className="relative flex w-full">
              <Input
                type="search"
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pr-12 rounded-r-none border-r-0"
                autoFocus
              />
              <Button
                type="submit"
                size="sm"
                className="rounded-l-none h-10 px-6"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Category Navigation - Desktop */}
      <div className="border-t hidden lg:block">
        <div className="container mx-auto px-4">
          <nav className="flex items-center h-12 gap-6">
            <button
              className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
              onMouseEnter={handleMenuEnter}
              onMouseLeave={handleMenuLeave}
            >
              All Categories
              <ChevronDown className="h-4 w-4" />
            </button>

            <Link
              href="/deals"
              className={cn(
                'text-sm font-medium hover:text-primary transition-colors',
                pathname === '/deals' && 'text-primary'
              )}
            >
              Today's Deals
            </Link>

            <Link
              href="/trending"
              className={cn(
                'text-sm font-medium hover:text-primary transition-colors',
                pathname === '/trending' && 'text-primary'
              )}
            >
              Trending
            </Link>

            <Link
              href="/new-arrivals"
              className={cn(
                'text-sm font-medium hover:text-primary transition-colors',
                pathname === '/new-arrivals' && 'text-primary'
              )}
            >
              New Arrivals
            </Link>

            <Link
              href="/"
              className={cn(
                'text-sm font-medium hover:text-primary transition-colors',
                pathname === '/' && 'text-primary'
              )}
            >
              Home
            </Link>

            <Link
              href="/all-products"
              className={cn(
                'text-sm font-medium hover:text-primary transition-colors',
                pathname === '/all-products' && 'text-primary'
              )}
            >
              Shop
            </Link>

            <Link
              href="/about-us"
              className={cn(
                'text-sm font-medium hover:text-primary transition-colors',
                pathname === '/about-us' && 'text-primary'
              )}
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className={cn(
                'text-sm font-medium hover:text-primary transition-colors',
                pathname === '/contact' && 'text-primary'
              )}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>

      {/* Mega Menu - Desktop */}
      {showMegaMenu && (
        <div
          className="absolute left-0 right-0 top-full bg-background border-b shadow-lg z-50 hidden lg:block"
          onMouseEnter={handleMenuEnter}
          onMouseLeave={handleMenuLeave}
        >
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-5 gap-8">
              {categories.map((category) => (
                <div key={category.name}>
                  <h3 className="font-semibold text-sm mb-3 text-foreground">
                    {category.name}
                  </h3>
                  <ul className="space-y-2">
                    {category.subcategories.map((sub) => (
                      <li key={sub}>
                        <Link
                          href={`/all-products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setShowMegaMenu(false)}
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {categories.map((category) => (
              <div key={category.name} className="border-b last:border-b-0 pb-3 last:pb-0">
                <button
                  className="flex items-center justify-between w-full py-2 font-medium text-sm"
                  onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
                >
                  {category.name}
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      activeCategory === category.name && 'rotate-180'
                    )}
                  />
                </button>
                {activeCategory === category.name && (
                  <div className="pl-4 space-y-2 mt-2">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`/all-products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                        onClick={toggleMobileMenu}
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 space-y-2 border-t">
              <Link
                href="/deals"
                className="block text-sm font-medium py-2"
                onClick={toggleMobileMenu}
              >
                Today's Deals
              </Link>
              <Link
                href="/trending"
                className="block text-sm font-medium py-2"
                onClick={toggleMobileMenu}
              >
                Trending
              </Link>
              <Link
                href="/new-arrivals"
                className="block text-sm font-medium py-2"
                onClick={toggleMobileMenu}
              >
                New Arrivals
              </Link>
              <Link
                href="/"
                className="block text-sm font-medium py-2"
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
              <Link
                href="/all-products"
                className="block text-sm font-medium py-2"
                onClick={toggleMobileMenu}
              >
                Shop
              </Link>
              <Link
                href="/about-us"
                className="block text-sm font-medium py-2"
                onClick={toggleMobileMenu}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block text-sm font-medium py-2"
                onClick={toggleMobileMenu}
              >
                Contact
              </Link>
              <Link
                href="/my-orders"
                className="block text-sm font-medium py-2"
                onClick={toggleMobileMenu}
              >
                My Orders
              </Link>
              <Link
                href="/account"
                className="block text-sm font-medium py-2 sm:hidden"
                onClick={toggleMobileMenu}
              >
                My Account
              </Link>
              <Link
                href="/wishlist"
                className="block text-sm font-medium py-2 sm:hidden"
                onClick={toggleMobileMenu}
              >
                Wishlist {mounted && wishlistItems.length > 0 && `(${wishlistItems.length})`}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

/**
 * About Us Page - E2E Tests
 * Tests navigation, rendering, animations, and user interactions
 */

import { test, expect } from '@playwright/test';

test.describe('About Us Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about-us');
  });

  test('should load without 404 error', async ({ page }) => {
    await expect(page).not.toHaveURL(/404/);
    await expect(page.locator('h1')).toContainText('Empowering Smart Shopping');
  });

  test('should navigate from header About Us link', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'About Us' }).first().click();
    await page.waitForURL('/about-us');
    await expect(page.locator('h1')).toContainText('Empowering Smart Shopping');
  });

  test('should display hero section with CTA', async ({ page }) => {
    await expect(page.getByText('Empowering Smart Shopping')).toBeVisible();
    await expect(page.getByText(/blend technology and trust/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Start Shopping/i })).toBeVisible();
  });

  test('should display story section', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 800));
    await expect(page.getByText('The SmartBazar Story')).toBeVisible();
    await expect(page.getByText(/Born from a passion/i)).toBeVisible();
  });

  test('should display mission, vision, and journey cards', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(page.getByText('Our Mission')).toBeVisible();
    await expect(page.getByText('Our Vision')).toBeVisible();
    await expect(page.getByText('Our Journey')).toBeVisible();
  });

  test('should display statistics section', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 2000));
    await expect(page.getByText('SmartBazar by the Numbers')).toBeVisible();
    await expect(page.getByText('2M+')).toBeVisible();
    await expect(page.getByText('Happy Customers')).toBeVisible();
  });

  test('should display core values section', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 2800));
    await expect(page.getByText('Our Core Values')).toBeVisible();
    await expect(page.getByText('Trust & Security')).toBeVisible();
    await expect(page.getByText('Innovation')).toBeVisible();
    await expect(page.getByText('Customer First')).toBeVisible();
  });

  test('should display featured products section', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 3600));
    await expect(page.getByText('Featured Products')).toBeVisible();
    
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"], .animate-pulse', {
      timeout: 10000
    });
  });

  test('should display CTA section with buttons', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText('Join Millions of Smart Shoppers')).toBeVisible();
    await expect(page.getByRole('button', { name: /Start Shopping Now/i })).toBeVisible();
  });

  test('should have working CTA buttons', async ({ page }) => {
    // Hero CTA
    const heroButton = page.getByRole('button', { name: /Start Shopping/i }).first();
    await heroButton.click();
    await page.waitForURL('/all-products');
    
    // Go back
    await page.goBack();
    await page.waitForURL('/about-us');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    await expect(page.getByText('Empowering Smart Shopping')).toBeVisible();
    
    // Test mobile navigation
    const mobileMenuButton = page.locator('button[class*="lg:hidden"]').first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await expect(page.getByRole('link', { name: 'About Us' })).toBeVisible();
    }
  });

  test('should have smooth scroll behavior', async ({ page }) => {
    const scrollBefore = await page.evaluate(() => window.scrollY);
    await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'smooth' }));
    await page.waitForTimeout(500);
    const scrollAfter = await page.evaluate(() => window.scrollY);
    
    expect(scrollAfter).toBeGreaterThan(scrollBefore);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('Empowering Smart Shopping');

    const h2Elements = page.locator('h2');
    const h2Count = await h2Elements.count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test('should have correct meta tags', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('About Us');

    const metaDescription = page.locator('meta[name="description"]');
    const description = await metaDescription.getAttribute('content');
    expect(description).toBeTruthy();
    expect(description?.length).toBeGreaterThan(50);
  });

  test('should load images efficiently', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();

      // Check for lazy loading
      const loading = await firstImage.getAttribute('loading');
      expect(['lazy', 'eager']).toContain(loading);
    }
  });

  test('should work in dark mode', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /theme/i });
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);

      const htmlElement = page.locator('html');
      const className = await htmlElement.getAttribute('class');
      expect(className).toContain('dark');
    }
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');

    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('Failed to load resource') &&
        !error.includes('net::ERR')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
  });

  test('should display all value cards with icons', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 3000));
    
    const valueCards = [
      'Trust & Security',
      'Innovation',
      'Customer First',
      'Sustainability',
      'Speed & Efficiency',
      'Community'
    ];

    for (const value of valueCards) {
      await expect(page.getByText(value)).toBeVisible();
    }
  });

  test('should measure performance', async ({ page }) => {
    await page.goto('/about-us');

    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
      };
    });

    expect(performanceMetrics.domContentLoaded).toBeGreaterThan(0);
    expect(performanceMetrics.domInteractive).toBeGreaterThan(0);
  });
});

test.describe('About Us - User Flows', () => {
  test('complete user journey: navigate → read → explore products → shop', async ({ page }) => {
    // 1. Navigate from home
    await page.goto('/');
    await page.getByRole('link', { name: 'About Us' }).first().click();
    await page.waitForURL('/about-us');

    // 2. Read content
    await expect(page.getByText('Empowering Smart Shopping')).toBeVisible();

    // 3. Scroll to featured products
    await page.evaluate(() => window.scrollTo(0, 3600));
    await page.waitForTimeout(1000);

    // 4. Check if View All Products button exists
    const viewAllButton = page.getByRole('button', { name: /View All Products/i });
    if (await viewAllButton.isVisible()) {
      await viewAllButton.click();
      await page.waitForURL('/all-products');
      await expect(page).toHaveURL('/all-products');
    }
  });

  test('navigate through all sections smoothly', async ({ page }) => {
    await page.goto('/about-us');

    const sections = [
      { scroll: 0, text: 'Empowering Smart Shopping' },
      { scroll: 1000, text: 'The SmartBazar Story' },
      { scroll: 2000, text: 'SmartBazar by the Numbers' },
      { scroll: 3000, text: 'Our Core Values' },
      { scroll: 4000, text: 'Featured Products' },
    ];

    for (const section of sections) {
      await page.evaluate((scroll) => window.scrollTo(0, scroll), section.scroll);
      await page.waitForTimeout(500);
      await expect(page.getByText(section.text)).toBeVisible();
    }
  });
});

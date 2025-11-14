/**
 * E2E Tests for New Arrivals Page
 * Tests navigation, user interactions, and visual elements
 */

import { test, expect } from '@playwright/test';

test.describe('New Arrivals Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/new-arrivals');
  });

  test('should load without 404 error', async ({ page }) => {
    await expect(page).not.toHaveURL(/404/);
    await expect(page.locator('h1')).toContainText('New Arrivals');
  });

  test('should display hero section with stats', async ({ page }) => {
    await expect(page.getByText('New Arrivals')).toBeVisible();
    await expect(page.getByText('150+')).toBeVisible();
    await expect(page.getByText('Fresh Products')).toBeVisible();
    await expect(page.getByText('25+')).toBeVisible();
    await expect(page.getByText('Added Today')).toBeVisible();
  });

  test('should navigate from header menu', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'New Arrivals' }).click();
    await page.waitForURL('/new-arrivals');
    await expect(page.locator('h1')).toContainText('New Arrivals');
  });

  test('should load and display products', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"], .animate-pulse', {
      timeout: 5000,
    });

    // Check if either products loaded or loading state visible
    const hasProducts = await page.locator('[data-testid="product-card"]').count();
    const isLoading = await page.locator('.animate-pulse').count();

    expect(hasProducts > 0 || isLoading > 0).toBeTruthy();
  });

  test('should change sort order', async ({ page }) => {
    const sortSelect = page.locator('select');
    await sortSelect.waitFor({ state: 'visible' });

    // Change to price low to high
    await sortSelect.selectOption('price-low');
    await expect(sortSelect).toHaveValue('price-low');

    // Change to newest
    await sortSelect.selectOption('newest');
    await expect(sortSelect).toHaveValue('newest');
  });

  test('should toggle view modes on desktop', async ({ page, viewport }) => {
    if (viewport && viewport.width >= 768) {
      const gridButton = page.getByRole('button', { name: '4 column grid' });
      const listButton = page.getByRole('button', { name: '3 column grid' });

      await gridButton.waitFor({ state: 'visible', timeout: 5000 });

      await listButton.click();
      await expect(listButton).toHaveClass(/bg-primary/);

      await gridButton.click();
      await expect(gridButton).toHaveClass(/bg-primary/);
    }
  });

  test('should display feature section', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Scroll to features
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await expect(page.getByText('Why Shop New Arrivals?')).toBeVisible();
    await expect(page.getByText('Latest Products')).toBeVisible();
    await expect(page.getByText('Quality Assured')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    await expect(page.getByText('New Arrivals')).toBeVisible();

    // Sort select should be visible and full width
    const sortSelect = page.locator('select');
    await expect(sortSelect).toBeVisible();
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // Mock empty response
    await page.route('**/api/product/list', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] }),
      });
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/No New Arrivals Right Now/i)).toBeVisible();
    await expect(page.getByText(/Check back soon/i)).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock error response
    await page.route('**/api/product/list', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/Unable to Load Products/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Refresh Page/i })).toBeVisible();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('New Arrivals');

    const h2Elements = page.locator('h2');
    const h2Count = await h2Elements.count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test('should have accessible navigation', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check if focus is visible
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'SELECT', 'INPUT']).toContain(focusedElement);
  });

  test('should load images efficiently', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check for lazy loading
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();

      // Check for loading attribute
      const loading = await firstImage.getAttribute('loading');
      expect(['lazy', 'eager']).toContain(loading);
    }
  });

  test('should work in dark mode', async ({ page }) => {
    // Toggle dark mode
    const themeToggle = page.getByRole('button', { name: /theme/i });
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Check if dark mode class applied
      const htmlElement = page.locator('html');
      const className = await htmlElement.getAttribute('class');
      expect(className).toContain('dark');
    }
  });

  test('should have correct meta tags', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('New Arrivals');

    const metaDescription = page.locator('meta[name="description"]');
    const description = await metaDescription.getAttribute('content');
    expect(description).toBeTruthy();
    expect(description?.length).toBeGreaterThan(50);
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors (like network failures in tests)
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('Failed to load resource') &&
        !error.includes('net::ERR')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should measure performance', async ({ page }) => {
    await page.goto('/new-arrivals');

    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
      };
    });

    // Check if metrics are reasonable (not testing exact values in E2E)
    expect(performanceMetrics.domContentLoaded).toBeGreaterThan(0);
    expect(performanceMetrics.domInteractive).toBeGreaterThan(0);
  });
});

test.describe('New Arrivals - User Flows', () => {
  test('complete user journey: browse → sort → view product', async ({ page }) => {
    // 1. Navigate to page
    await page.goto('/new-arrivals');
    await expect(page.locator('h1')).toContainText('New Arrivals');

    // 2. Wait for products
    await page.waitForSelector('[data-testid="product-card"], text=/No New Arrivals/', {
      timeout: 10000,
    });

    // 3. Try to sort
    const sortSelect = page.locator('select');
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption('price-low');
      await page.waitForTimeout(500);
    }

    // 4. Check product count
    const productCountText = await page.textContent('text=/products/i');
    expect(productCountText).toBeTruthy();
  });
});

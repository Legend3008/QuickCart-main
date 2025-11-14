/**
 * E2E Tests for Contact Page
 * Tests navigation, form validation, submission, and responsiveness
 */

import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should load without 404 error', async ({ page }) => {
    await expect(page).not.toHaveURL(/404/);
    await expect(page.locator('h1')).toContainText('We\'d Love to Hear from You');
  });

  test('should display hero section with correct content', async ({ page }) => {
    await expect(page.getByText('We\'d Love to Hear from You')).toBeVisible();
    await expect(page.getByText('Get in touch with SmartBazar')).toBeVisible();
    await expect(page.getByText('24/7 Support')).toBeVisible();
    await expect(page.getByText('< 2 Hours')).toBeVisible();
  });

  test('should navigate from header Contact link', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Contact' }).click();
    await page.waitForURL('/contact');
    await expect(page.locator('h1')).toContainText('We\'d Love to Hear from You');
  });

  test('should display contact form with all fields', async ({ page }) => {
    await expect(page.getByLabel('Full Name *')).toBeVisible();
    await expect(page.getByLabel('Email Address *')).toBeVisible();
    await expect(page.getByLabel('Subject *')).toBeVisible();
    await expect(page.getByLabel('Message *')).toBeVisible();
    await expect(page.getByRole('button', { name: /Send Message/i })).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /Send Message/i });
    
    // Click submit without filling form
    await submitButton.click();
    
    // Check for validation errors
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Subject is required')).toBeVisible();
    await expect(page.getByText('Message is required')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.getByLabel('Email Address *').fill('invalid-email');
    await page.getByRole('button', { name: /Send Message/i }).click();
    
    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

  test('should validate message length', async ({ page }) => {
    await page.getByLabel('Message *').fill('Short');
    await page.getByRole('button', { name: /Send Message/i }).click();
    
    await expect(page.getByText('Message must be at least 10 characters')).toBeVisible();
  });

  test('should clear error when user starts typing', async ({ page }) => {
    // Trigger validation error
    await page.getByRole('button', { name: /Send Message/i }).click();
    await expect(page.getByText('Name is required')).toBeVisible();
    
    // Start typing
    await page.getByLabel('Full Name *').fill('John');
    
    // Error should disappear
    await expect(page.getByText('Name is required')).not.toBeVisible();
  });

  test('should submit form successfully with valid data', async ({ page }) => {
    await page.getByLabel('Full Name *').fill('John Doe');
    await page.getByLabel('Email Address *').fill('john@example.com');
    await page.getByLabel('Subject *').fill('Product Inquiry');
    await page.getByLabel('Message *').fill('I would like to know more about your products.');
    
    await page.getByRole('button', { name: /Send Message/i }).click();
    
    // Wait for loading state
    await expect(page.getByText('Sending...')).toBeVisible();
    
    // Wait for success message
    await expect(page.getByText(/Your message has been sent successfully/i)).toBeVisible({ timeout: 5000 });
    
    // Form should be cleared
    await expect(page.getByLabel('Full Name *')).toHaveValue('');
    await expect(page.getByLabel('Email Address *')).toHaveValue('');
  });

  test('should display contact information cards', async ({ page }) => {
    await expect(page.getByText('Customer Support')).toBeVisible();
    await expect(page.getByText('+1 (555) 123-4567')).toBeVisible();
    
    await expect(page.getByText('Email Us')).toBeVisible();
    await expect(page.getByText('support@smartbazar.com')).toBeVisible();
    
    await expect(page.getByText('Visit Us')).toBeVisible();
    await expect(page.getByText('123 Commerce Street')).toBeVisible();
    
    await expect(page.getByText('Business Hours')).toBeVisible();
    await expect(page.getByText('Monday - Saturday')).toBeVisible();
  });

  test('should have hover effects on contact cards', async ({ page }) => {
    const card = page.locator('text=Customer Support').locator('..');
    
    // Get initial position
    const box = await card.boundingBox();
    
    // Hover over card
    await card.hover();
    
    // Wait for animation
    await page.waitForTimeout(300);
    
    // Card should have transformed (different position due to translateY)
    const hoverBox = await card.boundingBox();
    expect(hoverBox?.y).toBeLessThan(box?.y || 0);
  });

  test('should display social media links', async ({ page }) => {
    await expect(page.getByText('Follow Us')).toBeVisible();
    
    const socialButtons = page.locator('button[aria-label^="Follow us on"]');
    await expect(socialButtons).toHaveCount(4);
  });

  test('should display CTA section', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    await expect(page.getByText('We\'re Here to Help You 24/7')).toBeVisible();
    await expect(page.getByText('Let\'s make shopping smarter together')).toBeVisible();
    await expect(page.getByRole('button', { name: /Start Shopping/i })).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    await expect(page.getByText('We\'d Love to Hear from You')).toBeVisible();
    await expect(page.getByLabel('Full Name *')).toBeVisible();
    
    // Form should be full width
    const formInput = page.getByLabel('Full Name *');
    const box = await formInput.boundingBox();
    expect(box?.width).toBeGreaterThan(300);
  });

  test('should work in dark mode', async ({ page }) => {
    // Toggle dark mode (if theme toggle is available)
    const themeToggle = page.getByRole('button', { name: /theme/i });
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Check if dark mode class is applied
      const htmlElement = page.locator('html');
      const className = await htmlElement.getAttribute('class');
      expect(className).toContain('dark');
      
      // Text should still be visible
      await expect(page.getByText('We\'d Love to Hear from You')).toBeVisible();
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('We\'d Love to Hear from You');
    
    const h2Elements = page.locator('h2');
    const h2Count = await h2Elements.count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test('should have accessible form labels', async ({ page }) => {
    // All inputs should have associated labels
    const nameInput = page.getByLabel('Full Name *');
    await expect(nameInput).toHaveAttribute('id');
    
    const emailInput = page.getByLabel('Email Address *');
    await expect(emailInput).toHaveAttribute('id');
    
    const subjectInput = page.getByLabel('Subject *');
    await expect(subjectInput).toHaveAttribute('id');
    
    const messageInput = page.getByLabel('Message *');
    await expect(messageInput).toHaveAttribute('id');
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through form fields
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check if focus is on an input or button
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'TEXTAREA', 'A']).toContain(focusedElement);
  });

  test('should have correct meta tags', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Contact');
    
    const metaDescription = page.locator('meta[name="description"]');
    const description = await metaDescription.getAttribute('content');
    expect(description).toBeTruthy();
    expect(description?.length).toBeGreaterThan(50);
  });

  test('should animate on scroll', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Elements should be visible after scroll animation
    await expect(page.getByText('We\'re Here to Help You 24/7')).toBeVisible();
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Filter out known acceptable errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('Failed to load resource') &&
        !error.includes('net::ERR')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should handle form submission button states', async ({ page }) => {
    await page.getByLabel('Full Name *').fill('John Doe');
    await page.getByLabel('Email Address *').fill('john@example.com');
    await page.getByLabel('Subject *').fill('Test');
    await page.getByLabel('Message *').fill('This is a test message with enough characters.');
    
    const submitButton = page.getByRole('button', { name: /Send Message/i });
    
    // Button should be enabled
    await expect(submitButton).toBeEnabled();
    
    // Click submit
    await submitButton.click();
    
    // Button should show loading state
    await expect(page.getByText('Sending...')).toBeVisible();
    
    // Button should be disabled during submission
    await expect(submitButton).toBeDisabled();
  });
});

test.describe('Contact Page - User Flows', () => {
  test('complete contact journey: navigate → fill form → submit', async ({ page }) => {
    // 1. Navigate from home
    await page.goto('/');
    await page.getByRole('link', { name: 'Contact' }).click();
    await page.waitForURL('/contact');
    
    // 2. Verify page loaded
    await expect(page.locator('h1')).toContainText('We\'d Love to Hear from You');
    
    // 3. Fill form
    await page.getByLabel('Full Name *').fill('Jane Smith');
    await page.getByLabel('Email Address *').fill('jane@example.com');
    await page.getByLabel('Subject *').fill('Partnership Inquiry');
    await page.getByLabel('Message *').fill('I am interested in partnering with SmartBazar for wholesale distribution.');
    
    // 4. Submit
    await page.getByRole('button', { name: /Send Message/i }).click();
    
    // 5. Wait for success
    await expect(page.getByText(/Your message has been sent successfully/i)).toBeVisible({ timeout: 5000 });
    
    // 6. Verify form cleared
    await expect(page.getByLabel('Full Name *')).toHaveValue('');
  });
});

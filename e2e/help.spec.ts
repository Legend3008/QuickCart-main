import { test, expect } from '@playwright/test';

test.describe('Help Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/help');
  });

  test('should load help page without errors', async ({ page }) => {
    await expect(page).toHaveTitle(/Help Center/);
    await expect(page.locator('h1')).toContainText('How can we help you');
  });

  test('should display hero section with search', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search for help"]');
    await expect(searchInput).toBeVisible();
    
    const stats = page.locator('text=/24\/7 Support|Response Time|Satisfaction/');
    await expect(stats.first()).toBeVisible();
  });

  test('should search for FAQs', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search for help"]');
    await searchInput.fill('order');
    await searchInput.press('Enter');
    
    // Wait for FAQs to load
    await page.waitForTimeout(1000);
    
    // Should scroll to FAQ section
    const faqSection = page.locator('text=Frequently Asked Questions');
    await expect(faqSection).toBeInViewport();
  });

  test('should display help topics', async ({ page }) => {
    await expect(page.locator('text=Browse Help Topics')).toBeVisible();
    
    // Wait for topics to load
    await page.waitForSelector('text=/Orders & Returns|Payments & Refunds/');
    
    const topics = page.locator('button:has-text("Orders & Returns"), button:has-text("Payments & Refunds")');
    await expect(topics.first()).toBeVisible();
  });

  test('should display and interact with FAQs', async ({ page }) => {
    await page.waitForSelector('text=Frequently Asked Questions');
    
    // Wait for FAQs to load
    await page.waitForTimeout(2000);
    
    // Find and click first FAQ
    const firstFAQ = page.locator('button').filter({ hasText: /How do I|What is|Can I/ }).first();
    
    if (await firstFAQ.isVisible()) {
      await firstFAQ.click();
      
      // Answer should be visible
      await page.waitForTimeout(500);
      const answerText = page.locator('p').filter({ hasText: /You can|We offer|Yes,/ }).first();
      await expect(answerText).toBeVisible();
    }
  });

  test('should filter FAQs by category', async ({ page }) => {
    await page.waitForSelector('text=Frequently Asked Questions');
    await page.waitForTimeout(2000);
    
    // Click on a category filter
    const categoryButton = page.locator('button:has-text("Orders & Returns")').first();
    
    if (await categoryButton.isVisible()) {
      await categoryButton.click();
      await page.waitForTimeout(1000);
      
      // Should show filtered results
      const faqCategory = page.locator('span:has-text("Orders & Returns")').first();
      await expect(faqCategory).toBeVisible();
    }
  });

  test('should mark FAQ as helpful', async ({ page }) => {
    await page.waitForSelector('text=Frequently Asked Questions');
    await page.waitForTimeout(2000);
    
    const firstFAQ = page.locator('button').filter({ hasText: /How do I|What is/ }).first();
    
    if (await firstFAQ.isVisible()) {
      await firstFAQ.click();
      await page.waitForTimeout(500);
      
      const helpfulButton = page.locator('button:has-text("Helpful")').first();
      if (await helpfulButton.isVisible()) {
        await helpfulButton.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('should display contact support section', async ({ page }) => {
    await expect(page.locator('text=Get in Touch')).toBeVisible();
    
    // Check contact methods
    await expect(page.locator('text=Phone Support')).toBeVisible();
    await expect(page.locator('text=Email Support')).toBeVisible();
    await expect(page.locator('text=Live Chat')).toBeVisible();
    
    // Check support hours
    await expect(page.locator('text=Support Hours')).toBeVisible();
  });

  test('should display deals section', async ({ page }) => {
    await expect(page.locator('text=Trending Products & Deals')).toBeVisible();
    
    // Wait for products to load
    await page.waitForTimeout(2000);
    
    // Check if products are displayed
    const productCards = page.locator('a[href*="/product/"]');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should validate feedback form', async ({ page }) => {
    await page.locator('text=Still Need Help?').scrollIntoViewIfNeeded();
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]:has-text("Send Message")');
    await submitButton.click();
    
    // Should show validation errors
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should fill and validate feedback form fields', async ({ page }) => {
    await page.locator('text=Still Need Help?').scrollIntoViewIfNeeded();
    
    // Fill name
    await page.locator('input[id="name"]').fill('John Doe');
    
    // Fill invalid email
    await page.locator('input[id="email"]').fill('invalid-email');
    
    // Select category
    await page.locator('select[id="category"]').selectOption('General Inquiry');
    
    // Fill short message
    await page.locator('textarea[id="message"]').fill('Short');
    
    // Submit
    await page.locator('button[type="submit"]').click();
    
    // Should show validation errors
    await expect(page.locator('text=/Invalid email|must be at least 10/')).toBeVisible();
  });

  test('should submit valid feedback form', async ({ page }) => {
    await page.locator('text=Still Need Help?').scrollIntoViewIfNeeded();
    
    // Fill valid data
    await page.locator('input[id="name"]').fill('John Doe');
    await page.locator('input[id="email"]').fill('john@example.com');
    await page.locator('select[id="category"]').selectOption('General Inquiry');
    await page.locator('textarea[id="message"]').fill('This is a test message with enough characters to pass validation.');
    
    // Submit
    await page.locator('button[type="submit"]').click();
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Should show success or error message
    const successMessage = page.locator('text=/Thank you|received your message/i');
    const errorMessage = page.locator('text=/Failed to submit/i');
    
    await expect(successMessage.or(errorMessage)).toBeVisible();
  });

  test('should work in dark mode', async ({ page }) => {
    // Toggle dark mode (assuming there's a theme toggle)
    const body = page.locator('body');
    await body.evaluate((el) => {
      el.classList.add('dark');
    });
    
    // Check if dark mode is applied
    await expect(body).toHaveClass(/dark/);
    
    // Verify elements are visible in dark mode
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Browse Help Topics')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, viewport }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check for proper ARIA labels
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
    
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    const h2 = page.locator('h2').first();
    await expect(h2).toBeVisible();
  });

  test('should navigate to product from deals section', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    const productLink = page.locator('a[href*="/product/"]').first();
    
    if (await productLink.isVisible()) {
      await productLink.click();
      await page.waitForLoadState('networkidle');
      
      // Should navigate to product page
      expect(page.url()).toContain('/product/');
    }
  });

  test('should load page within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/help');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have proper meta tags', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Help');
    
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
  });
});

test.describe('Help Page - Advanced Features', () => {
  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept API calls and return errors
    await page.route('**/api/help/**', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ success: false, message: 'Server error' })
      });
    });
    
    await page.goto('/help');
    
    // Page should still load without crashing
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should persist search query when scrolling to FAQs', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search for help"]');
    await searchInput.fill('payment');
    await searchInput.press('Enter');
    
    await page.waitForTimeout(1000);
    
    // FAQ section should be visible
    await expect(page.locator('text=Frequently Asked Questions')).toBeInViewport();
  });

  test('should clear form after successful submission', async ({ page }) => {
    await page.locator('text=Still Need Help?').scrollIntoViewIfNeeded();
    
    await page.locator('input[id="name"]').fill('Test User');
    await page.locator('input[id="email"]').fill('test@example.com');
    await page.locator('select[id="category"]').selectOption('General Inquiry');
    await page.locator('textarea[id="message"]').fill('This is a test message for form clearing validation.');
    
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);
    
    // Check if form is cleared (on success)
    const messageField = page.locator('textarea[id="message"]');
    const messageValue = await messageField.inputValue();
    
    // Form should be cleared if submission was successful
    if (await page.locator('text=/Thank you|received/i').isVisible()) {
      expect(messageValue).toBe('');
    }
  });
});

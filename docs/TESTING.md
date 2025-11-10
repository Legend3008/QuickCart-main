# SmartBazar: Testing Strategy & Quality Assurance

## Testing Philosophy

SmartBazar follows a comprehensive testing strategy based on the testing pyramid, ensuring high quality through automated testing at multiple levels.

```
                    ╱╲
                   ╱  ╲
                  ╱ E2E ╲           Few, slow, expensive
                 ╱────────╲
                ╱          ╲
               ╱ Integration╲       Some, moderate speed
              ╱──────────────╲
             ╱                ╲
            ╱  Unit Tests      ╲    Many, fast, cheap
           ╱────────────────────╲
```

## Testing Layers

### 1. Unit Testing

**Framework**: Jest + React Testing Library

**Scope**: Individual functions, components, utilities

**Setup**:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Configuration** (`jest.config.js`):
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

**Example Tests**:

```javascript
// lib/api/__tests__/validation.test.js
import { 
  isValidEmail, 
  validateProductData,
  validatePriceRange 
} from '../validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
    });
    
    it('should reject invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });
  
  describe('validateProductData', () => {
    it('should validate correct product data', () => {
      const data = {
        name: 'Test Product',
        description: 'This is a test product description',
        price: 100,
        offerPrice: 80,
        category: 'Electronics'
      };
      
      const result = validateProductData(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
    
    it('should reject product with invalid price', () => {
      const data = {
        name: 'Test Product',
        description: 'Test description',
        price: -100,
        offerPrice: 80,
        category: 'Electronics'
      };
      
      const result = validateProductData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.price).toBeDefined();
    });
    
    it('should reject when offer price exceeds original price', () => {
      const data = {
        name: 'Test Product',
        description: 'Test description',
        price: 100,
        offerPrice: 120,
        category: 'Electronics'
      };
      
      const result = validateProductData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.offerPrice).toBeDefined();
    });
  });
  
  describe('validatePriceRange', () => {
    it('should return valid price range', () => {
      const result = validatePriceRange(100, 500);
      expect(result.minPrice).toBe(100);
      expect(result.maxPrice).toBe(500);
    });
    
    it('should handle invalid inputs', () => {
      const result = validatePriceRange(-50, 'invalid');
      expect(result.minPrice).toBe(0);
      expect(result.maxPrice).toBeGreaterThan(0);
    });
  });
});
```

```javascript
// components/__tests__/ProductCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    _id: '123',
    name: 'Test Product',
    price: 100,
    offerPrice: 80,
    image: ['https://example.com/image.jpg'],
    category: 'Electronics'
  };
  
  it('should render product information', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('₹80')).toBeInTheDocument();
  });
  
  it('should call addToCart when button clicked', () => {
    const mockAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct._id);
  });
  
  it('should show discount percentage', () => {
    render(<ProductCard product={mockProduct} />);
    
    const discount = ((100 - 80) / 100) * 100;
    expect(screen.getByText(`${discount}% OFF`)).toBeInTheDocument();
  });
});
```

### 2. Integration Testing

**Framework**: Jest + Supertest

**Scope**: API routes, database interactions

**Example Tests**:

```javascript
// app/api/__tests__/product.test.js
import { GET, POST } from '@/app/api/product/list/route';
import connectDB from '@/config/db';
import Product from '@/models/Product';

// Mock database connection
jest.mock('@/config/db');
jest.mock('@/models/Product');

describe('Product API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET /api/product/list', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        { _id: '1', name: 'Product 1', price: 100 },
        { _id: '2', name: 'Product 2', price: 200 }
      ];
      
      Product.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockProducts)
      });
      
      Product.countDocuments.mockResolvedValue(2);
      
      const request = new Request('http://localhost:3000/api/product/list?page=1&limit=20');
      const response = await GET(request);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.data.products).toHaveLength(2);
      expect(data.meta.pagination.total).toBe(2);
    });
    
    it('should filter by category', async () => {
      Product.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      });
      
      Product.countDocuments.mockResolvedValue(0);
      
      const request = new Request('http://localhost:3000/api/product/list?category=Electronics');
      await GET(request);
      
      expect(Product.find).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'Electronics' })
      );
    });
  });
  
  describe('POST /api/product/add', () => {
    it('should create product with valid data', async () => {
      // Test implementation
    });
    
    it('should reject unauthorized users', async () => {
      // Test implementation
    });
  });
});
```

### 3. End-to-End Testing

**Framework**: Playwright or Cypress

**Scope**: Complete user workflows

**Setup** (Playwright):
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Configuration** (`playwright.config.js`):
```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Example E2E Tests**:

```javascript
// e2e/product-purchase.spec.js
import { test, expect } from '@playwright/test';

test.describe('Product Purchase Flow', () => {
  test('complete purchase journey', async ({ page }) => {
    // 1. Navigate to home page
    await page.goto('/');
    await expect(page).toHaveTitle(/SmartBazar/);
    
    // 2. Search for product
    await page.fill('[data-testid="search-input"]', 'wireless headphones');
    await page.click('[data-testid="search-button"]');
    
    // 3. Click on first product
    await page.click('[data-testid="product-card"]:first-child');
    await expect(page).toHaveURL(/\/product\//);
    
    // 4. Add to cart
    await page.click('[data-testid="add-to-cart"]');
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
    
    // 5. Navigate to cart
    await page.click('[data-testid="cart-icon"]');
    await expect(page).toHaveURL('/cart');
    
    // 6. Proceed to checkout
    await page.click('[data-testid="checkout-button"]');
    
    // 7. Fill shipping address (if not logged in, sign in first)
    if (await page.isVisible('[data-testid="sign-in-button"]')) {
      await page.click('[data-testid="sign-in-button"]');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'testpassword');
      await page.click('button[type="submit"]');
    }
    
    // 8. Select/Add address
    await page.click('[data-testid="add-address"]');
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="phone"]', '+919876543210');
    await page.fill('input[name="addressLine1"]', '123 Main St');
    await page.fill('input[name="city"]', 'Mumbai');
    await page.fill('input[name="state"]', 'Maharashtra');
    await page.fill('input[name="postalCode"]', '400001');
    await page.click('[data-testid="save-address"]');
    
    // 9. Select payment method
    await page.click('[data-testid="payment-cod"]');
    
    // 10. Place order
    await page.click('[data-testid="place-order"]');
    
    // 11. Verify order confirmation
    await expect(page).toHaveURL(/\/order-placed/);
    await expect(page.locator('text=Order Placed Successfully')).toBeVisible();
  });
  
  test('guest checkout flow', async ({ page }) => {
    // Test guest checkout
  });
  
  test('apply coupon code', async ({ page }) => {
    // Test coupon application
  });
});
```

### 4. Load Testing

**Framework**: Apache JMeter or k6

**Setup** (k6):
```bash
# Install k6
brew install k6  # macOS
# or download from https://k6.io/
```

**Load Test Script**:

```javascript
// load-tests/product-list.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '5m', target: 100 },   // Stay at 100 users
    { duration: '2m', target: 200 },   // Ramp up to 200 users
    { duration: '5m', target: 200 },   // Stay at 200 users
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
};

export default function () {
  // Test product listing
  const listRes = http.get('https://smartbazar.com/api/product/list');
  check(listRes, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
  
  // Test product details
  const detailRes = http.get('https://smartbazar.com/api/product/123');
  check(detailRes, {
    'status is 200': (r) => r.status === 200,
  });
  
  sleep(1);
}
```

**Run Load Test**:
```bash
k6 run load-tests/product-list.js
```

### 5. Security Testing

**Tools**: OWASP ZAP, Snyk, npm audit

**Automated Security Scans**:

```bash
# Dependency vulnerability scan
npm audit
npm audit fix

# Snyk scan
npx snyk test
npx snyk monitor

# OWASP Dependency Check
npm install -g owasp-dependency-check
dependency-check --project "SmartBazar" --scan ./
```

**Security Test Cases**:

```javascript
// security-tests/api-security.test.js
import { describe, it, expect } from '@jest/globals';

describe('API Security', () => {
  it('should reject requests without authentication', async () => {
    const response = await fetch('https://smartbazar.com/api/seller/products', {
      method: 'POST',
    });
    expect(response.status).toBe(401);
  });
  
  it('should sanitize SQL injection attempts', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    const response = await fetch(`https://smartbazar.com/api/product/list?search=${maliciousInput}`);
    expect(response.status).not.toBe(500);
  });
  
  it('should prevent XSS attacks', async () => {
    const xssPayload = '<script>alert("XSS")</script>';
    // Test that payload is sanitized
  });
});
```

## Test Coverage

### Coverage Goals

- **Unit Tests**: 80% minimum
- **Integration Tests**: 70% minimum
- **E2E Tests**: Critical user paths (100% coverage)

### Measuring Coverage

```bash
# Run tests with coverage
npm test -- --coverage

# Generate HTML coverage report
npm test -- --coverage --coverageReporters=html

# View coverage report
open coverage/index.html
```

## Continuous Testing

### Pre-Commit Hooks

```bash
# Install husky
npm install --save-dev husky lint-staged

# Setup husky
npx husky init
```

**Configuration** (`.husky/pre-commit`):
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

**Configuration** (`package.json`):
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "jest --bail --findRelatedTests"
    ]
  }
}
```

### CI Pipeline Testing

See `DEPLOYMENT.md` for full CI/CD pipeline with testing stages.

## Testing Best Practices

### 1. Test Naming Convention

```javascript
// Good: Descriptive test names
test('should return 404 when product not found', () => {});

// Bad: Vague test names
test('product test', () => {});
```

### 2. Arrange-Act-Assert Pattern

```javascript
test('should add product to cart', () => {
  // Arrange
  const product = { id: '123', name: 'Test' };
  const cart = new ShoppingCart();
  
  // Act
  cart.addItem(product);
  
  // Assert
  expect(cart.items).toHaveLength(1);
  expect(cart.items[0]).toEqual(product);
});
```

### 3. Mocking External Dependencies

```javascript
// Mock API calls
jest.mock('axios');
axios.get.mockResolvedValue({ data: { products: [] } });

// Mock database
jest.mock('@/config/db');
connectDB.mockResolvedValue(true);
```

### 4. Test Data Management

```javascript
// Use factories for test data
const createMockProduct = (overrides = {}) => ({
  _id: '123',
  name: 'Test Product',
  price: 100,
  ...overrides
});

const product = createMockProduct({ price: 200 });
```

## Test Maintenance

### Regular Activities

- **Weekly**: Review failing tests
- **Monthly**: Update test data
- **Quarterly**: Refactor test suites
- **Annually**: Update testing frameworks

### Flaky Test Management

```javascript
// Retry flaky tests
test.retry(3)('flaky test', async () => {
  // Test implementation
});

// Increase timeout for slow tests
test('slow test', async () => {
  // Test implementation
}, 30000); // 30 second timeout
```

---

*Document Version: 1.0.0*  
*Last Updated: 2025-11-10*  
*Owner: Quality Assurance & Testing Team*

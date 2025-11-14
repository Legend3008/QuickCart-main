/**
 * New Arrivals Page - Integration Tests
 * Testing navigation, rendering, interactions, and error states
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NewArrivalsPage from '../page';
import '@testing-library/jest-dom';

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock fetch
global.fetch = jest.fn();

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('NewArrivalsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render hero section with correct heading', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(<NewArrivalsPage />, { wrapper });

      expect(screen.getByText('New Arrivals')).toBeInTheDocument();
      expect(screen.getByText(/Discover the latest products/i)).toBeInTheDocument();
    });

    it('should display stats cards in hero', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(<NewArrivalsPage />, { wrapper });

      expect(screen.getByText('150+')).toBeInTheDocument();
      expect(screen.getByText('Fresh Products')).toBeInTheDocument();
      expect(screen.getByText('25+')).toBeInTheDocument();
      expect(screen.getByText('Added Today')).toBeInTheDocument();
    });
  });

  describe('Product Loading', () => {
    it('should show loading skeletons while fetching', () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        () => new Promise(() => {}) // Never resolves
      );

      render(<NewArrivalsPage />, { wrapper });

      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should display products after successful fetch', async () => {
      const mockProducts = [
        {
          _id: '1',
          name: 'Test Product 1',
          price: 100,
          offerPrice: 80,
          image: ['https://example.com/image1.jpg'],
          category: 'Electronics',
          stock: 10,
        },
        {
          _id: '2',
          name: 'Test Product 2',
          price: 200,
          offerPrice: 150,
          image: ['https://example.com/image2.jpg'],
          category: 'Fashion',
          stock: 5,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProducts }),
      });

      render(<NewArrivalsPage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText(/2 products/i)).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no products', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(<NewArrivalsPage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText(/No New Arrivals Right Now/i)).toBeInTheDocument();
        expect(screen.getByText(/Check back soon/i)).toBeInTheDocument();
      });
    });

    it('should display "Explore All Products" button in empty state', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(<NewArrivalsPage />, { wrapper });

      await waitFor(() => {
        const button = screen.getByText(/Explore All Products/i);
        expect(button).toBeInTheDocument();
        expect(button.tagName).toBe('BUTTON');
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error state when API fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to fetch')
      );

      render(<NewArrivalsPage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText(/Unable to Load Products/i)).toBeInTheDocument();
        expect(screen.getByText(/Refresh Page/i)).toBeInTheDocument();
      });
    });

    it('should allow retry on error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to fetch')
      );

      const { rerender } = render(<NewArrivalsPage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText(/Unable to Load Products/i)).toBeInTheDocument();
      });

      // Mock successful retry
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      const refreshButton = screen.getByText(/Refresh Page/i);
      fireEvent.click(refreshButton);
    });
  });

  describe('Sorting', () => {
    const mockProducts = [
      {
        _id: '1',
        name: 'Product A',
        price: 100,
        offerPrice: 80,
        image: ['test1.jpg'],
        category: 'Test',
        stock: 10,
      },
      {
        _id: '2',
        name: 'Product B',
        price: 50,
        offerPrice: 40,
        image: ['test2.jpg'],
        category: 'Test',
        stock: 5,
      },
    ];

    it('should render sort dropdown', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProducts }),
      });

      render(<NewArrivalsPage />, { wrapper });

      await waitFor(() => {
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
      });
    });

    it('should change sort order when selecting option', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockProducts }),
      });

      render(<NewArrivalsPage />, { wrapper });

      await waitFor(() => {
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'price-low' } });
        expect(select).toHaveValue('price-low');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(<NewArrivalsPage />, { wrapper });

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('New Arrivals');
    });

    it('should have accessible buttons with labels', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(<NewArrivalsPage />, { wrapper });

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        buttons.forEach((button) => {
          expect(
            button.textContent || button.getAttribute('aria-label')
          ).toBeTruthy();
        });
      });
    });
  });

  describe('Feature Section', () => {
    it('should render feature benefits', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              _id: '1',
              name: 'Test',
              price: 100,
              offerPrice: 80,
              image: ['test.jpg'],
              category: 'Test',
              stock: 1,
            },
          ],
        }),
      });

      render(<NewArrivalsPage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText(/Why Shop New Arrivals/i)).toBeInTheDocument();
        expect(screen.getByText(/Latest Products/i)).toBeInTheDocument();
        expect(screen.getByText(/Quality Assured/i)).toBeInTheDocument();
        expect(screen.getByText(/Trend Setters/i)).toBeInTheDocument();
        expect(screen.getByText(/Fresh Updates/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('should use React Query caching', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });

      const { rerender } = render(<NewArrivalsPage />, { wrapper });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      // Rerender should use cache
      rerender(<NewArrivalsPage />);

      await waitFor(() => {
        // Still only called once due to cache
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });
  });
});

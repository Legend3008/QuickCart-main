import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

interface PlaceOrderPayload {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  orderTotal: number;
}

interface PlaceOrderResponse {
  success: boolean;
  message: string;
  order?: {
    orderId: string;
    orderNumber: string;
    orderTotal: number;
    estimatedDelivery: string;
    status: string;
    items: number;
  };
}

export function usePlaceOrder() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearCart } = useCartStore();
  const [orderData, setOrderData] = useState<PlaceOrderResponse['order'] | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const mutation = useMutation<PlaceOrderResponse, Error, PlaceOrderPayload>({
    mutationFn: async (orderData: PlaceOrderPayload) => {
      console.log('Placing order with data:', orderData);
      
      try {
        const response = await fetch('/api/orders/place', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const data = await response.json().catch(() => ({ message: 'Server error' }));
          console.error('Order placement failed:', data);
          throw new Error(data.message || `Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Order placed successfully:', data);
        return data;
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Clear cart
      clearCart();

      // Invalidate orders cache
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      // Store order data and show modal
      setOrderData(data.order || null);
      setShowSuccessModal(true);

      // Also show a simple toast
      toast.success('🎉 Order Placed Successfully!', {
        duration: 3000,
        style: {
          background: '#10b981',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
        },
      });
    },
    onError: (error) => {
      toast.error(
        `❌ ${error.message || 'Something went wrong. Please try again.'}`,
        {
          duration: 5000,
          style: {
            background: '#ef4444',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
          },
        }
      );
    },
  });

  return {
    ...mutation,
    orderData,
    showSuccessModal,
    setShowSuccessModal,
  };
}

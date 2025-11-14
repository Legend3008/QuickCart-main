import { addressDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { transformProduct } from "@/lib/utils";
import { usePlaceOrder } from "@/hooks/usePlaceOrder";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { OrderSuccessModal } from "@/components/orders/OrderSuccessModal";

const OrderSummary = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { items: cartItems, getItemCount } = useCartStore();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const { mutate: placeOrder, isPending, orderData, showSuccessModal, setShowSuccessModal } = usePlaceOrder();

  const productIds = Object.keys(cartItems);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch product details for items in cart to calculate total
  const { data: products = [] } = useQuery({
    queryKey: ['order-summary-products', productIds],
    queryFn: async () => {
      if (productIds.length === 0) return [];
      
      const response = await fetch('/api/product/list');
      const result = await response.json();
      
      if (!result.success || !result.products) return [];
      
      const cartProducts = result.products
        .filter((p) => productIds.includes(p._id))
        .map(transformProduct);
      
      return cartProducts;
    },
    enabled: productIds.length > 0,
  });

  // Calculate cart amount
  const getCartAmount = () => {
    return products.reduce((total, product) => {
      const quantity = cartItems[product._id] || 0;
      return total + (product.sellingPrice * quantity);
    }, 0);
  };

  const fetchUserAddresses = async () => {
    setUserAddresses(addressDummyData);
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    // Validation
    if (!isSignedIn) {
      toast.error('Please sign in to place an order');
      return;
    }

    if (productIds.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    console.log('Products in cart:', products);
    console.log('Cart items:', cartItems);
    console.log('Selected address:', selectedAddress);

    // Prepare order items
    const orderItems = products.map(product => ({
      productId: product._id,
      name: product.name,
      price: product.sellingPrice,
      quantity: cartItems[product._id]
    }));

    console.log('Order items:', orderItems);

    // Transform address to match API requirements
    const shippingAddress = {
      fullName: selectedAddress.fullName,
      phone: selectedAddress.phoneNumber || selectedAddress.phone,
      addressLine1: selectedAddress.area,
      addressLine2: '',
      area: selectedAddress.area,
      city: selectedAddress.city,
      state: selectedAddress.state,
      pincode: String(selectedAddress.pincode),
      landmark: ''
    };

    // Prepare order payload
    const orderPayload = {
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal: cartAmount,
      shippingFee: cartAmount >= 50 ? 0 : 5.99,
      tax: Math.floor(cartAmount * 0.02),
      discount: 0,
      orderTotal: cartAmount + (cartAmount >= 50 ? 0 : 5.99) + Math.floor(cartAmount * 0.02)
    };

    console.log('Order payload:', orderPayload);

    // Place order
    placeOrder(orderPayload);
  }

  const cartCount = mounted ? getItemCount() : 0;
  const cartAmount = mounted ? getCartAmount() : 0;
  const currency = "₹";

  useEffect(() => {
    fetchUserAddresses();
  }, [])

  return (
    <>
      <OrderSuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderData={orderData || undefined}
      />
      
      <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {cartCount}</p>
            <p className="text-gray-800">{currency}{cartAmount}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">{currency}{Math.floor(cartAmount * 0.02)}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{cartAmount + Math.floor(cartAmount * 0.02)}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={createOrder} 
        disabled={isPending || productIds.length === 0}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Placing Order...</span>
          </>
        ) : (
          'Place Order'
        )}
      </button>
    </div>
    </>
  );
};

export default OrderSummary;
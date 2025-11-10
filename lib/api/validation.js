/**
 * Input validation utilities using schema validation
 * Provides reusable validation schemas for API endpoints
 */

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone) {
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate URL format
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate MongoDB ObjectId
 */
export function isValidObjectId(id) {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}

/**
 * Sanitize string input (remove special characters)
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
}

/**
 * Validate and sanitize product data
 */
export function validateProductData(data) {
  const errors = {};
  
  // Name validation
  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters';
  }
  if (data.name && data.name.length > 200) {
    errors.name = 'Name cannot exceed 200 characters';
  }
  
  // Description validation
  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }
  if (data.description && data.description.length > 5000) {
    errors.description = 'Description cannot exceed 5000 characters';
  }
  
  // Price validation
  if (!data.price || isNaN(data.price) || data.price <= 0) {
    errors.price = 'Price must be a positive number';
  }
  if (data.price > 1000000) {
    errors.price = 'Price cannot exceed 1,000,000';
  }
  
  // Offer price validation
  if (data.offerPrice) {
    if (isNaN(data.offerPrice) || data.offerPrice <= 0) {
      errors.offerPrice = 'Offer price must be a positive number';
    }
    if (data.offerPrice > data.price) {
      errors.offerPrice = 'Offer price cannot exceed original price';
    }
  }
  
  // Category validation
  const validCategories = [
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Books',
    'Sports',
    'Beauty',
    'Toys',
    'Automotive',
    'Grocery',
    'Health'
  ];
  if (!data.category || !validCategories.includes(data.category)) {
    errors.category = 'Invalid category';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate user registration data
 */
export function validateUserData(data) {
  const errors = {};
  
  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  // Email validation
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Invalid email address';
  }
  
  // Phone validation (optional)
  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = 'Invalid phone number';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate address data
 */
export function validateAddressData(data) {
  const errors = {};
  
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (!data.phone || !isValidPhone(data.phone)) {
    errors.phone = 'Invalid phone number';
  }
  
  if (!data.addressLine1 || data.addressLine1.trim().length < 5) {
    errors.addressLine1 = 'Address must be at least 5 characters';
  }
  
  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'City is required';
  }
  
  if (!data.state || data.state.trim().length < 2) {
    errors.state = 'State is required';
  }
  
  if (!data.postalCode || !/^\d{6}$/.test(data.postalCode)) {
    errors.postalCode = 'Invalid postal code (6 digits required)';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate order data
 */
export function validateOrderData(data) {
  const errors = {};
  
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.items = 'Order must contain at least one item';
  }
  
  if (data.items) {
    data.items.forEach((item, index) => {
      if (!item.productId) {
        errors[`items[${index}].productId`] = 'Product ID is required';
      }
      if (!item.quantity || item.quantity < 1) {
        errors[`items[${index}].quantity`] = 'Quantity must be at least 1';
      }
    });
  }
  
  if (!data.shippingAddressId) {
    errors.shippingAddressId = 'Shipping address is required';
  }
  
  if (!data.paymentMethod) {
    errors.paymentMethod = 'Payment method is required';
  }
  
  const validPaymentMethods = ['card', 'upi', 'netbanking', 'wallet', 'cod'];
  if (data.paymentMethod && !validPaymentMethods.includes(data.paymentMethod)) {
    errors.paymentMethod = 'Invalid payment method';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate review data
 */
export function validateReviewData(data) {
  const errors = {};
  
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.rating = 'Rating must be between 1 and 5';
  }
  
  if (!data.comment || data.comment.trim().length < 10) {
    errors.comment = 'Comment must be at least 10 characters';
  }
  
  if (data.comment && data.comment.length > 2000) {
    errors.comment = 'Comment cannot exceed 2000 characters';
  }
  
  if (data.title && data.title.length > 200) {
    errors.title = 'Title cannot exceed 200 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate pagination parameters
 */
export function validatePaginationParams(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  
  return { page, limit };
}

/**
 * Validate sort parameters
 */
export function validateSortParams(query, allowedFields = []) {
  let sort = query.sort || '-createdAt';
  
  // Extract field and order
  const order = sort.startsWith('-') ? -1 : 1;
  const field = sort.replace(/^-/, '');
  
  // Validate field
  if (allowedFields.length > 0 && !allowedFields.includes(field)) {
    sort = '-createdAt';  // Default to created date descending
  }
  
  return { [field]: order };
}

/**
 * Validate search query
 */
export function validateSearchQuery(query) {
  if (!query || typeof query !== 'string') {
    return '';
  }
  
  // Sanitize and limit length
  return query.trim().slice(0, 100);
}

/**
 * Validate price range
 */
export function validatePriceRange(minPrice, maxPrice) {
  const min = Math.max(0, parseFloat(minPrice) || 0);
  const max = parseFloat(maxPrice) || Number.MAX_SAFE_INTEGER;
  
  return {
    minPrice: min,
    maxPrice: Math.max(min, max)
  };
}

/**
 * Batch validation helper
 */
export function validateBatch(validators) {
  const allErrors = {};
  let isValid = true;
  
  validators.forEach(({ name, validator, data }) => {
    const result = validator(data);
    if (!result.isValid) {
      isValid = false;
      allErrors[name] = result.errors;
    }
  });
  
  return {
    isValid,
    errors: allErrors
  };
}

import { NextResponse } from 'next/server';

/**
 * Standard API response format utilities
 * Ensures consistent response structure across all endpoints
 */

/**
 * Success response
 * @param {*} data - Response data
 * @param {number} status - HTTP status code (default: 200)
 * @param {object} meta - Additional metadata
 */
export function successResponse(data, status = 200, meta = {}) {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        ...meta
      }
    },
    { status }
  );
}

/**
 * Error response
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {number} status - HTTP status code
 * @param {object} details - Additional error details
 */
export function errorResponse(message, code = 'INTERNAL_ERROR', status = 500, details = {}) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
        timestamp: new Date().toISOString()
      }
    },
    { status }
  );
}

/**
 * Validation error response
 * @param {string} message - Error message
 * @param {object} errors - Validation errors
 */
export function validationError(message = 'Validation failed', errors = {}) {
  return errorResponse(
    message,
    'VALIDATION_ERROR',
    400,
    { errors }
  );
}

/**
 * Unauthorized error response
 */
export function unauthorizedError(message = 'Unauthorized access') {
  return errorResponse(
    message,
    'UNAUTHORIZED',
    401
  );
}

/**
 * Forbidden error response
 */
export function forbiddenError(message = 'Insufficient permissions') {
  return errorResponse(
    message,
    'FORBIDDEN',
    403
  );
}

/**
 * Not found error response
 */
export function notFoundError(message = 'Resource not found') {
  return errorResponse(
    message,
    'NOT_FOUND',
    404
  );
}

/**
 * Conflict error response
 */
export function conflictError(message = 'Resource conflict') {
  return errorResponse(
    message,
    'CONFLICT',
    409
  );
}

/**
 * Rate limit error response
 */
export function rateLimitError(message = 'Too many requests', retryAfter = 60) {
  const response = errorResponse(
    message,
    'RATE_LIMIT_EXCEEDED',
    429,
    { retryAfter }
  );
  
  response.headers.set('Retry-After', retryAfter.toString());
  return response;
}

/**
 * Paginated response
 * @param {Array} data - Array of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 */
export function paginatedResponse(data, page = 1, limit = 20, total = 0) {
  const pages = Math.ceil(total / limit);
  
  return successResponse(data, 200, {
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1
    }
  });
}

/**
 * Wrapper for async route handlers with error catching
 * @param {Function} handler - Async route handler function
 */
export function asyncHandler(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);
      
      // Handle specific error types
      if (error.name === 'ValidationError') {
        return validationError(error.message, error.errors);
      }
      
      if (error.name === 'UnauthorizedError') {
        return unauthorizedError(error.message);
      }
      
      if (error.name === 'ForbiddenError') {
        return forbiddenError(error.message);
      }
      
      if (error.name === 'NotFoundError') {
        return notFoundError(error.message);
      }
      
      if (error.name === 'ConflictError') {
        return conflictError(error.message);
      }
      
      if (error.name === 'RateLimitError') {
        return rateLimitError(error.message);
      }
      
      // Generic internal error
      return errorResponse(
        process.env.NODE_ENV === 'production' 
          ? 'An unexpected error occurred' 
          : error.message,
        'INTERNAL_ERROR',
        500,
        process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}
      );
    }
  };
}

/**
 * Custom error classes
 */
export class ValidationError extends Error {
  constructor(message, errors = {}) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized access') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Insufficient permissions') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  constructor(message = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends Error {
  constructor(message = 'Too many requests', retryAfter = 60) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

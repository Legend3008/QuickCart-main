import mongoose from "mongoose";

// Global cached connection
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB with optimized settings for production
 * Implements connection pooling, retry logic, and error handling
 */
async function connectDB() {
    // Return existing connection if available
    if (cached.conn) {
        return cached.conn;
    }

    // Return existing connection promise if in progress
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            
            // Connection Pool Settings
            maxPoolSize: 100,              // Maximum connections in pool
            minPoolSize: 10,               // Minimum connections in pool
            
            // Timeout Settings
            serverSelectionTimeoutMS: 5000,  // Timeout for server selection
            socketTimeoutMS: 45000,          // Socket timeout
            connectTimeoutMS: 10000,         // Initial connection timeout
            
            // Retry Settings
            retryWrites: true,
            retryReads: true,
            
            // Use IPv4
            family: 4
        };

        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }

        // Create connection promise with error handling
        cached.promise = mongoose
            .connect(`${mongoUri}/quickcart`, opts)
            .then((mongoose) => {
                console.log('✅ MongoDB connected successfully');
                
                // Set up connection event handlers
                mongoose.connection.on('error', (err) => {
                    console.error('❌ MongoDB connection error:', err);
                });
                
                mongoose.connection.on('disconnected', () => {
                    console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
                });
                
                mongoose.connection.on('reconnected', () => {
                    console.log('✅ MongoDB reconnected successfully');
                });
                
                return mongoose;
            })
            .catch((error) => {
                console.error('❌ MongoDB connection failed:', error);
                cached.promise = null;  // Reset promise on failure
                throw error;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

// Graceful shutdown handler
process.on('SIGINT', async () => {
    if (cached.conn) {
        await cached.conn.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    }
});

export default connectDB;
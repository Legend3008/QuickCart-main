'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { assets } from '@/assets/assets';
import { Upload, Package, DollarSign, Tag, FileText, Sparkles } from 'lucide-react';

export function AddProductForm() {
  const { getToken } = useAppContext();

  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Earphone');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (index: number, file: File | null) => {
    const updatedFiles = [...files];
    updatedFiles[index] = file;
    setFiles(updatedFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validation
    if (!name.trim() || !description.trim() || !price || !offerPrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (files.every((file) => !file)) {
      toast.error('Please upload at least one product image');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('offerPrice', offerPrice);

    files.forEach((file) => {
      if (file) {
        formData.append('images', file);
      }
    });

    try {
      const token = await getToken();
      const { data } = await axios.post('/api/product/add', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success('🎉 Product added successfully!', {
          style: {
            background: '#10B981',
            color: '#fff',
          },
          duration: 3000,
        });

        // Reset form
        setName('');
        setDescription('');
        setCategory('Earphone');
        setPrice('');
        setOfferPrice('');
        setFiles([null, null, null, null]);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Product
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Fill in the details to list your product
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Product Images */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-4">
              <Upload className="w-4 h-4" />
              Product Images
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {files.map((file, index) => (
                <motion.label
                  key={index}
                  htmlFor={`image${index}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative cursor-pointer"
                >
                  <input
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      handleFileChange(index, file || null);
                    }}
                    type="file"
                    id={`image${index}`}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 group-hover:border-orange-500 dark:group-hover:border-orange-400 transition-colors bg-gray-50 dark:bg-gray-800/50">
                    {file ? (
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-colors" />
                </motion.label>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Upload up to 4 images. First image will be the primary display.
            </p>
          </div>

          {/* Product Name */}
          <div>
            <label
              htmlFor="product-name"
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3"
            >
              <Package className="w-4 h-4" />
              Product Name
            </label>
            <input
              id="product-name"
              type="text"
              placeholder="e.g., Wireless Noise Cancelling Headphones"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>

          {/* Product Description */}
          <div>
            <label
              htmlFor="product-description"
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3"
            >
              <FileText className="w-4 h-4" />
              Product Description
            </label>
            <textarea
              id="product-description"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Describe your product features, specifications, and benefits..."
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            />
          </div>

          {/* Category and Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3"
              >
                <Tag className="w-4 h-4" />
                Category
              </label>
              <select
                id="category"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="Earphone">Earphone</option>
                <option value="Headphone">Headphone</option>
                <option value="Watch">Watch</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Laptop">Laptop</option>
                <option value="Camera">Camera</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            {/* Original Price */}
            <div>
              <label
                htmlFor="product-price"
                className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3"
              >
                <DollarSign className="w-4 h-4" />
                Original Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  id="product-price"
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Offer Price */}
            <div>
              <label
                htmlFor="offer-price"
                className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3"
              >
                <Tag className="w-4 h-4" />
                Sale Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  id="offer-price"
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  onChange={(e) => setOfferPrice(e.target.value)}
                  value={offerPrice}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => {
                setName('');
                setDescription('');
                setCategory('Earphone');
                setPrice('');
                setOfferPrice('');
                setFiles([null, null, null, null]);
              }}
            >
              Reset Form
            </motion.button>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="relative px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden group"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              <span className="relative flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Adding Product...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Add Product</span>
                  </>
                )}
              </span>
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueue } from '@/contexts/QueueContext';

export default function QueueForm() {
  const { startQueueing, bulkStartQueueing, isLoading } = useQueue();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [bulkCount, setBulkCount] = useState(10);
  const [isBulkCreating, setIsBulkCreating] = useState(false);
  
  const onSubmit = async (data) => {
    try {
      await startQueueing(data.productCode);
      reset();
    } catch (error) {
      console.error('Error starting queue:', error);
    }
  };

  const handleBulkGeneration = async () => {
    if (!bulkCount || bulkCount < 1) return;
    
    setIsBulkCreating(true);
    try {
      const productCode = document.getElementById('productCode').value;
      if (!productCode) {
        alert('Please enter a product code first');
        setIsBulkCreating(false);
        return;
      }
      
      await bulkStartQueueing(productCode, bulkCount);
      // Don't reset the form here so users can generate more with the same code
    } catch (error) {
      console.error('Error generating bulk users:', error);
    } finally {
      setIsBulkCreating(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg sm:text-xl text-black font-bold mb-4">Generate Users</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="productCode" className="block text-sm font-medium text-gray-700 mb-1">
            Product Code
          </label>
          <input
            type="text"
            id="productCode"
            placeholder="Enter product code (e.g. PREMIUM)"
            className={` text-black w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.productCode ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading || isBulkCreating}
            {...register('productCode', { required: 'Product code is required' })}
          />
          {errors.productCode && (
            <p className="mt-1 text-sm text-red-600">{errors.productCode.message}</p>
          )}
        </div>

        <div className="flex flex-col space-y-4">
          <button
            type="submit"
            disabled={isLoading || isBulkCreating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
          >
            {isLoading ? 'Generating...' : 'Generate Single User'}
          </button>
          
          <div className="border-t border-gray-200 pt-3 mt-2">
            <h3 className="font-bold text-gray-700 text-sm sm:text-base mb-3">Bulk Generation</h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center">
                <label htmlFor="bulkCount" className="text-xs sm:text-sm font-medium text-gray-600 mr-2">
                  Count:
                </label>
                <input
                  type="number"
                  id="bulkCount"
                  min="1"
                  max="100"
                  value={bulkCount}
                  onChange={(e) => {
                    if(e.target.value < 1 || e.target.value > 1000) {
                      e.target.value = 1;
                    }
                    setBulkCount(parseInt(e.target.value) || 1)
                  }}
                  className="text-black w-14 sm:w-16 px-2 py-1 border border-gray-300 rounded-md text-center text-sm"
                  disabled={isBulkCreating}
                />
              </div>
              
              <button
                type="button"
                onClick={handleBulkGeneration}
                disabled={isBulkCreating || isLoading}
                className="grow bg-purple-600 hover:bg-purple-700 text-white font-medium py-1.5 px-2 sm:px-3 rounded-md shadow-sm text-xs sm:text-sm transition-colors"
              >
                {isBulkCreating ? `Generating ${bulkCount}...` : `Generate ${bulkCount} Users`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
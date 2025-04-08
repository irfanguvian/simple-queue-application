'use client';

import QueueForm from "@/components/QueueForm";
import QueueList from "@/components/QueueList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Queue Management System</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Add users to queue and monitor their status</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
          {/* Form Section - Full width on mobile, 4 cols on large screens */}
          <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
            <QueueForm />
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-black mb-3 sm:mb-4">How It Works</h2>
              <ol className="list-decimal list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700">
                <li>Enter a product code and generate one or multiple users</li>
                <li>Check each user&apos;s status periodically</li>
                <li>When status becomes &quot;available&quot;, join the room</li>
                <li>Monitor all users even after they&apos;ve joined</li>
              </ol>
            </div>
          </div>
          
          {/* List Section - Full width on mobile, 8 cols on large screens */}
          <div className="lg:col-span-8 mt-4 sm:mt-6 lg:mt-0">
            <QueueList />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-12">
        <div className="container mx-auto p-4 sm:p-6 text-center text-gray-500 text-xs sm:text-sm">
          Queue Management System - Made by @irfanguvian
        </div>
      </footer>
    </div>
  );
}

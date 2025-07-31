import React from 'react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-lime-50 p-6 sm:p-8 md:p-12">
      <div className="text-center space-y-8 animate-fade-in max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-green-800 tracking-tight drop-shadow-md">
          Student Management System
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed">
          Streamline student records, course management, and reporting with our intuitive platform.
        </p>
        <div className="mt-10">
          <p className="text-sm sm:text-base text-gray-500 italic">
            Explore our system to efficiently manage your educational institution.
          </p>
        </div>
      </div>
    </main>
  );
}
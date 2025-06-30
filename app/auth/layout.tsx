import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0e7ff] via-[#f1f5f9] to-[#f0fdfa] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md mx-auto p-6 flex flex-col items-center">
        <img
          src="/globe.svg"
          alt="Logo InnoTech Solutions"
          className="w-16 h-16 mb-4 drop-shadow-lg"
        />
        <h1 className="text-2xl font-bold mb-2 text-center text-primary">InnoTech Solutions</h1>
        <div className="w-full mt-2">{children}</div>
      </div>
    </div>
  );
} 
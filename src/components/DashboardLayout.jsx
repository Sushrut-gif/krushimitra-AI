import React from 'react';
import Navbar from './Navbar';

export default function DashboardLayout({ role, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-150 sm:bg-slate-200 text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar role={role} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-8">
        {children}
      </main>
      <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-500 pb-safe sm:pb-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>KrushiMitra AI © 2026 • कृषिमित्र डिजिटल प्लॅटफॉर्म</span>
          <span className="text-gray-400">सुरक्षित • पारदर्शक • महाराष्ट्र राज्य APMC सुसंगत</span>
        </div>
      </footer>
    </div>
  );
}

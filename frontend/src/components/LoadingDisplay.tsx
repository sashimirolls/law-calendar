import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingDisplay() {
  return (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-2">
      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      <p className="text-blue-700">Loading available time slots...</p>
    </div>
  );
}
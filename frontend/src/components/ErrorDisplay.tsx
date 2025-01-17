import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="mb-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
      <AlertCircle className="w-5 h-5 text-red-600" />
      <p className="text-red-700">{error}</p>
    </div>
  );
}
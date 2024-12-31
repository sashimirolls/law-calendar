import React from 'react';
import { Users } from 'lucide-react';

export function InitialState() {
  return (
    <div className="text-center p-8">
      <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-2">Welcome to the Scheduling Tool</h2>
      <p className="text-gray-600">
        Please select salespeople from the form to view available time slots.
      </p>
    </div>
  );
}
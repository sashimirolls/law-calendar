import React, {useEffect}from 'react';
import { Users, AlertCircle } from 'lucide-react';
import { Salesperson } from '../types/acuity';
import { Logger } from '../utils/logger';

interface SalesPeopleSelectorProps {
  salespeople: Salesperson[];
  selectedPeople: Salesperson[];
  readOnly?: boolean;
  onSelect?: (person: Salesperson) => void;
}

export function SalespeopleSelector({
  salespeople,
  selectedPeople,
  readOnly = false,
  onSelect,
}: SalesPeopleSelectorProps) {
  Logger.debug('SalespeopleSelector', 'Rendering with:', { 
    selectedCount: selectedPeople.length,
    readOnly 
  });
  
  useEffect(() => {
    console.log('Selected people changed:', selectedPeople);
    // Update calendar logic based on selectedPeople
  }, [selectedPeople]);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Selected Salespeople</h2>
      </div>

      {selectedPeople.length > 2 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-700">
            Please select only 2 salespeople
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {salespeople.map((person) => (
          <div
            key={person.calendarID}
            className={`p-3 border rounded-md ${
              selectedPeople.includes(person)
                ? 'bg-blue-100 border-blue-500'
                : ''
            }`}
          >
            {person.name}
          </div>
        ))}
      </div>
    </div>
  );
}

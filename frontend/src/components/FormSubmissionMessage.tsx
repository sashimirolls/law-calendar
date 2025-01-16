import React from 'react';

const FormSubmissionMessage: React.FC = () => {
  return (
    <div className="flex items-center text-sm text-gray-600 bg-blue-50 p-4 border border-blue-200 rounded-md shadow-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-blue-500 mr-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8-6a6 6 0 100 12 6 6 0 000-12zm-.75 9.75a.75.75 0 011.5 0v.5a.75.75 0 01-1.5 0v-.5zm0-7a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0v-4z"
          clipRule="evenodd"
        />
      </svg>
      <p>
        <strong>Note:</strong> This form will be automatically submitted after the appointment is booked.
      </p>
    </div>
  );
};

export default FormSubmissionMessage;

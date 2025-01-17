import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface MessageModalProps {
  onClose: () => void;
  message: string;
  isSuccess: boolean;
}

const MessageModal: React.FC<MessageModalProps> = ({ onClose, message, isSuccess }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white pt-3 pb-6 rounded-xl shadow-2xl text-center w-96 relative">
        {/* Heading */}
        <div className="text-left w-full">
          <h2 className="text-xl font-semibold text-gray-800 px-6">Appointment Status</h2>
          <hr className="mt-1 border-t-2 border-gray-300 w-full" />
        </div>

        <div className="flex flex-col items-center justify-center mt-8 mb-4">
          {isSuccess ? (
            <FaCheckCircle className="text-green-500 text-4xl mb-2" />
          ) : (
            <FaTimesCircle className="text-red-500 text-4xl mb-2" />
          )}
          <p className="text-md font-medium text-gray-800">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-2 px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default MessageModal;

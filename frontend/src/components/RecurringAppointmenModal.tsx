import React, { useState } from "react";

interface RecurringAppointmentModalProps {
  selectedDate: Date;
  selectedTime: string | null;
  onClose: () => void;
  onAddAppointment: () => void;
}

const RecurringAppointmentModal: React.FC<RecurringAppointmentModalProps> = ({
  selectedDate,
  selectedTime,
  onClose,
  onAddAppointment,
}) => {
  const [frequency, setFrequency] = useState("everyWeek");
  const [recurringTimes, setRecurringTimes] = useState("1");
  const [step, setStep] = useState(1);

  const dateObj = new Date(selectedDate);
  const dayOfWeek = dateObj.toLocaleString("en-US", { weekday: "long" });
  const month = dateObj.toLocaleString("en-US", { month: "long" });
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  const getOrdinalSuffix = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const generateRecurringDates = () => {
    const dates = [];
    let currentDate = new Date(selectedDate);
    const times = parseInt(recurringTimes);

    for (let i = 0; i < times; i++) {
      dates.push(
        `${currentDate.toLocaleString("en-US", { weekday: "long" })}, ${currentDate.toLocaleString("en-US", { month: "long" })} ${currentDate.getDate()}${getOrdinalSuffix(currentDate.getDate())}, ${currentDate.getFullYear()}`
      );

      switch (frequency) {
        case "everyWeek":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "everyTwoWeeks":
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case "everyMonth":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case "everyTwoMonths":
          currentDate.setMonth(currentDate.getMonth() + 2);
          break;
        case "everyThreeMonths":
          currentDate.setMonth(currentDate.getMonth() + 3);
          break;
        case "daily":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
      }
    }
    return dates;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 w-96 rounded-lg relative shadow-lg">
        {step === 1 && (
          <>
            <button onClick={onClose} className="absolute top-2 left-2 text-black text-lg font-semibold">
              Close
            </button>
            <button
              onClick={() => setStep(2)}
              className="absolute top-2 right-2 text-black font-semibold text-lg"
            >
              See Availability
            </button>
            <h2 className="text-center font-semibold text-xl mb-4 text-blue-600">Recurring Appointment</h2>
            <p className="text-center text-lg text-gray-700 mb-6">
              {`${dayOfWeek}, ${month} ${day}${getOrdinalSuffix(day)}, ${year}`} at {selectedTime}
            </p>
            <div className="mb-6">
              <label className="block mb-2 text-lg">Repeat</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="everyWeek">Every {dayOfWeek}</option>
                <option value="everyTwoWeeks">Every other {dayOfWeek}</option>
                <option value="everyMonth">Every {dayOfWeek} this month</option>
                <option value="everyTwoMonths">Every {dayOfWeek} every two months</option>
                <option value="everyThreeMonths">Every {dayOfWeek} every three months</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-lg">Times to Repeat</label>
              <select
                value={recurringTimes}
                onChange={(e) => setRecurringTimes(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[...Array(24)].map((_, index) => (
                  <option key={index} value={index + 1}>{index + 1}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <button onClick={() => setStep(1)} className="absolute top-2 left-2 text-black text-lg font-semibold">
              Back
            </button>
            <button
              onClick={onAddAppointment}
              className="absolute top-2 right-2 text-black font-semibold text-lg"
            >
              Add Appointment
            </button>
            <h2 className="text-center font-semibold text-xl mb-4 text-blue-600">Scheduled Dates</h2>
            <ul className="list-disc pl-5 text-lg text-gray-700 space-y-2">
              {generateRecurringDates().map((date, index) => (
                <li key={index}>{date} at {selectedTime}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default RecurringAppointmentModal;

import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { API_CONFIG } from '../services/config'
import axios from "axios";
import MessageModal from "./MessageModal";
import { useSearchParams } from 'react-router-dom';
import { Salesperson } from '../types/acuity';
import { salespeople } from '../config/salespeople';
import { Calendar as LucideCalendar } from 'lucide-react';
import RecurringAppointmentModal from './RecurringAppointmenModal';
import eventBus from "../eventBus";

interface TimeSlot {
  datetime: string;
}

interface CalendarProps {
  availableSlots: TimeSlot[];
}


export function Calendar({ availableSlots }: CalendarProps) {
  const [activeTab, setActiveTab] = useState("chooseAppointment");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [addedTimes, setAddedTimes] = useState<string[]>([]);
  const [showRecurringModal, setShowRecurringModal] = useState(false); // Not in use


  const today = new Date();

  // Not in use currently
  const handleRecurringClick = () => {
    setShowRecurringModal(true);
  };

  const handleCloseRecurringModal = () => {
    setShowRecurringModal(false);
  };

  // const handleSaveRecurring = (frequency, recurringTimes) => {
  //   console.log("Recurring Frequency: ", frequency);
  //   console.log("Recurring Times: ", recurringTimes);
  //   setShowRecurringModal(false);
  // };
  // const groupSlotsByDate = (slots: TimeSlot[]) => {
  //   console.log("Slots: ", slots);
  //   return slots.reduce((acc: Record<string, TimeSlot[]>, slot) => {
  //     const date = new Date(slot.datetime);
  //     const localDate = `${date.getFullYear()}-${(date.getMonth() + 1)
  //       .toString()
  //       .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  //     if (!acc[localDate]) acc[localDate] = [];
  //     acc[localDate].push(slot);
  //     return acc;
  //   }, {});
  // };


  const groupSlotsByDate = (slots: TimeSlot[]) => {

    return slots.reduce((acc: Record<string, TimeSlot[]>, slot) => {
      const date = new Date(slot.datetime);
      const localDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

      // Only consider available slots
      // if (slot.isAvailable){
      if (!acc[localDate]) {
        acc[localDate] = [];
      }

      // Check for duplicate slots (same datetime on the same date)
      const existingSlotIndex = acc[localDate].findIndex(
        (existingSlot) => existingSlot.datetime === slot.datetime
      );

      // If the slot is not already present, add it to the accumulator
      if (existingSlotIndex === -1) {
        acc[localDate].push(slot);
      } else if (acc[localDate].length === 2) {
        // If two identical slots exist, filter out the duplicate
        acc[localDate] = acc[localDate].filter(
          (existingSlot) => existingSlot.datetime !== slot.datetime
        );
      }
      // }

      return acc;
    }, {});
  };

  const groupedSlots = groupSlotsByDate(availableSlots);
  const handleDateClick = (date: Date) => {
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    if (groupedSlots[formattedDate]) {
      setSelectedDate(date);
      setSelectedTime(null); // Reset selected time when changing the date
    }
  };

  const handleAddAnotherTime = () => {
    if (selectedTime) {
      if (!addedTimes.includes(selectedTime)) {
        setAddedTimes((prevTimes) => [...prevTimes, selectedTime]);
      }
      setSelectedTime(null);
    }
  };

  const handleRemoveTime = (time: string) => {
    setAddedTimes((prevTimes) => prevTimes.filter(t => t !== time));
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex(currentMonthIndex + 1);
  };

  const handlePreviousMonth = () => {
    setCurrentMonthIndex(currentMonthIndex - 1);
  };

  const renderCalendar = () => {
    const month = new Date(today.getFullYear(), today.getMonth() + currentMonthIndex, 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + currentMonthIndex + 1, 0);

    const daysInMonth = [];
    const firstDayIndex = (month.getDay() + 6) % 7; // Adjust to start the week on Monday

    for (let i = 0; i < firstDayIndex; i++) {
      daysInMonth.push(null);
    }

    for (let day = 1; day <= endOfMonth.getDate(); day++) {
      daysInMonth.push(new Date(today.getFullYear(), today.getMonth() + currentMonthIndex, day));
    }

    const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

    return (
      <div>
        <div className="flex justify-between mb-4">
          <button onClick={handlePreviousMonth} className="px-3 py-1 bg-blue-500 text-white rounded">&#8592;</button>
          <h3 className="text-xl font-bold">{month.toLocaleString("default", { month: "long", year: "numeric" })}</h3>
          <button onClick={handleNextMonth} className="px-3 py-1 bg-blue-500 text-white rounded">&#8594;</button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2 text-center">
          {dayLabels.map((label, index) => (
            <div key={index} className="font-semibold w-12 h-12 flex items-center justify-center">{label}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((date, index) => {
            if (!date) return <div key={index} className="w-12 h-12"></div>;
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
            const isAvailable = groupedSlots[formattedDate];
            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={!isAvailable}
                className={`w-12 h-12 flex items-center justify-center rounded-full border-2 text-sm ${isAvailable ? "border-blue-500 text-black font-bold hover:bg-blue-50" : "border-gray-400 text-gray-400 cursor-not-allowed opacity-85"} ${selectedDate?.toDateString() === date.toDateString() ? "bg-blue-200" : ""}`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleTabSwitch = (tab: string) => {
    if (tab === "yourInfo" && (selectedTime || addedTimes.length > 0)) {
      setActiveTab(tab);
    }

    if (tab == "chooseAppointment" && activeTab == "confirmation") {
      // setSelectedDate(new Date());  // Or set it to the previously selected date
      setSelectedTime("");
      setActiveTab(tab);
    }
  };

  const handleAndBook = () => {
    handleAddAnotherTime();
    setActiveTab("yourInfo");
  }

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setModalMessage] = useState("");
  const [isSuccessBooking, setSuccessBooking] = useState(false);

  const handleCloseMessageModal = () => {
    setShowMessageModal(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !phone) {
      return;
    }

    // Get the salesperson names from URL params
    const searchParams = new URLSearchParams(window.location.search);
    const salespersonParam = searchParams.get('salespeople');

    if (!salespersonParam) {
      console.error("No salesperson found in the URL parameters");
      return;
    }

    // Split the salesperson parameter into an array in case multiple names are passed
    const salespersonNames = salespersonParam.split(',').map(name => name.trim());

    // Initialize an array to hold the matched calendarIDs
    const matchedCalendarIDs: string[] = [];

    // Loop through each name and check if it matches a salesperson in the array
    salespersonNames.forEach(name => {
      const matchedSalesperson = salespeople.find(salesperson => salesperson.name === name);
      if (matchedSalesperson) {
        matchedCalendarIDs.push(matchedSalesperson.calendarID);
      } else {
        console.log(`No match found for ${name}`);
      }
    });

    // Check if we have any matched calendarIDs
    if (matchedCalendarIDs.length === 0) {
      console.error("No valid salespeople found");
      return;
    }

    const timesToSubmit = selectedTime ? [selectedTime, ...addedTimes] : addedTimes;

    const sanitizedBaseUrl = API_CONFIG.BASE_URL.replace(/\/api$/, '');

    // Generate a random 10-character ID
    // const generateRandomId = () => Math.random().toString(36).substring(2, 12).toUpperCase();
    // const appointmentId = generateRandomId();  // e.g., 'A1B2C3D4E5'

    const generateAppointmentId = (length: number): number => Math.floor(Math.random() * Math.pow(10, length));
    const appointmentId = generateAppointmentId(10);

    const formDetails = timesToSubmit.map(time => ({
      appointmentId: appointmentId,
      appointmentTypeID: "71960849",
      datetime: time,
      calendarID: matchedCalendarIDs,
      clientInfo: { firstName, lastName, email, phone, notes },
    }));

    try {
      const responses = await Promise.all(formDetails.map(detail =>
        fetch(`${sanitizedBaseUrl}/appointment/book-appointment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(detail),
        })
      ));

      // Check if all responses are successful
      const allSuccess = responses.every(response => response.status === 200);
      if (allSuccess) {
        // Log the response

        setModalMessage("Form submitted successfully!");
        setShowMessageModal(true);
        setSuccessBooking(true);

        const responseData = await Promise.all(responses.map(response => response.json()));
        console.log("all success: ", responseData);

        eventBus.emit('formSubmitted', responseData);

        // Remove the selected times from the available slots
        // availableSlots = availableSlots.filter(slot => !timesToSubmit.includes(slot.datetime));

        // Clear the form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setNotes("");
        setAddedTimes([]);
        setSelectedTime("");

        // Redirect to the confirmation tab
        setActiveTab("confirmation");

      } else {
        // Handle errors
        setModalMessage("Failed to book an appointment. Please try again.");
        setShowMessageModal(true);
        setSuccessBooking(false);
      }
    } catch (error) {
      setModalMessage("Failed to book an appointment.");
      setShowMessageModal(true);
      setShowMessageModal(true);
      setSuccessBooking(false);
    }
  };


  const renderTimesAdded = () => (
    <div className="mt-4">
      {addedTimes.length > 0 && (
        <>
          <h4 className="font-semibold text-lg">Times Added:</h4>
          {addedTimes.map((time, index) => (
            <div key={index} className="flex justify-between items-center mt-2 p-2 border rounded-md">
              <span>{new Date(time).toLocaleString()}</span>
              <button onClick={() => handleRemoveTime(time)} className="text-red-500">Remove</button>
            </div>
          ))}
          <button
            onClick={() => handleTabSwitch("yourInfo")}
            className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md"
          >
            Continue
          </button>
        </>
      )}
    </div>
  );



  return (
    <div className="p-8 bg-white rounded-lg shadow-md mb-6 mt-6">
      <div className="flex items-center gap-2 mb-6">
        <LucideCalendar className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Schedule Appointment</h2>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-6 relative">
          <button
            className={`w-1/3 py-2 text-center ${activeTab === "chooseAppointment" ? "text-blue-500 border-b-4 border-blue-500" : "text-black"}`}
            disabled
          >
            Choose Appointment
          </button>
          <button
            className={`w-1/3 py-2 text-center ${activeTab === "yourInfo" ? "text-blue-500 border-b-4 border-blue-500" : "text-black"}`}
            disabled={!selectedTime}
          >
            Your Info
          </button>
          <button
            className={`w-1/3 py-2 text-center ${activeTab === "confirmation" ? "text-blue-500 border-b-4 border-blue-500" : "text-black"}`}
            disabled
          >
            Confirmation
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {/* Choose Appointment */}
        {activeTab === "chooseAppointment" && (
          <div>
            <div className="mb-8 text-gray-700">
              <p className="text-sm">
                Timeslots are set by day. For the first day and last day of the trip, you can elect to only select half of the day.
                Please select full days for other days. To select a full day, select both the 9 AM and 1 PM option. To select a half-day, only select the 1 PM option on the first day or the 9 AM option on the last day.
              </p>
            </div>

            <div className="text-sm font-semibold mt-4 mb-4">Ride-Along Request</div>

            <div className="mb-8 text-gray-700">
              <p className="text-sm">
                If you'd like to book an entire day, please select both 9 AM and 1 PM. On the first or last day, if you'd like to book a half day, please only select one of the options.
              </p>
            </div>

            <div className="flex space-x-8">
              <div className="w-1/2 border p-4 rounded-lg">
                {renderCalendar()}
              </div>
              <div className="w-1/2 p-4 border rounded-lg">
                {selectedDate ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{selectedDate.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {groupedSlots[`${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}-${selectedDate.getDate().toString().padStart(2, "0")}`].map((slot, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleTimeSelect(slot.datetime)}
                          className={`p-2 border rounded-md cursor-pointer hover:bg-blue-100 ${selectedTime === slot.datetime ? "bg-blue-200" : ""}`}
                        >
                          {new Date(slot.datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      ))}
                    </div>

                    {selectedTime && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-lg">Select:</h4>
                        <ul className="list-none">
                          <li
                            onClick={handleAndBook} // Switch to "Your Info" tab when selected
                            className="py-2 px-4 hover:bg-blue-200 cursor-pointer"
                          >
                            Select and Continue
                          </li>
                          <li
                            onClick={handleAddAnotherTime}
                            className="py-2 px-4 hover:bg-blue-200 cursor-pointer"
                          >
                            Select and Add Another Time
                          </li>
                          {/* <li
                            onClick={handleRecurringClick}
                            className="py-2 px-4 hover:bg-blue-200 cursor-pointer"
                          >
                            Select and Make Recurring
                          </li> */}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-lg">Please select a date to view available times.</p>
                )}
                {renderTimesAdded()}
              </div>
            </div>
          </div>
        )}

        {/* Your Info */}
        {activeTab === "yourInfo" && (
          <div>
            <div onClick={() => setActiveTab("chooseAppointment")} className="flex items-center mb-4">
              <FaArrowLeft className="text-blue-500 cursor-pointer mr-2" />
              <a className="text-black cursor-pointer">Edit Information</a>
            </div>

            {/* Conditionally render either addedTimes or single selected time */}
            <h4 className="text-xl font-bold mb-4">Selected Time slots</h4>

            <div className="space-y-2 mb-4">
              {addedTimes.length > 0 ? (
                // Display all selected times
                addedTimes.map((time, index) => (
                  <h4 key={index} className="text-lg">
                    {new Date(time).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}{" "}
                    {new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </h4>
                ))
              ) : (
                // Display single selected time
                <h4 className="text-lg">
                  {`${new Date(selectedTime || "").toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })} 
      ${new Date(selectedTime || "").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                </h4>
              )}
            </div>

            <form className="space-y-4 max-w-full mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col w-full md:w-1/2">
                  <label htmlFor="firstName" className="text-sm font-semibold">First Name <span className="text-red-500">*</span></label>
                  <input type="text" id="firstName" className="p-2 border rounded-md" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter First Name" required />
                </div>
                <div className="flex flex-col w-full md:w-1/2">
                  <label htmlFor="lastName" className="text-sm font-semibold">Last Name <span className="text-red-500">*</span></label>
                  <input type="text" id="lastName" className="p-2 border rounded-md" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter Last Name" required />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col w-full md:w-1/2">
                  <label htmlFor="email" className="text-sm font-semibold">Email <span className="text-red-500">*</span></label>
                  <input type="email" id="email" className="p-2 border rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" required />
                </div>
                <div className="flex flex-col w-full md:w-1/2">
                  <label htmlFor="phone" className="text-sm font-semibold">Phone <span className="text-red-500">*</span></label>
                  <input type="tel" id="phone" className="p-2 border rounded-md" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Phone Number" required />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="notes" className="text-sm font-semibold">Notes</label>
                <textarea
                  id="notes"
                  className="p-2 border rounded-md h-32" // Increased height
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter any additional notes here"
                />
              </div>

              <div className="mt-4">
                <button
                  onClick={handleFormSubmit}
                  className="py-2 px-4 bg-black text-white rounded-md w-auto" // Smaller button and left-aligned
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Confirmation Tab Content */}
        {activeTab === "confirmation" && (
          <div className="text-left">
            <h3 className="text-xl font-bold mb-4">Appointment Scheduled Successfully</h3>
            <button
              onClick={() => handleTabSwitch("chooseAppointment")}
              className="text-black underline hover:text-blue-500"
            >
              Back to Calendar
            </button>
            {/* <iframe src={confirmationURL} className="w-full h-screen" title="Confirmation"></iframe> */}
          </div>
        )}

        <div>
          {/* Your calendar component JSX here */}
          {showMessageModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <MessageModal message={message} onClose={handleCloseMessageModal} isSuccess={isSuccessBooking} />
            </div>
          )}
        </div>

        {/*Last option*/}
        {/* {showRecurringModal && (
          <RecurringAppointmentModal selectedDate={selectedDate} selectedTime={selectedTime} onClose={handleCloseRecurringModal} onAddAppointment={() => setShowRecurringModal(false)} />
        )} */}
      </div>
    </div>
  );
}
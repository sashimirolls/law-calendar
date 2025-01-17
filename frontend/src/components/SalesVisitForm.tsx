import React, { useState, useEffect } from 'react';
import { salespeople } from '../config/salespeople';
import { useApp } from '../contexts/AppContext';
import axios from 'axios';
import { API_CONFIG } from '../services/config';
import eventBus from '../eventBus';
import { Logger } from '../utils/logger';

interface FormData {
  firstName: string;
  lastName: string;
  title: string;
  phoneNumber: string;
  email: string;
  company: string;
  communicatedDates: string;
  reasonForRideAlong: string;
  specificAccounts: string;
}

interface Salesperson {
  name: string;
  calendarID: string;
}

const SalesVisitForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    title: '',
    phoneNumber: '',
    email: '',
    company: '',
    communicatedDates: '',
    reasonForRideAlong: '',
    specificAccounts: ''
  });

  const [step, setStep] = useState<number>(1);
  const [selectedSalespeople, setSelectedSalespeople] = useState<Salesperson[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSalespersonSelect = (salesperson: Salesperson) => {
    const isSelected = selectedSalespeople.some(sp => sp.calendarID === salesperson.calendarID);

    if (isSelected) {
      // Remove salesperson if they are already selected
      setSelectedSalespeople(selectedSalespeople.filter(sp => sp.calendarID !== salesperson.calendarID));
    } else if (selectedSalespeople.length < 2) {
      // Add salesperson if fewer than 2 are selected
      setSelectedSalespeople([...selectedSalespeople, salesperson]);
    }
  };


  const { state, state: { updateParams } } = useApp();
  // useEffect(() => {
  //   // Update URL parameter when selectedSalespeople changes
  //   const salespeopleParam = selectedSalespeople
  //     .map(sp => `${sp.name.split(' ')[0]} ${sp.name.split(' ')[1]}`) // Include both first and last names
  //     .join(',');
  //   const url = new URL(window.location.href);
  //   url.searchParams.set('salespeople', salespeopleParam);
  //   window.history.pushState({}, '', url.toString());
  //   const updatedParams = {
  //     ...state,
  //     selectedPeople: selectedSalespeople,
  //   };
  //   updateParams(updatedParams); // Update URL params and context
  // }, [selectedSalespeople]);

  useEffect(() => {
    // Update URL parameter when selectedSalespeople changes
    const salespeopleParam = selectedSalespeople
      .map(sp => `${sp.name.split(' ')[0]} ${sp.name.split(' ')[1]}`) // Include both first and last names
      .join(',');

    const url = new URL(window.location.href);

    // Set or replace the 'salespeople' parameter
    if (salespeopleParam) {
      url.searchParams.set('salespeople', salespeopleParam);
    } else {
      url.searchParams.delete('salespeople'); // Remove the parameter if no salespeople are selected
    }

    // Update the URL without refreshing the page
    window.history.replaceState({}, '', url.toString());

    // Update context state
    const updatedParams = {
      ...state,
      selectedPeople: selectedSalespeople,
    };
    updateParams(updatedParams);

    const handleEvent = (data :any) => handleSubmitForm(data);

    eventBus.on('formSubmitted', handleEvent);

    return () => {
      eventBus.off('formSubmitted', handleEvent);  // Cleanup
    };
  }, [selectedSalespeople, state, updateParams]);

  

  const handleSubmitForm = async (appointmentId: any) => {
    const sanitizedBaseUrl = API_CONFIG.BASE_URL.replace(/\/api$/, '');
    try {
      const customerDetails = {
        ...formData,
        salespeople: selectedSalespeople,
        appointmentId: appointmentId.id
      };
      const response = await axios.post(`${sanitizedBaseUrl}/customer/submitForm`, customerDetails);
      if (response.status === 200) {
        Logger.debug('SalesVisitForm', 'Customer form submitted successfully');
      }
    } catch (error) {
      console.error('Error while submitting customer form:', error);
    }
  }


  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: '100%',
        backgroundColor: '#e0e0e0',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        <div style={{
          width: step === 1 ? '50%' : '100%',
          height: '10px',
          backgroundColor: '#007BFF',
          transition: 'width 0.3s ease'
        }}></div>
      </div>
      <h2 style={{
        textAlign: 'center',
        color: '#333',
        backgroundColor: '#e0f7ff',
        padding: '10px',
        borderRadius: '5px'
      }}>Sales Visit Questionnaire</h2>
      {step === 1 && (
        <form onSubmit={handleNext}>
          {['firstName', 'lastName', 'title', 'phoneNumber', 'email', 'company'].map((field) => (
            <div key={field} style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333' }}>
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <input
                type={field === 'email' ? 'email' : field === 'phoneNumber' ? 'tel' : 'text'}
                name={field}
                value={formData[field as keyof FormData]}
                onChange={handleChange}
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  if (field === 'phoneNumber') {
                    // Remove non-numeric characters
                    input.value = input.value.replace(/[^0-9]/g, '');
                  } else if (field === 'firstName' || field === 'lastName') {
                    // Remove numeric characters
                    input.value = input.value.replace(/[0-9]/g, '');
                  }
                }}
                required
                placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                minLength={field === 'phoneNumber' ? 6 : undefined}
                maxLength={field === 'phoneNumber' ? 10 : 255}
                pattern={field === 'firstName' || field === 'lastName' ? '[^0-9]*' : undefined}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          ))}
          <button type="submit" style={{
            width: '120px',
            padding: '8px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'block',
            margin: '20px auto 0'
          }}>Next</button>
        </form>
      )}
      {step === 2 && (
        <div>
          <h3>Welcome, {formData.firstName}! Let's get started with booking your ride-along!</h3>
          <p>Please select up to 2 salespeople for your ride-along. Selecting more will result in cancellation.</p>
          <br />
          {salespeople.map((sp: any) => (
            // Updated Salesperson div with hover effect and pointer cursor
            <div key={sp.calendarID}
              style={{
                marginBottom: '15px',
                fontSize: '18px',
                paddingLeft: '10px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: selectedSalespeople.some(selected => selected.calendarID === sp.calendarID) ? '#e0f7ff' : 'transparent',
                transition: 'background-color 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => handleSalespersonSelect(sp)} // Ensure checkbox gets checked on click
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#cce6ff'} // On hover background color change
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedSalespeople.some(selected => selected.calendarID === sp.calendarID) ? '#e0f7ff' : 'transparent'} // Revert background color when mouse leaves
            >
              {/* <input
                type="checkbox"
                // checked={selectedSalespeople.some(selected => selected.calendarId == sp.calendarID)}
                onChange={() => handleSalespersonSelect(sp)}
                disabled={selectedSalespeople.length >= 2 && !selectedSalespeople.some(selected => selected.calendarId === sp.calendarID)}
                id={`checkbox-${sp.calendarID}`}  // Unique ID for each checkbox
                style={{
                  width: '30px',
                  height: '30px',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
              /> */}

              <input
                type="checkbox"
                checked={selectedSalespeople.some(selected => selected.calendarID === sp.calendarID)}
                onChange={() => handleSalespersonSelect(sp)}
                disabled={selectedSalespeople.length >= 2 && !selectedSalespeople.some(selected => selected.calendarID === sp.calendarID)}
                id={`checkbox-${sp.calendarID}`}
                style={{
                  width: '30px',
                  height: '30px',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
              />
              <label style={{
                fontSize: '20px',
                cursor: 'pointer',
                color: selectedSalespeople.some(selected => selected.calendarID === sp.calendarID) ? '#007BFF' : '#333'
              }}>
                {sp.name}
              </label>
            </div>
          ))}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333' }}>
              Have you communicated dates with selected salespeople?
            </label>
            <input
              type="text"
              name="communicatedDates"
              value={formData.communicatedDates}
              onChange={handleChange}
              placeholder="Yes/No"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333' }}>
              Why would you like to go on a ride-along with {selectedSalespeople.map(sp => sp.name).join(' and ')}?
            </label>
            <textarea
              name="reasonForRideAlong"
              value={formData.reasonForRideAlong}
              onChange={handleChange}
              placeholder="Enter your reason"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
                height: '100px'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333' }}>
              Are there any accounts you'd like to see in particular?
            </label>
            <textarea
              name="specificAccounts"
              value={formData.specificAccounts}
              onChange={handleChange}
              placeholder="Enter your response"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
                height: '100px'
              }}
            />
          </div>
          <button
            onClick={handleBack}
            style={{
              width: '120px',
              padding: '8px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'block',
              margin: '20px auto 0'
            }}
          >Back</button>
        </div>
      )}
    </div>
  );
};

export default SalesVisitForm;

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import './Booking.css';
const API_URL = import.meta.env.VITE_API_BASE_URL;

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);
  if (hours === 12) hours = 0;
  if (modifier === 'PM') hours += 12;
  return (hours * 60) + minutes;
};

export default function Booking() {
  const [sports, setSports] = useState([]);
  const [courts, setCourts] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal & Booking States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [paymentStep, setPaymentStep] = useState(1); 
  
  // Real-world selection states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [bookedIntervals, setBookedIntervals] = useState([]); 

  // PromptPay & Timer States
  const [timeLeft, setTimeLeft] = useState(600); 
  const [slipImage, setSlipImage] = useState(null);

  // NEW: Admin Pricing State
  const [hourlyRate, setHourlyRate] = useState(25); 

  const timeSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sportsRes, courtsRes, configRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sports`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courts`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/config`) // NEW: Fetch Admin Price
        ]);
        const sportsData = await sportsRes.json();
        const courtsData = await courtsRes.json();
        const configData = await configRes.json();
        
        setSports(Array.isArray(sportsData) ? sportsData : []);
        setCourts(Array.isArray(courtsData) ? courtsData : []);
        if (configData && configData.Hourly_Rate) {
          setHourlyRate(configData.Hourly_Rate);
        }
        
        if (sportsData.length > 0) setSelectedSport(sportsData[0]);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDate && bookingDetails?._id) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/court/${bookingDetails._id}/date/${selectedDate}`)
        .then(res => res.json())
        .then(data => setBookedIntervals(data))
        .catch(err => console.error("Error fetching availability:", err));
    } else {
      setBookedIntervals([]); 
    }
  }, [selectedDate, bookingDetails]);

  // 10-Minute Timer Logic
  useEffect(() => {
    let timer;
    if (paymentStep === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && paymentStep === 2) {
      alert("Payment time expired. Your reserved slot has been released.");
      setIsModalOpen(false); 
    }
    return () => clearInterval(timer);
  }, [paymentStep, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isSlotDisabled = (slotTimeStr) => {
    const requestedStart = timeToMinutes(slotTimeStr);
    const requestedEnd = requestedStart + (duration * 60); 

    return bookedIntervals.some(booking => {
      const bookedStart = timeToMinutes(booking.Start_Time);
      const bookedEnd = bookedStart + (booking.Duration * 60);
      return (requestedStart < bookedEnd) && (requestedEnd > bookedStart);
    });
  };

  const handleOpenModal = (court) => {
    setBookingDetails(court);
    setPaymentStep(1);
    setSelectedDate('');
    setSelectedTime('');
    setDuration(1);
    setSlipImage(null);
    setTimeLeft(600); 
    setIsModalOpen(true);
  };

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a valid Date and Time first.");
      return;
    }
    setPaymentStep(2); 
  };

  // Step 2: Submit Slip and Confirm
  const handleConfirmPayment = async () => {
    if (!slipImage) {
      alert("Please upload your PromptPay transfer slip to confirm.");
      return;
    }

    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.id) {
      alert("Please log in to complete your booking.");
      return;
    }

    setPaymentStep(3);

    // NEW: Calculate dynamic price based on admin setting
    const finalPrice = hourlyRate * Number(duration);

    const formData = new FormData();
    formData.append('User_ID', userData.id);
    formData.append('Court_ID', bookingDetails._id);
    formData.append('Date', selectedDate);
    formData.append('Start_Time', selectedTime);
    formData.append('Duration', Number(duration));
    formData.append('Booking_Status', 'Pending');
    
    // NEW: Send Total_Price instead of Payment_Method
    formData.append('Total_Price', finalPrice); 
    formData.append('slipImage', slipImage); 

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`, {
        method: 'POST',
        body: formData, 
      });

      if (response.ok) {
        setTimeout(() => setPaymentStep(4), 1500); 
      } else {
        const errorData = await response.json();
        alert(`Booking Failed: ${errorData.message}`);
        setPaymentStep(2); 
      }
    } catch (error) {
      console.error("Network Error:", error);
      setPaymentStep(2);
    }
  };
  
  const today = new Date().toISOString().split('T')[0];

  if (loading) return <div className="modern-loader"></div>;

  return (
    <div className="booking-page-wrapper">
      <div className="booking-overlay-glow"></div>
      
      <div className="booking-main-content">
        <header className="booking-hero">
          <h1 className="reveal-title">Reserve Your <span className="neon-text">Arena</span></h1>
          <p className="hero-subtitle">Professional-grade facilities for elite performance.</p>
        </header>

        <div className="pill-nav-container">
          <div className="pill-nav">
            {sports.map((sport) => (
              <button 
                key={sport._id} 
                className={`pill-item ${selectedSport?._id === sport._id ? 'active' : ''}`}
                onClick={() => setSelectedSport(sport)}
              >
                <div className="pill-icon">
                  <img src={`${import.meta.env.VITE_API_BASE_URL}/uploads/sports/${sport.Sports_Image}`} alt="" />
                </div>
                <span>{sport.Sports_Name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="arena-section">
          <div className="arena-header">
            <h2>{selectedSport?.Sports_Name} Facilities</h2>
            <div className="arena-count">{courts.filter(c => (c.Sports_ID?._id || c.Sports_ID) === selectedSport?._id).length} Arenas Available</div>
          </div>
          
          <div className="arena-grid">
            {courts
  .filter(court => (court.Sports_ID?._id || court.Sports_ID) === selectedSport?._id)
  .map(court => (
                <div key={court._id} className="arena-card">
                  <div className="arena-card-top">
                    <span className="arena-id">{court.Court_Number}</span>
                    <div className={`arena-status ${court.Status.toLowerCase()}`}>
                      <span className="status-indicator"></span>
                      {court.Status}
                    </div>
                  </div>
                  
                  <div className="arena-card-body">
                    <p>{court.Description}</p>
                  </div>

                  <div className="arena-card-footer">
                    <div className="arena-price">
                      <span className="currency">$</span>
                      {/* UPDATED: Dynamic Price */}
                      <span className="amount">{hourlyRate}</span>
                      <span className="per">/hr</span>
                    </div>
                    <button 
                      className="arena-btn" 
                      disabled={court.Status !== 'Available'}
                      onClick={() => handleOpenModal(court)}
                    >
                      {court.Status === 'Available' ? 'Reserve Arena' : 'Maintenance'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="payment-modal">
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>&times;</button>
            
            {/* STEP 1: Select Time */}
            {paymentStep === 1 && (
              <div className="payment-step">
                <h2>Select Time</h2>
                
                <div className="datetime-selection">
                  <div className="input-group">
                    <label className="label">Select Date</label>
                    <input 
                      type="date" 
                      className="dark-date-input"
                      min={today}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="input-group">
                    <label className="label">Select Time Slot</label>
                    <div className="time-grid">
                      {timeSlots.map(time => {
                        const disabled = isSlotDisabled(time);
                        return (
                          <button 
                            key={time}
                            disabled={disabled}
                            title={disabled ? "This time slot is already booked" : `Select ${time}`}
                            className={`time-slot ${selectedTime === time ? 'active' : ''} ${disabled ? 'disabled-slot' : ''}`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                    <div className="input-group" style={{ marginTop: '20px' }}>
                      <label className="label">Select Duration</label>
                      <select 
                        className="dark-date-input" 
                        value={duration} 
                        onChange={(e) => setDuration(e.target.value)}
                      >
                        <option value={1}>1 Hour</option>
                        <option value={2}>2 Hours</option>
                        <option value={3}>3 Hours</option>
                      </select>
                    </div>
                  </div>
                </div>

               <button className="pay-now-btn" onClick={handleProceedToPayment}>
                  Proceed to Payment
               </button>
              </div>
            )}

            {/* STEP 2: PromptPay & Timer */}
            {paymentStep === 2 && (
              <div className="payment-step promptpay-step">
                <h2>Scan to Pay</h2>
                <div className="timer-box">
                  <p>Hold expires in:</p>
                  <h3 className="countdown-text">{formatTime(timeLeft)}</h3>
                </div>
                
                <div className="qr-container">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="PromptPay QR" className="qr-image" />
                  {/* UPDATED: Dynamic Price calculation */}
                  <p className="qr-amount">Total: ${(hourlyRate * duration).toFixed(2)}</p>
                </div>

                <div className="upload-section">
                  <label className="label">Upload Payment Slip</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setSlipImage(e.target.files[0])}
                    className="file-input"
                  />
                </div>

                <button className="pay-now-btn" onClick={handleConfirmPayment}>
                  Submit Payment Slip
                </button>
              </div>
            )}

            {/* STEP 3: Processing */}
            {paymentStep === 3 && (
              <div className="payment-step processing">
                <div className="spinner"></div>
                <p>Verifying Submission...</p>
              </div>
            )}

            {/* STEP 4: Success */}
            {paymentStep === 4 && (
              <div className="payment-step success">
                <div className="success-icon">✓</div>
                <h2>Pending Verification</h2>
                <p>Your slip has been sent to staff. Your arena is locked for {selectedDate} at {selectedTime}.</p>
                <button className="done-btn" onClick={() => setIsModalOpen(false)}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
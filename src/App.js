import React from 'react';
import BookingForm from './components/BookingForm';

const App = () => {
  return (
    <>
      <div className='background-image'>
        <h1 className="py-4 text-center text-dark">Park Tickets Booking</h1>
        <BookingForm />
      </div>
    </>
  );
};

export default App;

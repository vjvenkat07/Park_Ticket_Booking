import React from 'react';
import BookingForm from './components/BookingForm';
import parkImage from './assets/background_park.avif'

const App = () => {
  return (
    <>
      <div className='background-image'>
        <h1 className="py-4 text-center text-primary">Park Tickets Booking</h1>
        <BookingForm />
      </div>
    </>
  );
};

export default App;

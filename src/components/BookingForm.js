import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col, Container, Card, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { FaUser, FaMapMarkerAlt, FaCalendarAlt, FaChild, FaUserAlt, FaTicketAlt, FaMoneyBillAlt } from 'react-icons/fa';
import { IoTicket } from "react-icons/io5";
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const BookingForm = () => {
    const [name, setName] = useState('');
    const [tickets, setTickets] = useState({ adult: 0, child: 0, senior: 0 });
    const [showChildModal, setShowChildModal] = useState(false);
    const [message, setMessage] = useState('');
    const [paidAmount, setPaidAmount] = useState(0);
    const [location, setLocation] = useState('');
    const [bookingDate, setBookingDate] = useState(new Date());
    const [currentStep, setCurrentStep] = useState(1);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingStatusMessage, setBookingStatusMessage] = useState('');
    const [previousValues, setPreviousValues] = useState({});
    const [bookingDetails, setBookingDetails] = useState({});
    const prices = { adult: 800, child: 600, senior: 700 };
    const offerLocations = ['Kochi', 'Bangalore', 'Hyderabad', 'Bhubaneswar'];
    const allLocations = [...offerLocations, 'Chennai', 'Mumbai'];

    useEffect(() => {

        const ticketTypes = ['adult', 'child', 'senior'];
        const totalAmount = ticketTypes.reduce((total, type) => total + (tickets[type] * prices[type]), 0);
        setPaidAmount(totalAmount);

    }, [tickets, location]);

    const handleInputChange = (type, value) => {
        setTickets({ ...tickets, [type]: parseInt(value) || 0 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const totalTickets = tickets.adult + tickets.child + tickets.senior;
        if (totalTickets < 1) {
            setMessage('Please add ticket/s to proceed!');
            return;
        }

        const currentTime = new Date();
        if (currentTime.getDate() === bookingDate.getDate() && currentTime.getHours() >= 8) {
            setMessage('Booking for the current day is closed after 8 AM.');
            return;
        } else {
            setMessage('');
        }

        setPreviousValues({ ...tickets });
        const bookingData = {
            name,
            adultTicket: tickets.adult,
            seniorCitizenTicket: tickets.senior,
            childTicket: tickets.child,
            adultTicketPrice: prices.adult,
            seniorCitizenTicketPrice: prices.senior,
            childTicketPrice: prices.child,
            bookedTicket: totalTickets,
            paidAmount,
            location,
            bookedDate: bookingDate.toISOString()
        };
        try {
            const response = await axios.post('http://localhost:8080/booking/offer', bookingData);
            setBookingDetails(response.data)
            setCurrentStep(2);
        } catch (error) {
            setMessage(error.message);
            console.log('error', error.message)
        }
    };

    const handleBack = () => {
        setCurrentStep(1);
        setTickets(previousValues);
    };

    const handleBooking = async () => {
        try {
            setBookingStatusMessage(`We're excited to see you! You have successfully booked ${bookingDetails.bookedTicket} ${bookingDetails.offerAvailable && '+ 1'} tickets.`);
        } catch (error) {
            setBookingStatusMessage('An error occurred while booking tickets.');
        }
        setShowBookingModal(true);
    };

    const handleLocationChange = (e) => {
        const selectedLocation = e.target.value;
        setLocation(selectedLocation);
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-md-center">
                <Col md="8">
                    <Card className="shadow">
                        <Card.Header className="bg-primary text-white text-center">
                            <h3 className="font-weight-bold">
                                Special Offer on Park Tickets - Limited Time Only!<br />
                            </h3>
                            <div className='fs-4'>Buy 3 Get 1 Free!*</div>
                            <small>( Valid from July 15, 2024, to August 15, 2024 )</small><br />
                        </Card.Header>
                        <Card.Body>
                            <Card.Text className="text-center fw-bold">
                                Book your tickets now and enjoy the best deal at our parks.
                            </Card.Text>
                            {currentStep === 1 && (
                                <Form onSubmit={handleSubmit}>
                                    {message && <Alert variant="info">{message}</Alert>}
                                    <Form.Group controlId="formName">
                                        <Form.Label className="font-weight-bold">Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formLocation">
                                        <Form.Label className="font-weight-bold">Location</Form.Label>
                                        <Form.Control as="select" value={location} onChange={handleLocationChange} required>
                                            <option value="">Select Location</option>
                                            {allLocations.map(loc => (
                                                <option key={loc} value={loc}>{loc}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="formBookingDate">
                                        <Form.Label className="font-weight-bold">Booking Date</Form.Label>
                                        <div className="d-flex align-items-center w-100">
                                            <DatePicker
                                                selected={bookingDate}
                                                onChange={(date) => setBookingDate(date)}
                                                minDate={new Date()}
                                                dateFormat="yyyy-MM-dd"
                                                className="form-control w-100"
                                                customInput={<div style={{ position: 'relative' }}>
                                                    <Form.Control
                                                        className="border-0 w-100"
                                                        value={bookingDate.toDateString()}
                                                        readOnly
                                                        style={{ width: '100%', margin: 0, padding: 0 }}
                                                    />
                                                    <FaCalendarAlt style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                                                </div>}
                                                required
                                            />
                                        </div>
                                    </Form.Group>
                                    <Row>
                                        <Col md="4">
                                            <Form.Group controlId="formAdultTickets">
                                                <Form.Label className="font-weight-bold">Adult Tickets (₹800 each)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    value={tickets.adult}
                                                    onChange={(e) => handleInputChange('adult', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md="4">
                                            <Form.Group controlId="formChildTickets">
                                                <Form.Label className="font-weight-bold">Child Tickets (₹600 each)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    value={tickets.child}
                                                    onChange={(e) => {
                                                        handleInputChange('child', e.target.value);
                                                        if (parseInt(e.target.value) > 0) setShowChildModal(true);
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md="4">
                                            <Form.Group controlId="formSeniorTickets">
                                                <Form.Label className="font-weight-bold">Senior Citizen Tickets (₹700 each)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    value={tickets.senior}
                                                    onChange={(e) => handleInputChange('senior', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col>
                                            <Button variant="primary" type="submit" block>
                                                Book Now
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col>
                                            <h5 className="font-weight-bold">Total Amount: ₹{paidAmount}</h5>
                                        </Col>
                                    </Row>
                                </Form>
                            )}
                            {currentStep === 2 && (
                                <div className="text-center">
                                    <h4 className="font-weight-bold mb-4">Review Your Booking</h4>
                                    <Card className="shadow">
                                        <Card.Body>
                                            <Row className="mb-3 align-items-center">
                                                <Col xs="1" className="text-center">
                                                    <FaUser className="text-primary" />
                                                </Col>
                                                <Col xs="3" className="text-right">
                                                    <strong>Name</strong>
                                                </Col>
                                                <Col xs="8">
                                                    {bookingDetails.name}
                                                </Col>
                                            </Row>
                                            <Row className="mb-3 align-items-center">
                                                <Col xs="1" className="text-center">
                                                    <FaMapMarkerAlt className="text-primary" />
                                                </Col>
                                                <Col xs="3" className="text-right">
                                                    <strong>Location</strong>
                                                </Col>
                                                <Col xs="8">
                                                    {bookingDetails.location}
                                                </Col>
                                            </Row>
                                            <Row className="mb-3 align-items-center">
                                                <Col xs="1" className="text-center">
                                                    <FaCalendarAlt className="text-primary" />
                                                </Col>
                                                <Col xs="3" className="text-right">
                                                    <strong>Booking Date</strong>
                                                </Col>
                                                <Col xs="8">
                                                    {new Date(bookingDetails.bookedDate).toDateString()}
                                                </Col>
                                            </Row>
                                            <Row className="mb-3 align-items-center">
                                                <Col xs="1" className="text-center">
                                                    <FaUser className="text-primary" />
                                                </Col>
                                                <Col xs="3" className="text-right">
                                                    <strong>Adult Tickets</strong>
                                                </Col>
                                                <Col xs="8">
                                                    {bookingDetails.adultTicket}
                                                </Col>
                                            </Row>
                                            <Row className="mb-3 align-items-center">
                                                <Col xs="1" className="text-center">
                                                    <FaChild className="text-primary" />
                                                </Col>
                                                <Col xs="3" className="text-right">
                                                    <strong>Child Tickets</strong>
                                                </Col>
                                                <Col xs="8">
                                                    {bookingDetails.childTicket}
                                                </Col>
                                            </Row>
                                            <Row className="mb-3 align-items-center">
                                                <Col xs="1" className="text-center">
                                                    <FaUserAlt className="text-primary" />
                                                </Col>
                                                <Col xs="3" className="text-right">
                                                    <strong>Senior Citizen Tickets</strong>
                                                </Col>
                                                <Col xs="8">
                                                    {bookingDetails.seniorCitizenTicket}
                                                </Col>
                                            </Row>
                                            {
                                                bookingDetails.offerAvailable &&
                                                <Row className="mb-3 align-items-center">
                                                    <Col xs="1" className="text-center">
                                                        <IoTicket className="text-primary" />
                                                    </Col>
                                                    <Col xs="3" className="text-right">
                                                        <strong>Free Ticket</strong>
                                                    </Col>
                                                    <Col xs="8">
                                                        {`${bookingDetails.freeTicketCount} (For ${bookingDetails.freeTicketFor})`}
                                                    </Col>
                                                </Row>
                                            }
                                            <Row className="mb-3 align-items-center">
                                                <Col xs="1" className="text-center">
                                                    <FaTicketAlt className="text-primary" />
                                                </Col>
                                                <Col xs="3" className="text-right">
                                                    <strong>Total Tickets</strong>
                                                </Col>
                                                <Col xs="8">
                                                    {
                                                        bookingDetails.bookedTicket + bookingDetails.freeTicketCount
                                                    }
                                                </Col>
                                            </Row>
                                            <Row className="mb-3 align-items-center">
                                                <Col xs="1" className="text-center">
                                                    <FaMoneyBillAlt className="text-primary" />
                                                </Col>
                                                <Col xs="3" className="text-right">
                                                    <strong>Total Paid Amount</strong>
                                                </Col>
                                                <Col xs="8">
                                                    ₹{bookingDetails.paidAmount}
                                                </Col>
                                            </Row>
                                            <Row className="mt-4">
                                                <div className='d-flex justify-content-evenly'>
                                                    <Button variant="secondary" onClick={handleBack} className="mr-2">
                                                        Back
                                                    </Button>
                                                    <Button variant="primary" onClick={handleBooking}>
                                                        Confirm
                                                    </Button>
                                                </div>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={showChildModal} onHide={() => setShowChildModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Height Restriction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Height should be between 85 cm and 140 cm for Child tickets.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowChildModal(false)}>OK</Button>
                </Modal.Footer>
            </Modal>

            {/* Booking Status Modal */}
            <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Booking Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{bookingStatusMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default BookingForm;

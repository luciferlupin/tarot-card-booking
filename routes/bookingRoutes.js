const express = require('express');
const router = express.Router();
const { sendBookingConfirmation } = require('../utils/emailService');
const Booking = require('../models/Booking');
const { ObjectId } = require('mongodb');
const logger = require('../utils/logger');

// Create a new booking
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, date, time, readingType } = req.body;
        
        // Validate required fields
        if (!name || !email || !phone || !date || !time || !readingType) {
            return res.status(400).json({ 
                message: 'All fields are required. Please fill in all information.' 
            });
        }
        
        // Validate email format
        if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            return res.status(400).json({ 
                message: 'Please enter a valid email address (example: user@example.com)' 
            });
        }

        // Validate phone format (10 digits)
        if (!phone.match(/^\d{10}$/)) {
            return res.status(400).json({ 
                message: 'Please enter a valid 10-digit phone number (no spaces or special characters)' 
            });
        }

        // Validate date format and ensure it's not in the past
        try {
            const bookingDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (isNaN(bookingDate.getTime())) {
                return res.status(400).json({ 
                    message: 'Please select a valid date using the date picker' 
                });
            }

            if (bookingDate < today) {
                return res.status(400).json({ 
                    message: 'Cannot book appointments in the past. Please select a future date' 
                });
            }
        } catch (error) {
            return res.status(400).json({ 
                message: 'Please select a valid date using the date picker' 
            });
        }

        // Validate time format and range (3 PM to 11 PM)
        const timeParts = time.split(':');
        if (timeParts.length !== 2) {
            return res.status(400).json({ 
                message: 'Please select a valid time using the time picker' 
            });
        }

        const timeHour = parseInt(timeParts[0]);
        if (timeHour < 15 || timeHour > 23) {
            return res.status(400).json({ 
                message: 'Time must be between 3 PM and 11 PM. Please select a valid time slot' 
            });
        }

        // Validate reading type
        const validReadingTypes = ['celestial', 'spiritual', 'quick'];
        if (!validReadingTypes.includes(readingType)) {
            return res.status(400).json({ 
                message: 'Please select a valid reading type' 
            });
        }

        // Calculate end time based on reading type
        const readingDetails = {
            quick: { duration: 30 },
            spiritual: { duration: 60 },
            celestial: { duration: 90 }
        };

        const startTime = new Date(`${date}T${time}`);
        const endTime = new Date(startTime.getTime() + readingDetails[readingType].duration * 60000);

        // Check for overlapping bookings
        const existingBooking = await Booking.findOne({
            date,
            $or: [
                {
                    time: {
                        $gte: time,
                        $lt: endTime.toTimeString().slice(0, 5)
                    }
                },
                {
                    endTime: {
                        $gt: time,
                        $lte: endTime.toTimeString().slice(0, 5)
                    }
                }
            ]
        });

        if (existingBooking) {
            return res.status(409).json({ 
                message: 'This time slot is already booked. Please select another time' 
            });
        }

        // Create new booking
        const booking = new Booking({
            name,
            email,
            phone,
            date,
            time,
            readingType
        });

        await booking.save();

        // Send confirmation email
        try {
            await sendBookingConfirmation(booking);
        } catch (emailError) {
            logger.error('Error sending confirmation email:', emailError);
            // Don't fail the booking if email fails
        }

        res.status(201).json({
            message: 'Booking confirmed',
            booking: {
                name: booking.name,
                email: booking.email,
                phone: booking.phone,
                date: booking.date,
                time: booking.time,
                readingType: booking.readingName,
                duration: booking.duration,
                price: booking.price
            }
        });

    } catch (error) {
        logger.error('Error creating booking:', error);
        res.status(500).json({ 
            message: 'An unexpected error occurred. Please try again later.', 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
        });
    }
});

// Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        logger.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});

// Get available time slots for a date
router.get('/available-slots/:date', async (req, res) => {
    try {
        const date = req.params.date;
        
        // Validate date format
        if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD' });
        }

        // Get all bookings for the date
        const existingBookings = await Booking.find({
            date,
            status: { $in: ['confirmed', 'pending'] }
        }).select('time readingType');

        // Define available time slots (3 PM to 11 PM)
        const availableSlots = [];
        for (let hour = 15; hour <= 23; hour++) {
            availableSlots.push(`${hour}:00`);
            if (hour < 23) { // Don't add 30-minute slot for 11:00
                availableSlots.push(`${hour}:30`);
            }
        }

        // Check for conflicts with existing bookings
        const bookedSlots = new Set();
        existingBookings.forEach(booking => {
            const startTime = new Date(`2000-01-01T${booking.time}`);
            
            // Calculate end time based on reading type
            const readingDetails = {
                quick: { duration: 30 },
                spiritual: { duration: 60 },
                celestial: { duration: 90 }
            };

            const endTime = new Date(startTime.getTime() + readingDetails[booking.readingType].duration * 60000);
            const endTimeStr = endTime.toTimeString().slice(0, 5);

            // Mark all slots that are occupied
            for (let hour = startTime.getHours(); hour <= endTime.getHours(); hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    if (hour === endTime.getHours() && minute >= endTime.getMinutes()) break;
                    bookedSlots.add(`${hour}:${minute < 10 ? '0' : ''}${minute}`);
                }
            }
        });

        // Filter out booked slots
        const available = availableSlots.filter(slot => !bookedSlots.has(slot));
        res.json({ availableSlots: available });

    } catch (error) {
        logger.error('Error fetching available slots:', error);
        res.status(500).json({ message: 'Error fetching available slots', error: error.message });
    }
});

// Get a specific booking
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        logger.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Error fetching booking', error: error.message });
    }
});

// Update a booking
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        
        const booking = await Booking.findByIdAndUpdate(id, update, { new: true });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        res.json(booking);
    } catch (error) {
        logger.error('Error updating booking:', error);
        res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
});

// Delete/Cancel a booking
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByIdAndDelete(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        logger.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Error cancelling booking', error: error.message });
    }
});

module.exports = router;

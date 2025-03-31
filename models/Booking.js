const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: 'Please enter a valid 10-digit phone number'
        }
    },
    date: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{4}-\d{2}-\d{2}$/.test(v);
            },
            message: 'Please enter a valid date in YYYY-MM-DD format'
        }
    },
    time: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{2}:\d{2}$/.test(v);
            },
            message: 'Please enter a valid time in HH:MM format'
        }
    },
    readingType: {
        type: String,
        required: true,
        enum: ['celestial', 'spiritual', 'quick']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    readingName: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }
});

// Add virtual for formatted date
bookingSchema.virtual('formattedDate').get(function() {
    return new Date(this.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Add virtual for formatted time
bookingSchema.virtual('formattedTime').get(function() {
    return new Date(`2000-01-01T${this.time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });
});

// Add pre-save middleware to set reading details
bookingSchema.pre('save', async function(next) {
    try {
        const readingTypes = {
            quick: {
                name: 'Crystal Clear Insight',
                duration: 30,
                price: 300
            },
            spiritual: {
                name: 'Spiritual Guidance',
                duration: 60,
                price: 500
            },
            celestial: {
                name: 'Celestial Journey',
                duration: 90,
                price: 700
            }
        };

        const reading = readingTypes[this.readingType];
        this.readingName = reading.name;
        this.duration = reading.duration;
        this.price = reading.price;
        
        const startTime = new Date(`${this.date}T${this.time}`);
        this.endTime = new Date(startTime.getTime() + reading.duration * 60000).toISOString().split('T')[1].substring(0, 5);

        next();
    } catch (error) {
        console.error('Error in booking pre-save middleware:', error);
        next(error);
    }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

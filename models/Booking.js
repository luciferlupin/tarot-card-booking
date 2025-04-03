/**
 * Booking model without MongoDB/Mongoose
 */
const { create } = require('../utils/inMemoryStore');

class Booking {
    constructor(data) {
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.date = data.date;
        this.time = data.time;
        this.readingType = data.readingType;
        this.status = data.status || 'pending';
        this.createdAt = new Date();
        
        // Set reading details
        this.setReadingDetails();
    }

    // Validate email
    validateEmail() {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.email);
    }

    // Validate phone
    validatePhone() {
        return /^\d{10}$/.test(this.phone);
    }

    // Validate date
    validateDate() {
        return /^\d{4}-\d{2}-\d{2}$/.test(this.date);
    }

    // Validate time
    validateTime() {
        return /^\d{2}:\d{2}$/.test(this.time);
    }

    // Set reading details
    setReadingDetails() {
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
    }

    // Get formatted date
    get formattedDate() {
        return new Date(this.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Get formatted time
    get formattedTime() {
        return new Date(`2000-01-01T${this.time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    // Save the booking
    async save() {
        if (!this.validateEmail()) {
            throw new Error('Please enter a valid email address');
        }
        if (!this.validatePhone()) {
            throw new Error('Please enter a valid 10-digit phone number');
        }
        if (!this.validateDate()) {
            throw new Error('Please enter a valid date in YYYY-MM-DD format');
        }
        if (!this.validateTime()) {
            throw new Error('Please enter a valid time in HH:MM format');
        }
        
        return create(this);
    }

    // Static methods to match Mongoose API
    static find(query) {
        return require('../utils/inMemoryStore').find(query);
    }

    static findOne(query) {
        return require('../utils/inMemoryStore').findOne(query);
    }

    static findById(id) {
        return require('../utils/inMemoryStore').findById(id);
    }

    static findByIdAndUpdate(id, update) {
        return require('../utils/inMemoryStore').findByIdAndUpdate(id, update);
    }

    static findByIdAndDelete(id) {
        return require('../utils/inMemoryStore').findByIdAndDelete(id);
    }
}

module.exports = Booking;

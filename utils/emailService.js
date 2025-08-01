const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendBookingConfirmation = async ({ to, subject, data }) => {
    const readingTypes = {
        celestial: {
            name: 'Celestial Journey',
            duration: '90 minutes',
            price: '₹700'
        },
        spiritual: {
            name: 'Spiritual Guidance',
            duration: '60 minutes',
            price: '₹500'
        },
        quick: {
            name: 'Crystal Clear Insight',
            duration: '30 minutes',
            price: '₹300'
        }
    };
    
    const dateObj = new Date(data.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const timeObj = new Date(`2000-01-01T${data.time}`);
    const formattedTime = timeObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });

    const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2c1810;">
            <h1 style="color: #8a4d76; text-align: center;">✨ Your Mystical Journey Awaits ✨</h1>
            
            <p>Dear ${data.name},</p>
            
            <p>Thank you for booking your ${data.readingType} session. The stars have aligned for our meeting.</p>
            
            <div style="background: #f5f0f7; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h2 style="color: #8a4d76; margin-top: 0;">Your Session Details</h2>
                <p><strong>Reading Type:</strong> ${data.readingType}</p>
                <p><strong>Duration:</strong> ${data.duration} minutes</p>
                <p><strong>Price:</strong> ₹${data.price}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${formattedTime}</p>
            </div>
            
            <h3 style="color: #8a4d76;">Preparing for Your Reading</h3>
            <ul>
                <li>Find a quiet, comfortable space</li>
                <li>Have any questions ready</li>
                <li>Take a few deep breaths before we begin</li>
                <li>Keep an open mind and heart</li>
            </ul>
            
            <p>If you need to reschedule or have any questions, please reply to this email.</p>
            
            <div style="text-align: center; margin-top: 30px; color: #8a4d76;">
                <p>✨ Looking forward to our mystical connection ✨</p>
            </div>
        </div>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject || '✨ Your Tarot Reading Confirmation ✨',
        html: emailTemplate
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendBookingConfirmation };

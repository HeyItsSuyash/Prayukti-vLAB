const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const { sendEmail } = require('../services/emailService');

async function testEmail() {
    try {
        console.log('Testing email service with:', process.env.EMAIL_USER);
        const info = await sendEmail({
            to: process.env.EMAIL_USER,
            subject: 'Prayukti vLAB Email Test',
            text: 'This is a test email to verify SMTP configuration.'
        });
        console.log('Email sent successfully:', info.messageId);
        process.exit(0);
    } catch (error) {
        console.error('Email test failed:', error);
        process.exit(1);
    }
}

testEmail();

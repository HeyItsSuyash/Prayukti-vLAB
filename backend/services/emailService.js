const nodemailer = require('nodemailer');
const Setting = require('../models/Setting');

const getTransporter = async () => {
    const smtpConfig = await Setting.findOne({ key: 'SMTP_CONFIG' });
    
    const config = smtpConfig ? smtpConfig.value : {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true', // false for 587 (STARTTLS)
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    };

    return nodemailer.createTransport(config);
};

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const transporter = await getTransporter();
        const info = await transporter.sendMail({
            from: `"Prayukti vLAB" <${process.env.SMTP_USER || process.env.EMAIL_USER || 'no-reply@vlab.com'}>`,
            to,
            subject,
            text,
            html
        });
        return info;
    } catch (error) {
        console.error('Email send error:', error);
        throw error;
    }
};

const sendWelcomeEmail = async (user, password) => {
    const subject = 'Welcome to Prayukti vLAB';
    const html = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #4f46e5;">Welcome, ${user.fullName}!</h2>
            <p>Your account has been created successfully.</p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Login Details:</strong></p>
                <p>Email: ${user.email}</p>
                <p>Password: ${password}</p>
            </div>
            <p>Please login and change your password for security.</p>
            <a href="http://localhost:3000/login" style="display: inline-block; padding: 10px 20px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px;">Login Now</a>
        </div>
    `;
    return sendEmail({ to: user.email, subject, html });
};

const sendAnnouncement = async (to, title, content) => {
    return sendEmail({ 
        to, 
        subject: `Announcement: ${title}`, 
        html: `<div style="font-family: sans-serif;"><h3>${title}</h3><p>${content}</p></div>` 
    });
};

module.exports = {
    sendWelcomeEmail,
    sendAnnouncement,
    sendEmail
};

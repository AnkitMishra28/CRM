const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const data = {
            from: `CRM System <mailgun@${process.env.MAILGUN_DOMAIN}>`,
            to: to,
            subject: subject,
            text: text,
            html: html
        };

        const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendEmail }; 
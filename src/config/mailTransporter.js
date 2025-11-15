
const Brevo = require('@getbrevo/brevo');
const { BREVO_API_KEY, SENDER_EMAIL } = require('./secure');

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.authentications['apiKey'].apiKey =BREVO_API_KEY;
console.log(BREVO_API_KEY)

/**
 * Send email using Brevo (Sendinblue)
 * @param {Object} emaildata
 * @param {string} emaildata.email - Recipient email
 * @param {string} emaildata.subject - Email subject
 * @param {string} emaildata.html - Email body (HTML)
 */
const sendMail = async (emaildata) => {
  try {
    const sendSmtpEmail = {
      sender: {
        name: 'Blood Campus',            // Replace with your app or company name
        email: SENDER_EMAIL, // Verified sender in Brevo
      },
      to: [{ email: emaildata.email }],
      subject: emaildata.subject,
      htmlContent: emaildata.html,
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(` Email sent to ${emaildata.email}`);
  } catch (error) {
    console.error(' Failed to send email:', error.message);
    
  }
};

module.exports = { sendMail };

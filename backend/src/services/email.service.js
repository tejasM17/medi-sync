const axios = require('axios');

class EmailService {
  constructor() {
    this.serviceId = process.env.EMAILJS_SERVICE_ID;
    this.templateId = process.env.EMAILJS_TEMPLATE_ID;
    this.publicKey = process.env.EMAILJS_PUBLIC_KEY;
    this.privateKey = process.env.EMAILJS_PRIVATE_KEY;
  }

  async sendReportToPatient(patientEmail, patientName, reportTitle, reportContent) {
    try {
      const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
        service_id: this.serviceId,
        template_id: this.templateId,
        user_id: this.publicKey,
        accessToken: this.privateKey,   // For higher security
        template_params: {
          to_email: patientEmail,
          to_name: patientName || "Patient",
          report_title: reportTitle,
          report_summary: reportContent.substring(0, 500) + "...", // Limit size
          reply_to: "doctor@medisync.com"
        }
      });

      console.log("✅ Email sent via EmailJS");
      return { success: true, message: "Report sent successfully" };
    } catch (error) {
      console.error("❌ EmailJS Error:", error.response?.data || error.message);
      throw new Error("Failed to send email");
    }
  }
}

module.exports = new EmailService();

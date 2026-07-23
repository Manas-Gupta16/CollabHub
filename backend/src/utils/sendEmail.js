const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || "587"),
            secure: process.env.EMAIL_SECURE === "true",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `CollabHub <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
        };

        await transporter.sendMail(mailOptions);
    } else {
        console.log("\n=======================================================");
        console.log(`[PASSWORD RESET EMAIL] To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message:\n${options.message}`);
        console.log("=======================================================\n");
    }
};

module.exports = sendEmail;

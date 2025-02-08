import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
const sendEmail= async function(email, subject, message){
    // create reusable transporter object using the default SMTP transport
    let transporter= nodemailer.createTransport({
        service: "gmail",
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD, // `How to Generate an App Password for Gmail`
        },
    });

    // send email with defined transport object
    await transporter.sendMail({
        from: {
            name: "LMS Project",
            address: process.env.SMTP_FROM_EMAIL
        }, // sender address
        to: email, // user email
        subject: subject,
        html: message // html body
    });
}

export default sendEmail;
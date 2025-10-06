import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendOtpEmail(to, otp) {
    const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
    const info = await transporter.sendMail({
        from,
        to,
        subject: "Your University Registration OTP",
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
        html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    });
    return info.messageId;
}

export default transporter;

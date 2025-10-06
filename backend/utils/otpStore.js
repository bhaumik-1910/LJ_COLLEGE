// Simple in-memory store for OTPs and verified emails
// Note: For production, replace with a persistent store like Redis or MongoDB with TTL

const otpMap = new Map(); // email -> { otp, expiresAt }
const verifiedEmails = new Set(); // emails that passed OTP verification recently

export function setOtp(email, otp, ttlMs = 5 * 60 * 1000) {
    const expiresAt = Date.now() + ttlMs;
    otpMap.set(email.toLowerCase(), { otp: String(otp), expiresAt });
}

export function verifyOtp(email, otp) {
    const key = email.toLowerCase();
    const item = otpMap.get(key);
    if (!item) return false;
    const ok = Date.now() < item.expiresAt && String(otp) === item.otp;
    if (ok) {
        otpMap.delete(key);
        verifiedEmails.add(key);
        // Auto-remove verified mark after a short window
        setTimeout(() => verifiedEmails.delete(key), 10 * 60 * 1000);
    }
    return ok;
}

export function isVerified(email) {
    return verifiedEmails.has(email.toLowerCase());
}

export function clearVerification(email) {
    verifiedEmails.delete(email.toLowerCase());
}

import { createTransport } from "nodemailer";


/**
 * Send email using mailtrap
 * This is a dummy credentails from mailtrap
 */
export const transport = createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});




/* import nodemailer from "nodemailer";
import { transferableAbortController } from "util";


export async function sendMail ({to, subject, body}: {to:string , subject:string, body:string}) {

    const { SMTP_EMAIL, SMTP_GMAIL_PASS} = process.env;
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: SMTP_EMAIL,
            pass: SMTP_GMAIL_PASS,
        },
    });

    try {
        const testResult = await transport.verify();
        console.log("Test result of transport", testResult)
    } catch (error) {
        console.error("Error while verifying transport", error);
    }
}; */
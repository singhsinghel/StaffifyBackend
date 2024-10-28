import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
import 'dotenv/config'


const createTOken=(id)=>{
   return jwt.sign({id},process.env.JWT_SECRET)
}

const transporter=nodemailer.createTransport({
   service: 'gmail', // Or another service like 'SendGrid', 'Outlook', etc.
   auth: {
     user: process.env.EMAIL,
     pass: process.env.EMAIL_PASS
   }
})
const sendAdminEmail = async (adminEmail, newAdminEmail,subject,text) => {
   const mailOptions = {
     from: process.env.EMAIL, // Your email
     to: adminEmail, // Admin email
     subject: subject,
     text: text
   };
   try {
     await transporter.sendMail(mailOptions);
   } catch (error) {
     console.error('Error sending email:', error);
   }
 };

export {createTOken,sendAdminEmail}
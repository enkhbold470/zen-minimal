import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import {prisma} from '@/lib/prisma';

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export async function POST(req: Request) {
  const { username, laptopChoice, phoneNumber, email, productLink } = await req.json();

  // Save to Order table
  try {
    await prisma.order.create({
      data: {
        username,
        laptopChoice,
        phoneNumber,
        email,
        productLink,
      },
    });
  } catch (error) {
    console.error('Error saving order to database:', error);
    return NextResponse.json({ message: "Error saving order" }, { status: 500 });
  }

  // Send email
  if (!process.env.ZOHO_USER || !process.env.ZOHO_PASS) {
    console.error('❌ Environment variables ZOHO_USER or ZOHO_PASS not found!');
    return NextResponse.json({ message: "Email configuration error" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASS
    }
  });

  const mailOptions: MailOptions = {
    from: process.env.ZOHO_USER,
    to: email,
    subject: `Бүтээгдэхүүний хүсэлт: ${laptopChoice}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h1 style="font-size: 24px; color: #333333; margin-bottom: 20px;">Сайн байна уу, ${username},</h1>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 10px;">Таны ${laptopChoice} бүтээгдэхүүний сонирхол амжилттай бүртгэгдлээ. Баярлалаа.</p>
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 10px;">Таны утасны дугаар: <strong>${phoneNumber}</strong></p>
          ${productLink ? `<p style="font-size: 16px; line-height: 1.5; margin-bottom: 10px;">Бүтээгдэхүүний линк: <a href="${productLink}" style="color: #007bff; text-decoration: none;">${productLink}</a></p>` : ''}
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 10px;">Бид тантай тун удахгүй холбогдох болно.</p>
        </div>

        <div style="margin-top: 20px; border-top: 1px solid #eeeeee; padding-top: 20px;">
          <p style="font-size: 14px; color: #555555; margin-bottom: 5px;">Хүндэтгэсэн,</p>
          <p style="font-size: 16px; font-weight: bold; color: #333333;">Zen Online Shop</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: "Error sending email" }, { status: 500 });
  }

  return NextResponse.json({ message: "Success" });
}

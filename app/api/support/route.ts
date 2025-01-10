import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: Request) {
  try {
    const { name, email, message, captchaToken } = await request.json()

    // Verify hCaptcha token
    const hcaptchaVerifyUrl = `https://hcaptcha.com/siteverify`
    const hcaptchaResponse = await fetch(hcaptchaVerifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `response=${captchaToken}&secret=${process.env.HCAPTCHA_SECRET_KEY}`,
    })
    const hcaptchaData = await hcaptchaResponse.json()

    if (!hcaptchaData.success) {
      return NextResponse.json({ error: 'Invalid captcha' }, { status: 400 })
    }

    // Send notification email to Hackeroso team
    await resend.emails.send({
      from: 'Hackeroso Support <hello@hackeroso.com>',
      to: 'hello@hackeroso.com',
      subject: 'New Support Message',
      html: `
        <h1>New Support Message</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    // Send thank you email to the user
    await resend.emails.send({
      from: 'Hackeroso Support <hello@hackeroso.com>',
      to: email,
      subject: 'Thank you for contacting Hackeroso',
      html: `
        <h1>Thank you for contacting Hackeroso</h1>
        <p>Dear ${name},</p>
        <p>We have received your message and appreciate you taking the time to reach out to us. Our team will review your inquiry and get back to you as soon as possible.</p>
        <p>Best regards,</p>
        <p>The Hackeroso Team</p>
      `,
    })

    return NextResponse.json({ message: 'Emails sent successfully' })
  } catch (error) {
    console.error('Error sending emails:', error)
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 })
  }
}


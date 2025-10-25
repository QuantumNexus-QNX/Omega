import { NextResponse } from 'next/server'
import { z } from 'zod'

const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  message: z.string().min(5, 'Message must be at least 5 characters').max(5000),
})

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => ({}))
    const parsed = ContactSchema.safeParse(data)

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { name, email, message } = parsed.data

    // TODO: Integrate with email service (Resend/Postmark/SES)
    // For now, log the contact form submission
    console.log('CONTACT_FORM_SUBMISSION', {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      to: 'link@trivector.ai',
    })

    // In production, you would send an email here:
    // await sendEmail({
    //   to: 'link@trivector.ai',
    //   from: 'noreply@trivector.ai',
    //   subject: `Contact Form: ${name}`,
    //   text: `From: ${name} <${email}>\n\n${message}`
    // })

    return NextResponse.json({
      ok: true,
      message: 'Thank you for your message. We will get back to you soon!',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    )
  }
}

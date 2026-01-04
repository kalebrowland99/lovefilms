import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  console.log('API route hit!');
  
  try {
    const formData = await request.json();
    
    console.log('Form data received:', formData);

    // Send email using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const { data, error } = await resend.emails.send({
          from: 'Wedding Inquiries <contact@yourlovefilms.com>',
          to: 'hi@yourlovefilms.com',
          subject: `New Wedding Inquiry from ${formData.name}`,
          html: `
            <h2>New Wedding Inquiry Form Submission</h2>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            <p><strong>Fiance's Name:</strong> ${formData.fianceName}</p>
            <p><strong>Wedding Date:</strong> ${formData.weddingDate}</p>
            <p><strong>Wedding Venue:</strong> ${formData.venue}</p>
            <p><strong>Videographer Booked:</strong> ${formData.videographer}</p>
            <hr />
            <p><small>Submitted from yourlovefilms.com/contact</small></p>
          `,
        });

        if (error) {
          console.error('Resend error:', error);
          return NextResponse.json({ 
            success: false, 
            message: 'Failed to send email. Please email us directly at hi@yourlovefilms.com' 
          }, { status: 500 });
        }

        console.log('Email sent successfully:', data);
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Continue even if email fails
      }
    } else {
      console.warn('RESEND_API_KEY not set - email not sent');
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Thank you! We\'ll be in touch within 30 minutes!' 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again or email us directly at hi@yourlovefilms.com' },
      { status: 500 }
    );
  }
}

// Add OPTIONS method for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


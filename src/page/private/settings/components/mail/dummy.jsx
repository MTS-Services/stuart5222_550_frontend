export const initialTemplates = [
  {
    id: 1,
    name: "welcome_email",
    subject: "👋 Welcome to Our Platform, {{userName}}!",
    body: "Hey {{userName}}, welcome aboard! We're thrilled to have you join our growing community. Explore your dashboard and start your journey today!",
    html_template: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{{subject}}</title>
      </head>
      <body style="font-family: Arial, sans-serif; background: #f3f4f6; margin: 0; padding: 0;">
        <div style="max-width:600px; margin:40px auto; background:#ffffff; padding:30px; border-radius:10px; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
          <h1 style="color:#4F46E5; text-align:center;">Welcome, {{userName}} 🎉</h1>
          <p style="color:#333333; font-size:16px; line-height:1.6;">{{body}}</p>
          <div style="text-align:center; color:#777; font-size:12px; margin-top:30px; border-top:1px solid #ddd; padding-top:10px;">
            © {{currentYear}} Our Platform. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `,
    is_active: true,
    updated_at: "2025-11-07T10:00:00.000Z",
    created_at: "2025-11-07T09:00:00.000Z",
  },
  {
    id: 2,
    name: "password_reset",
    subject: "🔐 Reset Your Password, {{userName}}",
    body: "Hi {{userName}}, we received a request to reset your password. Click the button below to set a new one. If you didn’t request this, please ignore this message.",
    html_template: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{{subject}}</title>
      </head>
      <body style="font-family:Arial, sans-serif; background:#fefefe; margin:0; padding:0;">
        <div style="max-width:600px; margin:40px auto; background:#ffffff; padding:30px; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.1);">
          <h2 style="color:#EF4444; text-align:center;">Password Reset Request</h2>
          <p style="color:#333333; font-size:16px; line-height:1.6;">{{body}}</p>
          <div style="text-align:center; margin-top:20px;">
            <a href="{{resetLink}}" style="display:inline-block; background:#EF4444; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold;">Reset Password</a>
          </div>
          <div style="text-align:center; color:#999; font-size:12px; margin-top:30px; border-top:1px solid #eee; padding-top:10px;">
            © {{currentYear}} Secure Auth. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `,
    is_active: true,
    updated_at: "2025-11-07T10:01:00.000Z",
    created_at: "2025-11-07T09:01:00.000Z",
  },
  {
    id: 3,
    name: "promotion_offer",
    subject: "🔥 Exclusive Offer Just for You!",
    body: "Hey {{userName}}, here’s your special reward — enjoy 20% off your next purchase! Use the code WELCOME20 at checkout before it expires.",
    html_template: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{{subject}}</title>
      </head>
      <body style="font-family:Poppins, sans-serif; background:#fff8e1; margin:0; padding:0;">
        <div style="max-width:600px; margin:30px auto; background:white; border-radius:10px; padding:40px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
          <h1 style="color:#F59E0B;">Special Offer 🎁</h1>
          <p style="color:#333333; font-size:16px; line-height:1.6;">{{body}}</p>
          <div style="background:#F59E0B; color:white; padding:10px 20px; display:inline-block; border-radius:6px; margin-top:20px; font-size:18px; font-weight:bold;">WELCOME20</div>
          <div style="font-size:12px; color:#777; margin-top:40px; border-top:1px solid #eee; padding-top:10px;">
            © {{currentYear}} Promo World. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `,
    is_active: true,
    updated_at: "2025-11-07T10:02:00.000Z",
    created_at: "2025-11-07T09:02:00.000Z",
  },
  {
    id: 4,
    name: "registration_approved",
    subject: "🎉 Welcome to QR Dating App - Registration Approved!",
    body: "🎉 Fantastic news! Your registration has been approved and you're now part of our exclusive QR Dating community. You can create your profile and start making amazing connections today!",
    html_template: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{{subject}}</title>
      </head>
      <body style="font-family:Arial, sans-serif; margin:0; padding:0; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="max-width:600px; margin:20px auto; background-color:#ffffff; padding:40px; border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,0.1);">
          <div style="text-align:center; padding:20px 0; margin-bottom:30px;">
            <h1 style="color:#667eea; font-size:32px; margin:0; font-weight:bold;">✨ QR Dating App</h1>
          </div>
          <div style="font-size:18px; line-height:1.8; color:#333333;">
            <div style="background:linear-gradient(135deg, #4CAF50, #45a049); color:white; padding:30px; border-radius:12px; margin:25px 0; text-align:center;">
              <h2 style="margin:0;">🎉 Congratulations {{userName}}!</h2>
              <p style="margin:10px 0 0;">Your registration has been approved!</p>
            </div>
            <p style="margin-top:20px;">{{body}}</p>
          </div>
          <div style="text-align:center; margin-top:40px; padding-top:20px; border-top:2px solid #667eea; font-size:12px; color:#666;">
            © {{currentYear}} QR Dating App. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `,
    is_active: true,
    updated_at: "2025-11-07T09:32:32.968Z",
    created_at: "2025-11-07T09:30:33.859Z",
  },
];

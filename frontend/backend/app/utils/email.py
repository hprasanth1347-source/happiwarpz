import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

def send_email_raw(to_email: str, subject: str, html_content: str) -> bool:
    """Helper to dispatch HTML emails via configured SMTP server."""
    try:
        if settings.SMTP_USER and settings.SMTP_PASSWORD:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_USER}>"
            msg["To"] = to_email

            part = MIMEText(html_content, "html", "utf-8")
            msg.attach(part)

            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, to_email, msg.as_string())
            server.quit()
            print(f"[Email Sent] Successfully sent email to {to_email}")
            return True
        else:
            safe_subject = subject.encode('ascii', 'ignore').decode('ascii')
            print(f"\n=======================================================")
            print(f"[EMAIL NOTIFICATION LOG] (SMTP User not set in .env)")
            print(f"To: {to_email}")
            print(f"Subject: {safe_subject}")
            print(f"=======================================================\n")
            return False
    except Exception as e:
        print(f"[SMTP Error] Email dispatch failed to {to_email}: {e}")
        return False

def send_login_notification_email(to_email: str, user_name: str, ip_address: str = "127.0.0.1", user_agent: str = "Web Browser") -> bool:
    """Sends a security alert email whenever any user logs into their account."""
    subject = "Security Alert: New Sign-In to Your Happiwrapz Account 🌸"
    login_time = datetime.now().strftime("%B %d, %Y at %I:%M %p")
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Account Login Alert</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #050505; color: #F8F1E7; padding: 40px 20px; margin: 0;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #0D0D0D; border: 1px solid #221D22; border-radius: 20px; padding: 32px; text-align: center;">
        <h1 style="color: #F8F1E7; font-size: 24px; margin-bottom: 8px;">Happi<span style="color: #D00000;">wrapz</span></h1>
        <p style="color: #C9A24A; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 0;">Moments Deserve Flowers</p>

        <div style="background-color: #1A0A0A; border: 1px solid #C9A24A; border-radius: 16px; padding: 20px; margin: 24px 0; text-align: left;">
          <h2 style="color: #F4D068; font-size: 16px; margin: 0 0 12px 0; text-align: center;">Security Alert: Successful Sign-In</h2>
          <p style="color: #F8F1E7; font-size: 13px; margin: 0 0 10px 0;">Hello <strong>{user_name}</strong>,</p>
          <p style="color: #A39A90; font-size: 12px; margin: 0 0 16px 0; line-height: 1.5;">
            Your Happiwrapz account was just signed in to.
          </p>

          <table style="width: 100%; font-size: 12px; border-top: 1px solid #221D22; padding-top: 12px; color: #A39A90;">
            <tr>
              <td style="padding: 4px 0; color: #C9A24A; font-weight: bold;">Account:</td>
              <td style="padding: 4px 0; color: #F8F1E7;">{to_email}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #C9A24A; font-weight: bold;">Date & Time:</td>
              <td style="padding: 4px 0; color: #F8F1E7;">{login_time}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #C9A24A; font-weight: bold;">Location/IP:</td>
              <td style="padding: 4px 0; color: #F8F1E7;">{ip_address}</td>
            </tr>
          </table>
        </div>

        <p style="color: #A39A90; font-size: 12px; line-height: 1.6; margin-bottom: 24px;">
          If this was you, no action is needed! If you didn't log in, please reset your password immediately.
        </p>

        <a href="{settings.FRONTEND_URL}/forgot-password" style="background: linear-gradient(135deg, #D00000 0%, #8B0000 100%); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
          Secure Account & Reset Password →
        </a>

        <p style="color: #666666; font-size: 10px; margin-top: 30px;">
          Happiwrapz Handmade Flowers & Gifts • Handcrafted with love
        </p>
      </div>
    </body>
    </html>
    """
    return send_email_raw(to_email, subject, html_content)

def send_order_confirmation_email(to_email: str, customer_name: str, order_number: str, total_amount: float, razorpay_payment_id: str = "") -> bool:
    """Sends an Order Confirmation Email upon successful payment verification."""
    subject = f"Order Confirmed #{order_number} — Happiwrapz Handmade Flowers 🎉"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmed — Happiwrapz</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #050505; color: #F8F1E7; padding: 40px 20px; margin: 0;">
      <div style="max-width: 550px; margin: 0 auto; background-color: #0D0D0D; border: 1px solid #C9A24A; border-radius: 20px; padding: 32px; text-align: center;">
        <h1 style="color: #F8F1E7; font-size: 24px; margin-bottom: 8px;">Happi<span style="color: #D00000;">wrapz</span></h1>
        <p style="color: #C9A24A; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 0;">Order Payment Confirmed ✓</p>

        <h2 style="color: #F8F1E7; font-size: 20px; margin-top: 24px;">Thank you for your order, {customer_name}!</h2>
        <p style="color: #A39A90; font-size: 13px; line-height: 1.6;">
          Your order <strong>#{order_number}</strong> has been successfully placed and payment verified. Our artisans have started handcrafting your floral gift!
        </p>

        <div style="background-color: #181216; border: 1px solid #221D22; border-radius: 12px; padding: 20px; text-align: left; margin: 24px 0;">
          <p style="margin: 4px 0; color: #A39A90; font-size: 12px;"><strong>Order Number:</strong> <span style="color: #F8F1E7;">#{order_number}</span></p>
          <p style="margin: 4px 0; color: #A39A90; font-size: 12px;"><strong>Total Amount Paid:</strong> <span style="color: #C9A24A; font-weight: bold;">₹{total_amount:.2f}</span></p>
          <p style="margin: 4px 0; color: #A39A90; font-size: 12px;"><strong>Payment Status:</strong> <span style="color: #4CAF50; font-weight: bold;">PAID ✓</span></p>
          {f'<p style="margin: 4px 0; color: #A39A90; font-size: 12px;"><strong>Razorpay Payment ID:</strong> <span style="color: #F8F1E7;">{razorpay_payment_id}</span></p>' if razorpay_payment_id else ''}
        </div>

        <div style="margin: 30px 0;">
          <a href="{settings.FRONTEND_URL}/account/orders" style="background: linear-gradient(135deg, #D00000 0%, #8B0000 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
            Track Your Order →
          </a>
        </div>

        <p style="color: #666666; font-size: 10px; margin-top: 30px;">
          Happiwrapz Handmade Flowers & Gifts • Handcrafted with love
        </p>
      </div>
    </body>
    </html>
    """
    return send_email_raw(to_email, subject, html_content)

def send_welcome_email(to_email: str, user_name: str) -> bool:
    """Sends a welcome email whenever a new user registers an account."""
    subject = "Welcome to Happiwrapz Handmade Flowers ❤️"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to Happiwrapz</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #050505; color: #F8F1E7; padding: 40px 20px; margin: 0;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #0D0D0D; border: 1px solid #221D22; border-radius: 20px; padding: 32px; text-align: center;">
        <h1 style="color: #F8F1E7; font-size: 24px; margin-bottom: 8px;">Happi<span style="color: #D00000;">wrapz</span></h1>
        <p style="color: #C9A24A; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 0;">Moments Deserve Flowers</p>

        <h2 style="color: #F8F1E7; font-size: 20px; margin-top: 24px;">Welcome, {user_name}! ❤️</h2>
        <p style="color: #A39A90; font-size: 13px; line-height: 1.6; margin-bottom: 24px;">
          Thank you for joining <strong>Happiwrapz</strong>! We create everlasting handmade rose bouquets, sunflowers, cute keychains, and personalized custom hampers.
        </p>

        <div style="margin: 30px 0;">
          <a href="{settings.FRONTEND_URL}/shop" style="background: linear-gradient(135deg, #C9A24A 0%, #F4D068 100%); color: #000000; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
            Explore Floral Collections →
          </a>
        </div>

        <p style="color: #666666; font-size: 11px; margin-top: 30px;">
          Happiwrapz Handmade Flowers & Gifts
        </p>
      </div>
    </body>
    </html>
    """
    return send_email_raw(to_email, subject, html_content)

def send_password_reset_email(to_email: str, reset_token: str) -> bool:
    """Sends a password reset email."""
    reset_url = f"{settings.FRONTEND_URL}/reset-password/{reset_token}"
    subject = "Reset Your Happiwrapz Password ❤️"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Happiwrapz Password</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #050505; color: #F8F1E7; padding: 40px 20px; margin: 0;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #0D0D0D; border: 1px solid #221D22; border-radius: 20px; padding: 32px; text-align: center;">
        <h1 style="color: #F8F1E7; font-size: 24px; margin-bottom: 8px;">Happi<span style="color: #D00000;">wrapz</span></h1>
        <p style="color: #C9A24A; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 0;">Moments Deserve Flowers</p>

        <h2 style="color: #F8F1E7; font-size: 20px; margin-top: 24px;">Reset Your Password</h2>
        <p style="color: #A39A90; font-size: 13px; line-height: 1.6; margin-bottom: 24px;">
          We received a request to reset your password for <strong>{to_email}</strong>. Click the button below to choose a new password:
        </p>

        <div style="margin: 30px 0;">
          <a href="{reset_url}" style="background: linear-gradient(135deg, #D00000 0%, #8B0000 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
            Reset Password Now →
          </a>
        </div>

        <p style="color: #666666; font-size: 11px; margin-top: 30px;">
          If you did not request a password reset, you can safely ignore this email.<br>
          Link expires in 24 hours.
        </p>
      </div>
    </body>
    </html>
    """
    return send_email_raw(to_email, subject, html_content)

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import get_settings

settings = get_settings()

class EmailService:
    @staticmethod
    def send_email(to_email: str, subject: str, body_html: str):
        if not settings.smtp_user or not settings.smtp_password:
            print("SMTP credentials not set. Email not sent.")
            print(f"Subject: {subject}")
            print(f"To: {to_email}")
            print(f"Body: {body_html}")
            return

        msg = MIMEMultipart()
        msg['From'] = f"{settings.smtp_from_name} <{settings.smtp_from_email}>"
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body_html, 'html'))

        try:
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
                if settings.smtp_tls:
                    server.starttls()
                server.login(settings.smtp_user, settings.smtp_password)
                server.send_message(msg)
                print(f"Email sent successfully to {to_email}")
        except Exception as e:
            print(f"Failed to send email: {e}")

    @staticmethod
    def send_password_reset_email(to_email: str, token: str):
        # In production, use your actual frontend URL
        reset_link = f"http://localhost:3000/reset-password?token={token}"
        
        subject = "Reset Your Password - Pharmacy Management System"
        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
                    <h2 style="color: #4f46e5;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password for your Pharmacy Management System account.</p>
                    <p>Click the button below to set a new password. This link will expire in 1 hour.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_link}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999;">Pharmacy Management System · 123 Health St · Healthcare City</p>
                </div>
            </body>
        </html>
        """
        EmailService.send_email(to_email, subject, body)

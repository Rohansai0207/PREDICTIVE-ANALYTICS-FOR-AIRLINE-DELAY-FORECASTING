import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

EMAIL_ADDRESS = "yashwanthkasula2504@gmail.com"         # ✅ Replace with your Gmail
EMAIL_PASSWORD = "bfqe fqou icxb mofn"      # ✅ App Password from Google

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

def send_otp_email(to, otp):
    subject = "Your OTP Code"
    body = f"Your OTP is: {otp}"

    msg = MIMEMultipart()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"✅ OTP sent to {to}")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")

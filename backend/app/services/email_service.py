import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
ALERT_EMAIL = os.getenv("ALERT_EMAIL")


def send_alert_email(
    order_number,
    risk,
    predicted_tat
):

    try:

        msg = MIMEMultipart()

        msg["From"] = EMAIL_USER
        msg["To"] = ALERT_EMAIL

        msg["Subject"] = (
            f"AI Alert - {order_number}"
        )

        body = f"""
Order: {order_number}

Risk Level: {risk}

Predicted TAT:
{predicted_tat} hrs

Immediate attention required.
"""

        msg.attach(
            MIMEText(body, "plain")
        )

        server = smtplib.SMTP(
            "smtp.gmail.com",
            587
        )

        server.starttls()

        server.login(
            EMAIL_USER,
            EMAIL_PASSWORD
        )

        server.send_message(msg)

        server.quit()

        return True

    except Exception as e:

        print("EMAIL ERROR:", e)

        return False
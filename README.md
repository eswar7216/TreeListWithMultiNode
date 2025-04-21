# Webex Bot for Account Support

This bot handles a fixed set of user support tasks via Webex:

## Supported Questions
- ✅ Is user ID `<userid>` active?
- ✅ Resend welcome email?
- ✅ Check if user `<userid>` is account locked?

All actions require confirmation from the user before executing.

## Setup
```bash
pip install -r requirements.txt
python webex_bot/main.py
```

## Webhook
Configure your Webex bot to POST to: `http://<your-host>:5000/webhook`
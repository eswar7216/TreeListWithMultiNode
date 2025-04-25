hi y# Webex Bot for Account Support

This bot handles a fixed set of user support tasks via Webex:

## Supported Questions
- ✅ Is user ID `<userid>` active?
- ✅ Resend welcome email?
- ✅ Check if user `<userid>` is account lo
All actions require confirmation from the user before executing.

## Setup
```bash
pip install -r requirements.txt
python webex_bot/main.py
`

In one of the most ambitious and collaborative technical efforts across our organization, our working group tackled the company-wide Evernorth rebranding by modernizing nearly 100 web applications under tight timelines and high complexity. The group set a gold standard for scalable design, client customization, and future-ready architecture.



Short Description (for award form summary):

The Evernorth Rebranding Technical Working Group led a time-sensitive, large-scale modernization across 100+ web applications by replacing legacy hardcoded styles with token-based theming and reusable design components. This cross-functional group delivered a dynamic, scalable theming system that supports client customization, accelerates development, and sets the foundation for future brand transformations.

⸻

Long Description (for detailed nomination):

The Evernorth Rebranding Technical Working Group was formed to address one of the most complex and time-sensitive challenges in our organization—applying a unified brand identity across nearly 100 web applications. Previously, applications relied on hardcoded styles with no centralized theming system, making rebranding costly, inconsistent, and manual.

The team tackled this by upgrading to UIC v14.7 and implementing a robust design token architecture. This enabled consistent styling across all applications and made it possible to support dynamic theming for client-specific branding needs. Through the adoption of reusable UIC components and the Evernorth Figma Library, the team significantly reduced rebranding effort and turnaround time.

Recognizing the need for long-term scalability, the group also introduced automated token governance and architecture improvements to reduce tech debt and prevent regressions. Their solution empowered teams to seamlessly adopt future themes without rework, offering a forward-compatible platform.

The success of this working group lies not just in technical excellence but also in the tight coordination across multiple teams and applications. This effort has transformed how branding is approached and delivered across the enterprise—efficiently, consistently, and at scale.


## Webhook
Configure your Webex bot to POST to: `http://<your-host>:5000/webhook`
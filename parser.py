import re

def parse_intent(text):
    text = text.lower()

    if match := re.search(r"is user id (\w+) active", text):
        return "check_active", {"user_id": match.group(1)}
    if "resend welcome email" in text:
        return "resend_email", {}
    if match := re.search(r"check if user (\w+) is account locked", text):
        return "check_locked", {"user_id": match.group(1)}

    return "unknown", {}
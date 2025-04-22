from services.ai_gateway import process_query
from utils.confirmation_store import set_pending_action, get_pending_action, clear_pending_action
from handlers.actions import check_user_active, resend_welcome_email, check_account_locked

def handle_message(user_text, user_id):
    user_text = user_text.lower()

    pending = get_pending_action(user_id)
    if pending:
        if user_text in ["yes", "y"]:
            intent, entities = pending["intent"], pending["entities"]
            clear_pending_action(user_id)

            if intent == "check_active":
                return check_user_active(entities)
            elif intent == "resend_email":
                return resend_welcome_email(entities)
            elif intent == "check_locked":
                return check_account_locked(entities)
        elif user_text in ["no", "n"]:
            clear_pending_action(user_id)
            return "❌ Action cancelled."
        else:
            return "🔁 Please reply with `yes` or `no` to confirm."

    parsed = process_query(user_text)
    intent = parsed.get("intent")
    parameters = parsed.get("parameters", {})

    if intent == "check_active":
        set_pending_action(user_id, intent, parameters)
        return f"❓Do you want me to check if user `{parameters['user_id']}` is active? Reply `yes` or `no`."
    elif intent == "resend_email":
        set_pending_action(user_id, intent, parameters)
        return "❓Do you want me to resend the welcome email? Reply `yes` or `no`."
    elif intent == "check_locked":
        set_pending_action(user_id, intent, parameters)
        return f"❓Do you want me to check if user `{parameters['user_id']}` is locked? Reply `yes` or `no`."

    return "❌ Sorry, I can only help with: user activity, welcome emails, and account lock checks."
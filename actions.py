from services.okta_service import is_user_active, is_account_locked
from services.db_service import send_welcome_email

def check_user_active(entities):
    user_id = entities.get("user_id")
    return f"✅ User {user_id} is {'active' if is_user_active(user_id) else 'inactive'}."

def resend_welcome_email(_):
    send_welcome_email()
    return "📧 Welcome email resent."

def check_account_locked(entities):
    user_id = entities.get("user_id")
    return f"🔒 User {user_id}'s account is {'locked' if is_account_locked(user_id) else 'not locked'}."
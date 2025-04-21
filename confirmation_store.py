from collections import defaultdict

confirmation_cache = defaultdict(dict)

def set_pending_action(user_id, intent, entities):
    confirmation_cache[user_id] = {"intent": intent, "entities": entities}

def get_pending_action(user_id):
    return confirmation_cache.get(user_id)

def clear_pending_action(user_id):
    confirmation_cache.pop(user_id, None)
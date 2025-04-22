import requests

AI_GATEWAY_URL = "http://your-ai-gateway/parse"
HEADERS = {"Content-Type": "application/json"}

def process_query(user_query, history=None):
    payload = {
        "messages": history or [],
        "user_query": user_query
    }
    response = requests.post(AI_GATEWAY_URL, json=payload, headers=HEADERS)
    return response.json()
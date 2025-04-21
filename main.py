from flask import Flask, request
from handlers.dispatcher import handle_message

app = Flask(__name__)

@app.route("/webhook", methods=["POST"])
def webhook():
    message = request.json
    user_text = message.get("text", "")
    user_id = message.get("personId", "")

    response = handle_message(user_text.strip(), user_id)
    return {"text": response}, 200

if __name__ == "__main__":
    app.run(port=5000)
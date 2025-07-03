from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/generate_reply", methods=["POST"])
def generate_reply():
    data = request.get_json()
    print("📥 Raw received:", data)

    email_thread = data.get("email_thread", "")
    user_idea = data.get("user_idea", "")

    print("📩 Email thread length:", len(email_thread))
    print("💡 User idea length:", len(user_idea))
    

    if not email_thread or not user_idea:
        return jsonify({"error": "Missing email_thread or user_idea"}), 400

    prompt = f"""
You are an expert email writer.
Below is an email thread between multiple people:

\"\"\"{email_thread}\"\"\"

The user wants to reply to this thread with the following intent:
\"\"\"{user_idea}\"\"\"

Write a professional, polite, and context-aware reply email in English.
You can assume the user will send it via Gmail's "Reply All" function.
"""
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        print("📥 Email thread:", email_thread[:100])
        print("🧠 User idea:", user_idea)
        reply = response.choices[0].message.content.strip()
        print("📤 Reply from GPT:", reply)

        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5111, debug=True)

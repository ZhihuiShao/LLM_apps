import requests

data = {
    "email_thread": "Hi team, what do you think of Thursday?",
    "user_idea": "I want to confirm I'm available and thank them."
}

response = requests.post("http://127.0.0.1:5111/generate_reply", json=data)
print("Status:", response.status_code)
print("Response:", response.text)

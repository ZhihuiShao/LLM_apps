# 📬 Gmail GPT Reply Assistant

A Tampermonkey-based browser extension that helps you reply to emails in Gmail using ChatGPT (via a local backend). This tool extracts the email thread, asks for your intended message, and auto-generates a complete reply that is inserted into the Gmail editor.

---

## ✨ Features

- 🧠 GPT-powered email replies
- 📩 Supports Gmail's native interface
- 💬 Prompt customization (your intention or tone)
- 🔒 Runs fully locally via a Flask backend
- ⚙️ No browser extension required (pure JavaScript/Tampermonkey)

---

## 📦 Components

- **Frontend**: Tampermonkey userscript (`Gmail-GPT-Reply-Assistant.user.js`)
- **Backend**: Flask API (`generate_reply` endpoint using OpenAI GPT model)

---

## 🚀 Getting Started

### 1. Install Tampermonkey

- [Install Tampermonkey for Chrome](https://tampermonkey.net/?ext=dhdg&browser=chrome)
- Or [for Firefox](https://tampermonkey.net/?ext=dhdg&browser=firefox)

---

### 2. Add the Userscript

- Create a new script in Tampermonkey.
- Paste the contents of `gmail_GPT_script.js`.
- Save the script.

✅ The button `✉️ GPT Reply` will appear when you open a Gmail reply editor.

---

### 3. Set Up the Backend

#### Requirements:

- Python 3.9+
- `openai` package
- `Flask`, `python-dotenv`

#### Setup Instructions:

```bash
git clone xx
cd gmail_back
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

// ==UserScript==
// @name         Gmail GPT Reply Assistant v0.4
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Smartly reply to Gmail threads using local GPT server with improved UI
// @match        https://mail.google.com/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

(function () {
    "use strict";
  
    // 🧠 提取最近邮件内容（最多5条）
    function extractThreadText() {
      const rawBlocks = Array.from(document.querySelectorAll('div[role="listitem"] div[data-message-id]'));
      const results = [];
  
      for (const block of rawBlocks) {
        const textNodes = block.querySelectorAll('div[dir="ltr"]');
        let message = '';
        textNodes.forEach(n => {
          const t = n.innerText.trim();
          if (t.length > 20) message += t + '\n\n';
        });
        if (message.length > 50) results.push(message.trim());
      }
  
      return results.slice(-5).join('\n\n');
    }
  
    // 插入 GPT 按钮
    function insertGptButton() {
      const editorBox = document.querySelector('div[aria-label="Message Body"]');
      const container = editorBox?.parentElement?.parentElement;
  
      if (!editorBox || !container || document.getElementById("gpt-reply-btn")) return;
  
      const button = document.createElement("button");
      button.innerText = "✉️ GPT Reply";
      button.id = "gpt-reply-btn";
      button.style.margin = "10px";
      button.style.padding = "6px 12px";
      button.style.fontSize = "14px";
      button.style.backgroundColor = "#1a73e8";
      button.style.color = "white";
      button.style.border = "none";
      button.style.borderRadius = "5px";
      button.style.cursor = "pointer";
  
      button.onclick = () => showGptInputDialog(editorBox);
      container.appendChild(button);
    }
  
    // 显示 GPT 输入弹窗（避免 innerHTML 安全错误）
    function showGptInputDialog(editorBox) {
      if (document.getElementById("gpt-reply-dialog")) return;
  
      const dialog = document.createElement("div");
      dialog.id = "gpt-reply-dialog";
      Object.assign(dialog.style, {
        position: "fixed",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "9999",
        background: "white",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        width: "400px",
      });
  
      const title = document.createElement("div");
      title.textContent = "💡 What do you want to say in the reply?";
      title.style.fontSize = "16px";
      title.style.marginBottom = "10px";
  
      const textarea = document.createElement("textarea");
      textarea.id = "gpt-reply-input";
      Object.assign(textarea.style, {
        width: "100%",
        height: "100px",
        fontSize: "14px"
      });
  
      const buttonBar = document.createElement("div");
      buttonBar.style.marginTop = "10px";
      buttonBar.style.textAlign = "right";
  
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.style.marginRight = "10px";
      cancelBtn.onclick = () => dialog.remove();
  
      const confirmBtn = document.createElement("button");
      confirmBtn.textContent = "Confirm";
      Object.assign(confirmBtn.style, {
        background: "#1a73e8",
        color: "white",
        border: "none",
        padding: "6px 12px",
        borderRadius: "4px"
      });
  
      confirmBtn.onclick = () => {
        const idea = textarea.value.trim();
        if (!idea) {
          alert("⚠️ Please enter something.");
          return;
        }
  
        const threadTexts = extractThreadText();
        if (!threadTexts) {
          alert("⚠️ Could not find email thread text.");
          return;
        }
  
        editorBox.innerText = "⏳ Generating reply with GPT...";
        dialog.remove();
  
        GM_xmlhttpRequest({
          method: "POST",
          url: "http://localhost:5111/generate_reply",
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify({
            email_thread: threadTexts,
            user_idea: idea
          }),
          onload: function (response) {
            try {
              const json = JSON.parse(response.responseText);
              const reply = json.reply || "⚠️ GPT did not return a reply.";
              editorBox.innerText = reply;
            } catch (e) {
              editorBox.innerText = "❌ GPT response error: " + e.message;
            }
          },
          onerror: function () {
            editorBox.innerText = "❌ Failed to connect to local GPT server.";
          }
        });
      };
  
      buttonBar.appendChild(cancelBtn);
      buttonBar.appendChild(confirmBtn);
      dialog.appendChild(title);
      dialog.appendChild(textarea);
      dialog.appendChild(buttonBar);
      document.body.appendChild(dialog);
  
      setTimeout(() => textarea.focus(), 100);
    }
  
    // 监听 Gmail DOM 变化，动态插入按钮
    const observer = new MutationObserver(() => {
      insertGptButton();
    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  })();
  
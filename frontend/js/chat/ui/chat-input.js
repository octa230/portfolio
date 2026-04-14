//chat-input.js

import ChatController from "../core/chat-controller.js";

const ChatInput = (() => {
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");

  function init() {
    sendBtn.onclick = send;

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });
  }

  function send() {
    const text = input.value.trim();
    if (!text) return;

    ChatController.send(text);
    input.value = "";
  }

  return { init };
})();

export default ChatInput;
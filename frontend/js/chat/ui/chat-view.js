// chat-view.js
import ChatMessages from "./chat-messages.js";
import ChatInput from "./chat-input.js";
import QuickReplies from "./quick-replies.js";

const ChatView = (() => {
  function init() {
    // Toggle open/close
    const toggle = document.getElementById("chat-toggle");
    const closeBtn = document.getElementById("chat-close-btn");
    const fab = document.getElementById("chat-fab");

    fab.classList.add("chat-open"); 

    toggle.addEventListener("click", () => {
      fab.classList.toggle("chat-open");
      toggle.setAttribute("aria-expanded", fab.classList.contains("chat-open"));
    });

    closeBtn.addEventListener("click", () => {
      fab.classList.remove("chat-open");
      toggle.setAttribute("aria-expanded", "false");
    });

    // Rest of init
    ChatMessages.init();
    ChatInput.init();
    QuickReplies.init();
  }

  return { init };
})();

export default ChatView;
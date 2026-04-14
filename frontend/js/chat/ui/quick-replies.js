import ChatController from "../core/chat-controller.js";

const QuickReplies = (() => {
  const container = document.getElementById("quick-replies");

  function init() {
    container.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-prompt]");
      if (!btn) return;

      ChatController.send(btn.dataset.prompt);
    });
  }

  return { init };
})();

export default QuickReplies;
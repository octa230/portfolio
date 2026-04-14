//chat-controller.js
import ChatStore from "./chat-store.js";
import AIService from "../services/ai-service.js";

const ChatController = (() => {
  let abortController = null;

  async function send(text) {
    if (!text?.trim()) return;

    abortController?.abort();
    abortController = new AbortController();

    ChatStore.setState({ loading: true });

    // add user message
    ChatStore.setState({
      messages: [
        ...ChatStore.getState().messages,
        { role: "user", content: text }
      ],
    });

    // placeholder bot message
    let botMessage = { role: "assistant", content: "" };

    ChatStore.setState({
      messages: [...ChatStore.getState().messages, botMessage],
    });

    try {
      await AIService.send(
        text,
        (token) => {
          const msgs = ChatStore.getState().messages;
          const updated = [...msgs];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + token,
          };
          ChatStore.setState({ messages: updated });
        },
        abortController.signal
      );
    } catch (err) {
      botMessage.content = "⚠️ Failed to get response.";
    }

    ChatStore.setState({ loading: false });
  }

  function stop() {
    abortController?.abort();
  }

  return { send, stop };
})();

export default ChatController;
import ChatStore from "../core/chat-store.js";

const ChatMessages = (() => {
    const container = document.getElementById("chat-messages");

    function render(state) {
        container.innerHTML = "";
        const { messages, loading } = state;

        messages.forEach((msg, i) => {
            const div = document.createElement("div");
            div.className = `msg msg-${msg.role}`;

            const isLastBot = msg.role === "assistant" && i === messages.length - 1;
            const isStreaming = loading && isLastBot;

            if (isStreaming && msg.content === "") {
                // pulse while waiting for first token
                div.innerHTML = `<span class="msg-cursor"></span>`;
            } else if (isStreaming) {
                div.textContent = msg.content;
                div.innerHTML += `<span class="msg-cursor"></span>`;
            } else {
                div.textContent = msg.content;
            }

            container.appendChild(div);
        });

        container.scrollTop = container.scrollHeight;
    }
    function init() {
        ChatStore.subscribe(render);
    }

    return { init };
})();

export default ChatMessages;
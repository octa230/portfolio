/**
 * ai-handler.js
 * ─────────────
 * Sends natural-language questions to the Express backend and
 * streams (or prints) the AI answer into the terminal.
 *
 * Keeps the last N turns for conversation memory.
 */

const AIHandler = (() => {
  const BACKEND_URL    = "/ask";   // Proxied to backend in production
  const MEMORY_LIMIT   = 5;        // Rolling window of recent Q&A pairs

  let conversationHistory = [];    // [{ role, content }]
  let isStreaming         = false;

  // ── Conversation memory ───────────────────────────────────────────────────
  function addToHistory(role, content) {
    conversationHistory.push({ role, content });
    // Keep only last MEMORY_LIMIT pairs (user + assistant = 2 entries per turn)
    if (conversationHistory.length > MEMORY_LIMIT * 2) {
      conversationHistory = conversationHistory.slice(-MEMORY_LIMIT * 2);
    }
  }

  function getHistory() {
    return [...conversationHistory];
  }

  function clearHistory() {
    conversationHistory = [];
  }

  // ── Core ask function ─────────────────────────────────────────────────────
  /**
   * Ask the AI a question.
   * Prints a "Thinking…" indicator, then streams the response into the terminal.
   *
   * @param {string} question
   * @param {object} opts
   * @param {boolean} [opts.stream=true]  – use streaming endpoint
   */
  async function ask(question) {
    if (isStreaming) return;

    // Print the user's question as a prompt line
    await TypingEngine.typePrompt(question);

    isStreaming = true;

    // ── "Thinking…" indicator ──────────────────────────────────────────
    const thinkLine = TypingEngine.createLine("thinking-line");
    thinkLine.textContent = "Thinking";
    let dotCount = 0;
    const dotTimer = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      thinkLine.textContent = "Thinking" + ".".repeat(dotCount);
    }, 400);

    addToHistory("user", question);

    try {
      const response = await fetch(BACKEND_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          history:       getHistory().slice(0, -1), // exclude the one we just added
          portfolioData,                             // from portfolio-data.js
        }),
      });

      clearInterval(dotTimer);
      thinkLine.remove();

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        // Friendly message for quota/rate-limit errors
        if (response.status === 429) {
          await TypingEngine.printResponse([
            { html: '<span class="warn">⚠  The AI assistant is temporarily unavailable.</span>' },
            "The free quota is being set up or has been reached — this usually resolves within a few hours.",
            { html: `In the meantime, feel free to browse using the buttons below or <a href="mailto:${portfolioData.contact.email}" class="link">email me directly</a>.` },
          ]);
          isStreaming = false;
          return;
        }
        printError(err.error || `Server error ${response.status}`);
        isStreaming = false;
        return;
      }

      // ── Streaming response ──────────────────────────────────────────
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("text/event-stream")) {
        await handleStream(response);
      } else {
        // Fallback: plain JSON
        const data = await response.json();
        const answer = data.answer || data.message || "No response.";
        await printAnswer(answer);
      }

    } catch (err) {
      clearInterval(dotTimer);
      thinkLine.remove();
      printError(
        navigator.onLine
          ? "Failed to reach the AI backend. Is the server running?"
          : "You appear to be offline."
      );
    } finally {
      isStreaming = false;
    }
  }

  // ── Stream handler ────────────────────────────────────────────────────────
  async function handleStream(response) {
    const reader  = response.body.getReader();
    const decoder = new TextDecoder();
    let   buffer  = "";
    let   fullText= "";

    // Create one line element that grows as tokens arrive
    const answerLine = TypingEngine.createLine("ai-line");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE: lines starting with "data: "
      const parts = buffer.split("\n");
      buffer = parts.pop(); // keep incomplete last part

      for (const part of parts) {
        if (!part.startsWith("data: ")) continue;
        const raw = part.slice(6).trim();
        if (raw === "[DONE]") break;
        try {
          const parsed = JSON.parse(raw);
          // OpenAI streaming delta
          const token = parsed.choices?.[0]?.delta?.content || "";
          if (token) {
            fullText += token;
            TypingEngine.streamToken(answerLine, token);
          }
        } catch (_) { /* partial JSON — ignore */ }
      }
    }

    addToHistory("assistant", fullText);
    TypingEngine.insertBlank();
  }

  // ── Plain (non-stream) answer printer ─────────────────────────────────────
  async function printAnswer(text) {
    addToHistory("assistant", text);
    const lines = text.split("\n").filter(Boolean);
    await TypingEngine.printResponse(
      lines.map(l => ({ html: `<span class="ai-line">${escapeHtml(l)}</span>` })),
    );
  }

  // ── Error helper ──────────────────────────────────────────────────────────
  function printError(msg) {
    TypingEngine.printResponse([
      { html: `<span class="error">AI Error: ${escapeHtml(msg)}</span>` },
    ]);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;");
  }

  // ── Public ────────────────────────────────────────────────────────────────
  return { ask, clearHistory };
})();
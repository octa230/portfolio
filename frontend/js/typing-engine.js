/**
 * typing-engine.js
 * ─────────────────
 * Handles character-by-character typing animations.
 * Completely decoupled from the terminal UI — it only writes to a
 * provided DOM container and calls back when done.
 */

const TypingEngine = (() => {
  // ── Configuration ────────────────────────────────────────────────────────
  const DEFAULTS = {
    charDelay:    28,   // ms between characters (normal prose)
    cmdDelay:     60,   // ms between characters when "typing" a command
    lineDelay:   180,   // ms pause after each line
    sectionDelay:500,   // ms pause between top-level sections
    promptDelay: 350,   // ms before prompt appears
    sound:       false, // typing sound (toggled by user)
  };

  let cfg = { ...DEFAULTS };

  // Optional AudioContext for typing clicks
  let audioCtx = null;
  function playClick() {
    if (!cfg.sound) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc   = audioCtx.createOscillator();
      const gain  = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 600 + Math.random() * 200;
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (_) { /* silently skip on unsupported browsers */ }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Append a single character span to a line element and trigger auto-scroll.
   */
  function appendChar(lineEl, char) {
    const span = document.createElement("span");
    span.textContent = char;
    lineEl.appendChild(span);
    playClick();
    // Scroll the terminal viewport
    const terminal = document.getElementById("terminal-output");
    if (terminal) terminal.scrollTop = terminal.scrollHeight;
  }

  /**
   * Type a full string into a DOM element, char by char.
   * @param {HTMLElement} el      - target element (line container)
   * @param {string}      text
   * @param {number}      [delay] - override ms per char
   */
  async function typeString(el, text, delay = cfg.charDelay) {
    for (const char of text) {
      appendChar(el, char);
      await sleep(delay);
    }
  }

  /**
   * Create and return a styled line element appended to the output container.
   * @param {string} className  - CSS class(es) for colouring
   */
  function createLine(className = "output-line") {
    const output = document.getElementById("terminal-output");
    const line   = document.createElement("div");
    line.className = className;
    output.appendChild(line);
    return line;
  }

  /**
   * Instantly insert a pre-built HTML block (e.g. ASCII art) without typing.
   */
  function insertHTML(html, className = "output-line") {
    const output = document.getElementById("terminal-output");
    const el     = document.createElement("div");
    el.className = className;
    el.innerHTML = html;
    output.appendChild(el);
    output.scrollTop = output.scrollHeight;
  }

  /**
   * Print a blank spacer line.
   */
  function insertBlank() {
    createLine("output-spacer");
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /**
   * Type a prompt line: "$ command" in prompt colour, then a pause.
   */
  async function typePrompt(command) {
    const line = createLine("prompt-line");
    await sleep(cfg.promptDelay);
    await typeString(line, `$ ${command}`, cfg.cmdDelay);
    await sleep(cfg.lineDelay);
  }

  /**
   * Type an array of content lines.
   * Each item may be:
   *   - a plain string   → typed normally
   *   - { html }         → inserted instantly (for colours, tables, etc.)
   *   - { blank: true }  → empty spacer
   */
  async function typeContent(lines) {
    for (const item of lines) {
      if (item === null || item === undefined) { insertBlank(); continue; }
      if (typeof item === "string") {
        const line = createLine("output-line");
        await typeString(line, item);
        await sleep(cfg.lineDelay);
      } else if (item.blank) {
        insertBlank();
        await sleep(80);
      } else if (item.html) {
        insertHTML(item.html, item.className || "output-line");
        await sleep(cfg.lineDelay);
      } else if (item.prompt) {
        // Nested prompt (e.g. showing a sub-command)
        await typePrompt(item.prompt);
      }
    }
  }

  /**
   * Run the full intro sequence from a sections array.
   * @param {Array}    sections  - [{ command, content }]
   * @param {Function} onDone    - callback when all sections finish
   */
  async function runIntro(sections, onDone) {
    for (let i = 0; i < sections.length; i++) {
      const { command, content } = sections[i];
      await typePrompt(command);
      await typeContent(content);
      if (i < sections.length - 1) await sleep(cfg.sectionDelay);
    }
    insertBlank();
    if (typeof onDone === "function") onDone();
  }

  /**
   * Print a response block (used for interactive commands and AI answers).
   * Instant by default unless animated = true.
   */
  async function printResponse(lines, { animated = false } = {}) {
    for (const item of lines) {
      if (!item && item !== 0) { insertBlank(); continue; }
      if (typeof item === "string") {
        const line = createLine("output-line");
        if (animated) {
          await typeString(line, item, cfg.charDelay);
        } else {
          line.textContent = item;
        }
        await sleep(animated ? cfg.lineDelay : 8);
      } else if (item.html) {
        insertHTML(item.html, item.className || "output-line");
      } else if (item.blank) {
        insertBlank();
      }
      // Auto scroll
      const t = document.getElementById("terminal-output");
      if (t) t.scrollTop = t.scrollHeight;
    }
    insertBlank();
  }

  /**
   * Stream text token by token into a single line element.
   * Used for AI streaming responses.
   * @param {HTMLElement} lineEl
   * @param {string}      token
   */
  function streamToken(lineEl, token) {
    lineEl.textContent += token;
    const t = document.getElementById("terminal-output");
    if (t) t.scrollTop = t.scrollHeight;
  }

  /**
   * Configure engine options at runtime.
   */
  function configure(options = {}) {
    cfg = { ...cfg, ...options };
  }

  return {
    runIntro,
    typePrompt,
    typeContent,
    printResponse,
    createLine,
    insertHTML,
    insertBlank,
    streamToken,
    configure,
    sleep,
  };
})();
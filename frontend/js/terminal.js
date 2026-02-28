/**
 * terminal.js
 * ────────────
 * Main terminal controller.
 * Wires together the typing engine, command parser, AI handler,
 * and the layman-friendly action panel.
 */

const Terminal = (() => {

  // ── Intro sections ────────────────────────────────────────────────────────
  // Written to be readable by anyone — no jargon in the first impression.

  function buildIntroSections() {
    const d = portfolioData;
    return [
      {
        // Plain English intro — understandable to a webshop owner, not just devs
        command: "whoami",
        content: [
          { html: `<span class="big-name">${d.name}</span>` },
          { html: `<span class="accent">${d.role}</span>` },
          { blank: true },
          "I help businesses build things on the internet —",
          "from simple landing pages to full online stores and custom web & mobile Apps.",
          { blank: true },
          { html: `📍 ${d.location}` },
          { html: d.available
              ? '<span class="success">● Open to new projects right now</span>'
              : '<span class="warn">● Currently fully booked — but feel free to reach out</span>' },
        ],
      },
      {
        // Show recent work in plain terms, not job titles
        command: "recent-work",
        content: (() => {
          const lines = [];
          d.experience.slice(0, 2).forEach(exp => {
            lines.push({ html: `  <span class="job-title">${exp.company}</span>  <span class="period">${exp.period}</span>` });
            // Show a plain-language one-liner derived from the summary
            const brief = exp.summary.split(".")[0] + ".";
            lines.push(`  ${brief}`);
            lines.push({ blank: true });
          });
          return lines;
        })(),
      },
      {
        // Friendly sign-off that explains how to use the page
        command: "echo 'Ready — ask me anything'",
        content: [
          { html: '<span class="success">✔  All loaded.</span>' },
          { blank: true },
          "Not sure where to start? Try one of the buttons below,",
          "or just type a question — like \"Can you build a webshop?\"",
        ],
      },
    ];
  }

  // ── State ──────────────────────────────────────────────────────────────────
  let inputLocked    = true;
  let commandHistory = [];
  let historyIndex   = -1;
  let currentTheme   = "default";
  let soundEnabled   = false;
  let introSkipped   = false;

  // ── DOM refs ──────────────────────────────────────────────────────────────
  let inputEl, promptEl, outputEl, inputLineEl;

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    inputEl     = document.getElementById("terminal-input");
    promptEl    = document.getElementById("input-prompt");
    outputEl    = document.getElementById("terminal-output");
    inputLineEl = document.getElementById("input-line");

    bindEvents();
    bindLaymanUI();
    runIntro();
  }

  // ── Intro sequence ────────────────────────────────────────────────────────
  async function runIntro() {
    lockInput();
    await TypingEngine.runIntro(buildIntroSections(), onIntroComplete);
  }

  function onIntroComplete() {
    unlockInput();
    focusInput();
    revealActionPanel();
    dismissWelcomeBanner();
  }

  // ── Layman UI wiring ──────────────────────────────────────────────────────
  function bindLaymanUI() {

    // Welcome banner dismiss
    const banner   = document.getElementById("welcome-banner");
    const dismissBtn = document.getElementById("welcome-dismiss");
    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        banner.classList.add("banner-gone");
      });
    }

    // Skip intro button — dumps the full intro instantly then unlocks
    const skipBtn = document.getElementById("skip-intro-btn");
    if (skipBtn) {
      skipBtn.addEventListener("click", async () => {
        if (!inputLocked) return; // already done
        introSkipped = true;
        skipBtn.style.display = "none";

        // Clear anything typed so far and print the full snapshot instantly
        outputEl.innerHTML = "";
        const d = portfolioData;
        TypingEngine.insertHTML(
          `<span class="big-name">${d.name}</span>`,
          "output-line"
        );
        TypingEngine.insertHTML(
          `<span class="accent">${d.role}</span>`,
          "output-line"
        );
        TypingEngine.insertBlank();
        TypingEngine.insertHTML(
          "I help businesses build things on the internet — from simple landing pages to full online stores and custom apps.",
          "output-line"
        );
        TypingEngine.insertBlank();
        TypingEngine.insertHTML(
          d.available
            ? '<span class="success">● Open to new projects right now</span>'
            : '<span class="warn">● Currently fully booked</span>',
          "output-line"
        );
        TypingEngine.insertBlank();
        TypingEngine.insertHTML(
          '<span class="success">✔  Ready. Use the buttons below or type a question.</span>',
          "output-line"
        );

        // Cancel the running animation by swapping the engine to instant mode
        TypingEngine.configure({ charDelay: 0, cmdDelay: 0, lineDelay: 0, sectionDelay: 0, promptDelay: 0 });

        // Small delay then unlock
        await TypingEngine.sleep(120);
        onIntroComplete();
      });
    }

    // Nav buttons → run matching command
    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const cmd = btn.dataset.cmd;
        if (!cmd || inputLocked) return;
        await handleInput(cmd);
        // Scroll terminal into view on mobile
        document.getElementById("terminal").scrollIntoView({ behavior: "smooth" });
      });
    });

    // Suggestion buttons → send as AI question
    document.querySelectorAll(".suggestion-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const q = btn.dataset.question;
        if (!q || inputLocked) return;
        // Show it as if the user typed it
        inputEl.value = q;
        promptEl.textContent = q;
        await TypingEngine.sleep(80);
        inputEl.value = "";
        promptEl.textContent = "";
        await handleInput(q);
        document.getElementById("terminal").scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function revealActionPanel() {
    const panel = document.getElementById("action-panel");
    if (panel) {
      panel.classList.remove("panel-hidden");
      panel.classList.add("panel-visible");
    }
    // Also hide skip button once intro is done
    const skipBtn = document.getElementById("skip-intro-btn");
    if (skipBtn) skipBtn.style.display = "none";
  }

  function dismissWelcomeBanner() {
    const banner = document.getElementById("welcome-banner");
    if (banner) banner.classList.add("banner-gone");
  }

  // ── Input control ─────────────────────────────────────────────────────────
  function lockInput() {
    inputLocked = true;
    inputLineEl.classList.add("hidden");
  }

  function unlockInput() {
    inputLocked = false;
    inputLineEl.classList.remove("hidden");
  }

  function focusInput() {
    if (!inputLocked) inputEl.focus();
  }

  // ── Event binding ─────────────────────────────────────────────────────────
  function bindEvents() {
    // Only focus the input when clicking on non-interactive parts of the terminal
    document.getElementById("terminal").addEventListener("click", (e) => {
      if (e.target.closest("button, a, input")) return;
      focusInput();
    });
    inputEl.addEventListener("keydown", handleKeydown);
    inputEl.addEventListener("input", () => {
      promptEl.textContent = inputEl.value;
    });
  }

  async function handleKeydown(e) {
    if (inputLocked) return;

    switch (e.key) {
      case "Enter": {
        e.preventDefault();
        const raw = inputEl.value.trim();
        inputEl.value = "";
        promptEl.textContent = "";
        if (!raw) return;
        await handleInput(raw);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (commandHistory.length === 0) return;
        historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        const cmd = commandHistory[commandHistory.length - 1 - historyIndex];
        inputEl.value = cmd;
        promptEl.textContent = cmd;
        setTimeout(() => inputEl.setSelectionRange(cmd.length, cmd.length), 0);
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        historyIndex = Math.max(historyIndex - 1, -1);
        const cmd = historyIndex >= 0
          ? commandHistory[commandHistory.length - 1 - historyIndex]
          : "";
        inputEl.value = cmd;
        promptEl.textContent = cmd;
        break;
      }
      case "Tab": {
        e.preventDefault();
        const partial = inputEl.value.toLowerCase();
        const cmds = ["help","about","services","skills","experience","projects","contact","clear","theme","sound"];
        const match = cmds.find(c => c.startsWith(partial) && c !== partial);
        if (match) {
          inputEl.value = match;
          promptEl.textContent = match;
        }
        break;
      }
      case "l":
        if (e.ctrlKey) { e.preventDefault(); handleSpecial("clear"); }
        break;
    }
  }

  // ── Input routing ─────────────────────────────────────────────────────────
  async function handleInput(raw) {
    commandHistory.push(raw);
    historyIndex = -1;

    lockInput();

    const result = CommandParser.parse(raw);

    switch (result.type) {
      case "command":
        await TypingEngine.typePrompt(raw);
        await TypingEngine.printResponse(result.lines);
        break;
      case "special":
        await handleSpecial(result.name, raw);
        break;
      case "ai":
        await AIHandler.ask(raw);
        break;
      case "unknown":
        await TypingEngine.typePrompt(raw);
        await TypingEngine.printResponse(result.lines);
        break;
    }

    unlockInput();
    focusInput();
  }

  // ── Special commands ──────────────────────────────────────────────────────
  async function handleSpecial(name, raw) {
    switch (name) {
      case "clear":
        outputEl.innerHTML = "";
        AIHandler.clearHistory();
        break;

      case "theme":
        currentTheme = currentTheme === "default" ? "hacker" : "default";
        document.body.dataset.theme = currentTheme;
        await TypingEngine.typePrompt(raw || "theme");
        await TypingEngine.printResponse([{
          html: `Theme switched to <span class="accent">${currentTheme}</span> mode.`,
        }]);
        break;

      case "sound":
        soundEnabled = !soundEnabled;
        TypingEngine.configure({ sound: soundEnabled });
        await TypingEngine.typePrompt(raw || "sound");
        await TypingEngine.printResponse([{
          html: `Typing sounds <span class="accent">${soundEnabled ? "enabled" : "disabled"}</span>.`,
        }]);
        break;
    }
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", Terminal.init);
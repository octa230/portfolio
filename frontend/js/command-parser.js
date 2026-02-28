/**
 * command-parser.js
 * ──────────────────
 * Resolves user input to a command handler and returns structured content.
 * No DOM manipulation here — it just returns data that the terminal renders.
 */

const CommandParser = (() => {
  // ── Command Registry ──────────────────────────────────────────────────────
  // Each command returns an array of lines (see TypingEngine.printResponse).
  // Add new commands here without touching anything else.

  const commands = {

    help() {
      return [
        { html: '<span class="accent">Available commands</span>' },
        { blank: true },
        { html: '  <span class="cmd-name">about</span>       — Who I am' },
        { html: '  <span class="cmd-name">services</span>    — What I can build for you &amp; pricing' },
        { html: '  <span class="cmd-name">skills</span>      — Tech stack &amp; expertise' },
        { html: '  <span class="cmd-name">experience</span>  — Work history' },
        { html: '  <span class="cmd-name">projects</span>    — Side projects &amp; OSS' },
        { html: '  <span class="cmd-name">contact</span>     — How to reach me' },
        { html: '  <span class="cmd-name">clear</span>       — Clear the terminal' },
        { html: '  <span class="cmd-name">theme</span>       — Toggle green / white mode' },
        { html: '  <span class="cmd-name">sound</span>       — Toggle typing sounds' },
        { blank: true },
        '  You can also ask me anything in plain English — just type a question!',
        { html: '  e.g.  <em>"Can you build a webshop?"</em>  or  <em>"How much does a website cost?"</em>' },
      ];
    },

    about() {
      const d = portfolioData;
      return [
        { html: `<span class="accent">${d.name}</span>  —  ${d.role}` },
        { blank: true },
        d.summary,
        { blank: true },
        { html: `📍 ${d.location}` },
        { html: d.available
            ? '<span class="success">✔ Currently open to new opportunities</span>'
            : '<span class="warn">✘ Not currently available</span>' },
      ];
    },

    skills() {
      const s = portfolioData.skills;
      const row = (label, arr) =>
        ({ html: `  <span class="label">${label.padEnd(14)}</span> ${arr.join(" · ")}` });
      return [
        { html: '<span class="accent">Technical Skills</span>' },
        { blank: true },
        row("Languages",  s.languages),
        row("Frontend",   s.frontend),
        row("Backend",    s.backend),
        row("Databases",  s.databases),
        row("Infra / DevOps", s.infra),
        row("Practices",  s.practices),
      ];
    },

    experience() {
      const lines = [
        { html: '<span class="accent">Work Experience</span>' },
      ];
      portfolioData.experience.forEach(exp => {
        lines.push({ blank: true });
        lines.push({ html: `  <span class="job-title">${exp.role}</span>` });
        lines.push({ html: `  <span class="company">${exp.company}</span>  <span class="period">${exp.period}</span>` });
        lines.push({ blank: true });
        // Word-wrap summary at ~70 chars
        wrapText(exp.summary, 70).forEach(l => lines.push(`  ${l}`));
      });
      return lines;
    },

    projects() {
      const lines = [
        { html: '<span class="accent">Projects</span>' },
      ];
      portfolioData.projects.forEach(p => {
        const badge = p.status === "live"   ? '<span class="success"> live </span>'
                    : p.status === "active" ? '<span class="accent"> active </span>'
                    : '<span class="dim"> archived </span>';
        lines.push({ blank: true });
        lines.push({ html: `  <span class="project-name">${p.name}</span>${badge}` });
        wrapText(p.description, 68).forEach(l => lines.push(`  ${l}`));
        lines.push({ html: `  <span class="label">Stack</span>  ${p.tech.join(", ")}` });
        lines.push({ html: `  <span class="label">URL</span>    <a href="${p.url}" target="_blank" class="link">${p.url}</a>` });
      });
      return lines;
    },

    contact() {
      const c = portfolioData.contact;
      const row = (label, val) =>
        ({ html: `  <span class="label">${label.padEnd(10)}</span> ${val}` });
      return [
        { html: '<span class="accent">Contact</span>' },
        { blank: true },
        row("Email",    `<a href="mailto:${c.email}" class="link">${c.email}</a>`),
        row("GitHub",   `<a href="https://${c.github}" target="_blank" class="link">${c.github}</a>`),
        row("Twitter",  c.twitter),
        row("LinkedIn", `<a href="https://${c.linkedin}" target="_blank" class="link">${c.linkedin}</a>`),
        row("Website",  `<a href="https://${c.website}" target="_blank" class="link">${c.website}</a>`),
      ];
    },

    services() {
      const lines = [
        { html: '<span class="accent">What I can build for you</span>' },
      ];
      (portfolioData.services || []).forEach(svc => {
        lines.push({ blank: true });
        lines.push({ html: `  <span class="job-title">${svc.name}</span>` });
        wrapText(svc.description, 68).forEach(l => lines.push(`  ${l}`));
      });
      lines.push({ blank: true });
      lines.push({ html: `  → <a href="mailto:${portfolioData.contact.email}" class="link">Email me</a> to discuss your project` });
      return lines;
    },

    // Special commands handled externally but registered here for `help`
    clear:  null,
    theme:  null,
    sound:  null,
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  function wrapText(text, maxLen) {
    const words  = text.split(" ");
    const lines  = [];
    let current  = "";
    for (const word of words) {
      if ((current + word).length > maxLen) {
        if (current) lines.push(current.trimEnd());
        current = word + " ";
      } else {
        current += word + " ";
      }
    }
    if (current.trim()) lines.push(current.trimEnd());
    return lines;
  }

  // ── AI detection heuristics ───────────────────────────────────────────────
  /**
   * Returns true if the input looks like a natural-language question
   * rather than a terminal command.
   */
  function looksLikeQuestion(input) {
    const trimmed = input.trim();
    if (trimmed.endsWith("?")) return true;
    const words = trimmed.split(/\s+/);
    if (words.length >= 5) return true;
    const startsNatural = /^(what|who|where|when|why|how|can|could|do|did|have|is|are|tell|show|explain|describe)/i;
    if (startsNatural.test(trimmed)) return true;
    return false;
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /**
   * Parse a raw input string.
   * Returns one of:
   *   { type: "command", name, lines }   – known command
   *   { type: "special", name }          – clear / theme / sound (side effects handled by terminal)
   *   { type: "ai", question }           – route to AI handler
   *   { type: "unknown", input }         – show error
   */
  function parse(input) {
    const raw  = input.trim();
    const key  = raw.toLowerCase();

    // Special built-ins
    if (key === "clear")  return { type: "special", name: "clear" };
    if (key === "theme")  return { type: "special", name: "theme" };
    if (key === "sound")  return { type: "special", name: "sound" };

    // Registered commands
    if (commands[key] && typeof commands[key] === "function") {
      return { type: "command", name: key, lines: commands[key]() };
    }

    // Natural language → AI
    if (looksLikeQuestion(raw)) {
      return { type: "ai", question: raw };
    }

    // Unknown
    return {
      type: "unknown",
      input: raw,
      lines: [
        { html: `<span class="error">bash: ${escapeHtml(raw)}: command not found</span>` },
        { html: 'Type <span class="cmd-name">help</span> for available commands, or ask me anything in plain English.' },
      ],
    };
  }

  function escapeHtml(str) {
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  return { parse };
})();
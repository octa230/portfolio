import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Load environment variables ────────────────────────────────────────────────
dotenv.config();

const PORT           = parseInt(process.env.PORT || "3000", 10);
const NODE_ENV       = process.env.NODE_ENV || "development";
const GEMINI_KEY     = process.env.GEMINI_API_KEY;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

if (!GEMINI_KEY) {
  console.error("❌  GEMINI_API_KEY is not set. Check your .env file.");
  process.exit(1);
}

// ── Gemini client ─────────────────────────────────────────────────────────────
const genAI = new GoogleGenAI({apiKey: GEMINI_KEY});

// ── Express app ───────────────────────────────────────────────────────────────
const app = express();

// Serve static files first — before any middleware
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.use(express.json({ limit: "32kb" }));
app.use(cors({
  origin: NODE_ENV === "production" ? ALLOWED_ORIGIN : "*",
  methods: ["GET", "POST"],
}));

// ── Bot detection (Dynamic Rendering / SEO) ───────────────────────────────────
const BOT_UA = /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|telegrambot|whatsapp|applebot|pinterestbot|embedly|quora link preview|outbrain|vkShare|W3C_Validator/i;
const HUMAN_UA = /mozilla|chrome|safari|firefox|opera|edge/i;

const seoMiddleware = (req, res, next) => {
  const ua = req.headers['user-agent'] || '';
  if (BOT_UA.test(ua) || !HUMAN_UA.test(ua)) {
    return res.sendFile(path.join(__dirname, "../frontend/index-seo.html"));
  }
  next();
};

// ── Simple in-memory rate limiter ─────────────────────────────────────────────
const RATE_WINDOW_MS = 60_000;
const MAX_REQUESTS   = 20;
const rateLimitStore = new Map();

function rateLimiter(req, res, next) {
  const ip  = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  let entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_WINDOW_MS };
    rateLimitStore.set(ip, entry);
  }

  entry.count += 1;
  res.setHeader("X-RateLimit-Limit",     MAX_REQUESTS);
  res.setHeader("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS - entry.count));

  if (entry.count > MAX_REQUESTS) {
    return res.status(429).json({ error: "Too many requests. Please wait a minute before asking again." });
  }

  if (rateLimitStore.size > 1000) {
    for (const [key, val] of rateLimitStore) {
      if (now > val.resetAt) rateLimitStore.delete(key);
    }
  }

  next();
}

// ── System prompt builder ─────────────────────────────────────────────────────
function buildSystemPrompt(portfolioData) {
  const p = portfolioData;

  return `You are the AI persona of ${p.name}, a ${p.role} who also takes on freelance and client work.

Your audience is MIXED — some visitors are developers, but many are non-technical business owners
(e.g. someone who wants a webshop, a landing page, or a custom app).

Rules:
1. Answer ONLY from the data provided below. Do not invent prices, timelines, or capabilities.
2. For non-technical questions (pricing, timelines, "can you build X"), refer to the services and faq sections.
3. Keep answers to 4 sentences or fewer. Be warm, clear, and jargon-free with non-technical visitors.
4. Write in first person as ${p.name}.
5. If a question cannot be answered from this data, say: "I don't have that detail here — send me an email and I'll answer properly."
6. Always end answers about services or availability with the contact email if it feels natural.
7. Refuse to answer questions completely unrelated to ${p.name}'s professional background.

=== PORTFOLIO DATA ===
${JSON.stringify(portfolioData, null, 2)}
=== END DATA ===`;
}

// ── Input validation ──────────────────────────────────────────────────────────
function validateAskBody(req, res, next) {
  const { question, portfolioData } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Missing or invalid `question` field." });
  }

  if (question.length > 500) {
    return res.status(400).json({ error: "Question is too long (max 500 chars)." });
  }

  if (!portfolioData || typeof portfolioData !== "object") {
    return res.status(400).json({ error: "Missing or invalid `portfolioData` field." });
  }

  next();
}

// ── POST /ask ─────────────────────────────────────────────────────────────────
app.post("/ask", rateLimiter, validateAskBody, async (req, res) => {
  const { question, portfolioData, history = [] } = req.body;

  try {
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    // Format content for the latest SDK
    const contents = [
      ...history.slice(-10).map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: question }] },
    ];

    // Use the model directly from the client
    const response = await genAI.models.generateContentStream({
      model: modelName,
      contents,
      config: {
        systemInstruction: buildSystemPrompt(portfolioData),
        maxOutputTokens: 300,
        temperature: 0.4,
      },
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Correct streaming iteration for the latest @google/genai SDK
    for await (const chunk of response) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: chunk.text } }] })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("[/ask] Gemini error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to connect to the AI model." });
    }
  }
});

// ── GET /health ───────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: NODE_ENV, ts: new Date().toISOString() });
});

// ── SEO & SPA Catch-All ───────────────────────────────────────────────────────
app.get(/.*/, seoMiddleware, (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("[global]", err.message);
  res.status(500).json({ error: "Internal server error." });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ╔══════════════════════════════════════╗`);
  console.log(`  ║  Terminal Portfolio Backend           ║`);
  console.log(`  ║  http://localhost:${PORT}                ║`);
  console.log(`  ║  ENV: ${NODE_ENV.padEnd(28)}  ║`);
  console.log(`  ║  SEO: Dynamic Rendering Enabled       ║`);
  console.log(`  ╚══════════════════════════════════════╝\n`);
});

export default app;
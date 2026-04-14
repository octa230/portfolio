// ai-service.js
import { readStream } from "../utils/stream-parser.js";
import MemoryService from "../core/memory-service.js";
import portfolioData from "../core/portfolio-data.js";

const AIService = (() => {
  const ENDPOINT = "/ask";

  async function send(question, onToken, signal) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        question,
        history: MemoryService.get(),
        portfolioData
      }),
    });

    if (!res.ok) throw new Error("AI request failed");

    const full = await readStream(res, onToken);
    MemoryService.add("user", question);
    MemoryService.add("assistant", full);
    return full;
  }

  return { send };
})();

export default AIService;
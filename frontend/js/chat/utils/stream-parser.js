export async function readStream(response, onToken) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n");
    buffer = parts.pop();         // save potentially incomplete line
    for (const line of parts) {
      processLine(line);
    }
  }

  // ← flush whatever remains in buffer after stream ends
  if (buffer.trim()) processLine(buffer);

  return fullText;

  function processLine(line) {
    if (!line.startsWith("data: ")) return;
    const raw = line.replace("data: ", "").trim();
    if (raw === "[DONE]") return;
    try {
      const json = JSON.parse(raw);
      const token = json.choices?.[0]?.delta?.content || "";
      if (token) {
        fullText += token;
        onToken(token);
      }
    } catch {}
  }
}
export interface AIRequest {
  prompt: string;
  context?: string;
  system?: string;
}

export interface AIResponse {
  result: string;
  error?: string;
}

export interface AIProvider {
  name: string;
  generateText(req: AIRequest): Promise<AIResponse>;
}

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';

  async generateText(req: AIRequest): Promise<AIResponse> {
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return { result: "", error: "OpenAI API key is not configured in environment variables. Real AI is required." };
      }

      const messages = [];
      if (req.system) {
        messages.push({ role: "system", content: req.system });
      }
      if (req.context) {
        messages.push({ role: "system", content: `Additional Context: ${req.context}` });
      }
      messages.push({ role: "user", content: req.prompt });

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: messages,
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { result: "", error: errorData.error?.message || `API Request failed with status ${response.status}` };
      }

      const data = await response.json();
      return {
        result: data.choices[0].message.content
      };
    } catch (err) {
      const e = err as Error;
      return { result: "", error: e.message };
    }
  }
}

export class GeminiProvider implements AIProvider {
  name = 'Gemini';

  async generateText(req: AIRequest): Promise<AIResponse> {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return { result: "", error: "Gemini API key is not configured in environment variables. Real AI is required." };
      }

      const promptText = `${req.system ? `System Instruction:\n${req.system}\n\n` : ''}${req.context ? `Additional Context:\n${req.context}\n\n` : ''}User Request:\n${req.prompt}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: promptText }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { result: "", error: errorData.error?.message || `API Request failed with status ${response.status}` };
      }

      const data = await response.json();
      return {
        result: data.candidates?.[0]?.content?.parts?.[0]?.text || ""
      };
    } catch (err) {
      const e = err as Error;
      return { result: "", error: e.message };
    }
  }
}

// Ensure we strictly use a real AI provider. Default to Gemini if keys exist, else OpenAI. Both will error properly if keys are missing.
let activeProvider: AIProvider = process.env.OPENAI_API_KEY ? new OpenAIProvider() : new GeminiProvider();

export function setAIProvider(provider: AIProvider) {
  activeProvider = provider;
}

export function getAIProvider(): AIProvider {
  return activeProvider;
}

import { STRATER_STORAGE_SERVICE } from './straterStorageService';
import { ByokApiKeys } from '../types/strater';

export type AiProvider = 'gemini' | 'openai' | 'anthropic' | 'groq' | 'ollama' | 'offline';

export interface ActiveAiConfig {
  provider: AiProvider;
  keyOrUrl?: string;
  model: string;
  isCustom: boolean;
}

export interface LlmCallOptions {
  systemPrompt?: string;
  jsonMode?: boolean;
  maxTokens?: number;
  temperature?: number;
}

export interface ConnectionTestResult {
  success: boolean;
  latencyMs: number;
  modelUsed: string;
  error?: string;
}

/**
 * Universal Live AI Integration Client
 * Connects direct browser requests to Google Gemini, Groq, OpenAI, Anthropic, or Local Ollama.
 */
export const LIVE_AI_SERVICE = {
  /**
   * Resolve active provider and configuration
   */
  getActiveConfig(): ActiveAiConfig {
    const keys = STRATER_STORAGE_SERVICE.getByokKeys();

    // Check custom keys first, then fallback to environment variables
    const env = (import.meta as any).env || {};
    const geminiKey = keys.geminiApiKey || (env.VITE_GEMINI_API_KEY as string | undefined);
    const groqKey = keys.groqApiKey || (env.VITE_GROQ_API_KEY as string | undefined);
    const openaiKey = keys.openaiApiKey || (env.VITE_OPENAI_API_KEY as string | undefined);
    const anthropicKey = keys.anthropicApiKey || (env.VITE_ANTHROPIC_API_KEY as string | undefined);
    const ollamaUrl = keys.ollamaUrl || (env.VITE_OLLAMA_URL as string | undefined);

    // If explicit active provider chosen:
    if (keys.activeProvider && keys.activeProvider !== 'auto') {
      if (keys.activeProvider === 'gemini' && geminiKey) {
        return { provider: 'gemini', keyOrUrl: geminiKey, model: 'gemini-2.0-flash', isCustom: true };
      }
      if (keys.activeProvider === 'groq' && groqKey) {
        return { provider: 'groq', keyOrUrl: groqKey, model: 'llama-3.3-70b-versatile', isCustom: true };
      }
      if (keys.activeProvider === 'openai' && openaiKey) {
        return { provider: 'openai', keyOrUrl: openaiKey, model: 'gpt-4o-mini', isCustom: true };
      }
      if (keys.activeProvider === 'anthropic' && anthropicKey) {
        return { provider: 'anthropic', keyOrUrl: anthropicKey, model: 'claude-3-5-sonnet-20241022', isCustom: true };
      }
      if (keys.activeProvider === 'ollama' && ollamaUrl) {
        return { provider: 'ollama', keyOrUrl: ollamaUrl, model: keys.ollamaModel || 'llama3', isCustom: true };
      }
    }

    // Auto-selection priority
    if (geminiKey) {
      return { provider: 'gemini', keyOrUrl: geminiKey, model: 'gemini-2.0-flash', isCustom: true };
    }
    if (groqKey) {
      return { provider: 'groq', keyOrUrl: groqKey, model: 'llama-3.3-70b-versatile', isCustom: true };
    }
    if (openaiKey) {
      return { provider: 'openai', keyOrUrl: openaiKey, model: 'gpt-4o-mini', isCustom: true };
    }
    if (anthropicKey) {
      return { provider: 'anthropic', keyOrUrl: anthropicKey, model: 'claude-3-5-sonnet-20241022', isCustom: true };
    }
    if (ollamaUrl) {
      return { provider: 'ollama', keyOrUrl: ollamaUrl, model: keys.ollamaModel || 'llama3', isCustom: true };
    }

    return {
      provider: 'offline',
      model: 'Edu AI Neural Synthesizer (Built-in Heuristic)',
      isCustom: false
    };
  },

  /**
   * Check if any live neural provider is ready
   */
  isLiveAiAvailable(): boolean {
    return this.getActiveConfig().provider !== 'offline';
  },

  /**
   * Live Test Connection against an AI Endpoint
   */
  async testConnection(provider: AiProvider, keyOrUrl: string, modelName?: string): Promise<ConnectionTestResult> {
    const start = performance.now();
    try {
      if (provider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${keyOrUrl.trim()}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with exactly: OK' }] }],
            generationConfig: { maxOutputTokens: 10 }
          })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error?.message || `HTTP ${res.status}: Failed to authenticate Gemini key.`);
        }
        return {
          success: true,
          latencyMs: Math.round(performance.now() - start),
          modelUsed: 'Google Gemini 2.0 Flash'
        };
      }

      if (provider === 'groq') {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${keyOrUrl.trim()}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: 'Say OK' }],
            max_tokens: 10
          })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error?.message || `HTTP ${res.status}: Failed to authenticate Groq key.`);
        }
        return {
          success: true,
          latencyMs: Math.round(performance.now() - start),
          modelUsed: 'Groq Llama 3.3 70B Versatile'
        };
      }

      if (provider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${keyOrUrl.trim()}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'Say OK' }],
            max_tokens: 10
          })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error?.message || `HTTP ${res.status}: Failed to authenticate OpenAI key.`);
        }
        return {
          success: true,
          latencyMs: Math.round(performance.now() - start),
          modelUsed: 'OpenAI GPT-4o Mini'
        };
      }

      if (provider === 'anthropic') {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': keyOrUrl.trim(),
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Say OK' }]
          })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error?.message || `HTTP ${res.status}: Failed to authenticate Anthropic key.`);
        }
        return {
          success: true,
          latencyMs: Math.round(performance.now() - start),
          modelUsed: 'Claude 3.5 Sonnet'
        };
      }

      if (provider === 'ollama') {
        const base = keyOrUrl.replace(/\/+$/, '');
        const res = await fetch(`${base}/v1/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelName || 'llama3',
            messages: [{ role: 'user', content: 'Say OK' }],
            max_tokens: 10
          })
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Ollama daemon returned an error.`);
        }
        return {
          success: true,
          latencyMs: Math.round(performance.now() - start),
          modelUsed: `Local Ollama (${modelName || 'llama3'})`
        };
      }

      return {
        success: true,
        latencyMs: 12,
        modelUsed: 'Offline Built-in Heuristic Model'
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Math.round(performance.now() - start),
        modelUsed: provider,
        error: err.message || 'Connection failed'
      };
    }
  },

  /**
   * Send inference request to active neural provider
   */
  async callLlm(prompt: string, options?: LlmCallOptions): Promise<string> {
    const config = this.getActiveConfig();

    if (config.provider === 'offline' || !config.keyOrUrl) {
      throw new Error('NO_LIVE_PROVIDER_CONFIGURED');
    }

    const { systemPrompt, jsonMode = false, maxTokens = 2048, temperature = 0.7 } = options || {};

    // 1. Google Gemini
    if (config.provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.keyOrUrl.trim()}`;
      
      const parts: any[] = [];
      if (systemPrompt) {
        parts.push({ text: `[SYSTEM INSTRUCTION]\n${systemPrompt}\n\n[USER REQUEST]\n` });
      }
      parts.push({ text: prompt });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
            ...(jsonMode ? { responseMimeType: 'application/json' } : {})
          }
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Gemini API error (HTTP ${res.status})`);
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response received from Gemini.');
      return text;
    }

    // 2. Groq (OpenAI-compatible)
    if (config.provider === 'groq') {
      const messages: any[] = [];
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
      messages.push({ role: 'user', content: prompt });

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.keyOrUrl.trim()}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          temperature,
          max_tokens: maxTokens,
          ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Groq API error (HTTP ${res.status})`);
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content || '';
    }

    // 3. OpenAI
    if (config.provider === 'openai') {
      const messages: any[] = [];
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
      messages.push({ role: 'user', content: prompt });

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.keyOrUrl.trim()}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature,
          max_tokens: maxTokens,
          ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `OpenAI API error (HTTP ${res.status})`);
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content || '';
    }

    // 4. Anthropic Claude
    if (config.provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.keyOrUrl.trim(),
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          system: systemPrompt,
          max_tokens: maxTokens,
          temperature,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Anthropic API error (HTTP ${res.status})`);
      }

      const data = await res.json();
      return data.content?.[0]?.text || '';
    }

    // 5. Local Ollama
    if (config.provider === 'ollama') {
      const base = config.keyOrUrl.replace(/\/+$/, '');
      const messages: any[] = [];
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
      messages.push({ role: 'user', content: prompt });

      const res = await fetch(`${base}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.model || 'llama3',
          messages,
          temperature,
          max_tokens: maxTokens,
          ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
        })
      });

      if (!res.ok) {
        throw new Error(`Ollama daemon returned HTTP ${res.status}`);
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content || '';
    }

    throw new Error('Unsupported AI provider configured.');
  },

  /**
   * Helper to clean JSON output from markdown fences
   */
  extractJson<T = any>(rawText: string): T {
    let clean = rawText.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }
    return JSON.parse(clean.trim());
  }
};

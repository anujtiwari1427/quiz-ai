import React, { useState } from 'react';
import { ByokApiKeys } from '../../types/strater';
import { STRATER_STORAGE_SERVICE } from '../../services/straterStorageService';
import { LIVE_AI_SERVICE, AiProvider } from '../../services/liveAiService';
import { 
  Key, 
  X, 
  Eye, 
  EyeOff, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Trash2,
  ExternalLink,
  Cpu,
  Radio
} from 'lucide-react';

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeysSaved?: (keys: ByokApiKeys) => void;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({
  isOpen,
  onClose,
  onKeysSaved
}) => {
  const currentKeys = STRATER_STORAGE_SERVICE.getByokKeys();

  const [activeProvider, setActiveProvider] = useState<'auto' | 'gemini' | 'groq' | 'openai' | 'anthropic' | 'ollama'>(
    currentKeys.activeProvider || 'auto'
  );
  const [geminiKey, setGeminiKey] = useState(currentKeys.geminiApiKey || '');
  const [groqKey, setGroqKey] = useState(currentKeys.groqApiKey || '');
  const [openaiKey, setOpenaiKey] = useState(currentKeys.openaiApiKey || '');
  const [anthropicKey, setAnthropicKey] = useState(currentKeys.anthropicApiKey || '');
  const [ollamaUrl, setOllamaUrl] = useState(currentKeys.ollamaUrl || 'http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState(currentKeys.ollamaModel || 'llama3');

  const [showGemini, setShowGemini] = useState(false);
  const [showGroq, setShowGroq] = useState(false);
  const [showOpenai, setShowOpenai] = useState(false);
  const [showAnthropic, setShowAnthropic] = useState(false);

  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
    modelUsed?: string;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [saveBanner, setSaveBanner] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ByokApiKeys = {
      activeProvider,
      geminiApiKey: geminiKey.trim() || undefined,
      groqApiKey: groqKey.trim() || undefined,
      openaiApiKey: openaiKey.trim() || undefined,
      anthropicApiKey: anthropicKey.trim() || undefined,
      ollamaUrl: ollamaUrl.trim() || undefined,
      ollamaModel: ollamaModel.trim() || undefined
    };

    STRATER_STORAGE_SERVICE.saveByokKeys(updated);
    onKeysSaved?.(updated);
    setSaveBanner(true);
    setTimeout(() => {
      setSaveBanner(false);
      onClose();
    }, 1200);
  };

  const handleTestConnection = async (targetProvider?: AiProvider) => {
    setIsTesting(true);
    setTestResult(null);

    // Determine which provider to test
    const providerToTest: AiProvider = targetProvider || (
      activeProvider === 'auto'
        ? (geminiKey ? 'gemini' : groqKey ? 'groq' : openaiKey ? 'openai' : anthropicKey ? 'anthropic' : ollamaUrl ? 'ollama' : 'offline')
        : (activeProvider as AiProvider)
    );

    let keyOrUrl = '';
    let modelName = '';
    if (providerToTest === 'gemini') keyOrUrl = geminiKey;
    else if (providerToTest === 'groq') keyOrUrl = groqKey;
    else if (providerToTest === 'openai') keyOrUrl = openaiKey;
    else if (providerToTest === 'anthropic') keyOrUrl = anthropicKey;
    else if (providerToTest === 'ollama') {
      keyOrUrl = ollamaUrl;
      modelName = ollamaModel;
    }

    if (!keyOrUrl && providerToTest !== 'offline') {
      setIsTesting(false);
      setTestResult({
        success: false,
        message: `Please enter an API Key or URL for ${providerToTest.toUpperCase()} to test.`
      });
      return;
    }

    const res = await LIVE_AI_SERVICE.testConnection(providerToTest, keyOrUrl, modelName);
    setIsTesting(false);

    if (res.success) {
      setTestResult({
        success: true,
        message: `✓ Connected successfully to ${res.modelUsed} (${res.latencyMs}ms response latency)`,
        latencyMs: res.latencyMs,
        modelUsed: res.modelUsed
      });
    } else {
      setTestResult({
        success: false,
        message: `✗ Connection failed: ${res.error}`
      });
    }
  };

  const handleClearKeys = () => {
    setGeminiKey('');
    setGroqKey('');
    setOpenaiKey('');
    setAnthropicKey('');
    setOllamaUrl('http://localhost:11434');
    STRATER_STORAGE_SERVICE.saveByokKeys({});
    setTestResult({
      success: true,
      message: 'All API keys cleared from local storage.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#1c1c1e] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0071e3] to-[#bf5af2] flex items-center justify-center text-white shadow-lg shadow-[#0071e3]/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Live AI & Neural Model Engine</h3>
              <p className="text-xs text-[#86868b]">Connect real neural models for live exam generation, grading, and tutoring</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#86868b] hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Alert */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5 text-xs text-[#86868b]">
          <ShieldCheck className="w-4 h-4 text-[#30d158] shrink-0 mt-0.5" />
          <span>API keys are stored directly in your browser's encrypted localStorage and communicate peer-to-peer with LLM providers without proxy logging.</span>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Active Model Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#a1a1a6] flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#2997ff]" />
              <span>Active Inference Engine</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'auto', label: 'Auto (Best Key)', desc: 'Smart prioritized fallback' },
                { id: 'gemini', label: 'Google Gemini', desc: 'Gemini 2.0 Flash (Fast)' },
                { id: 'groq', label: 'Groq Cloud', desc: 'Llama 3.3 70B (Instant)' },
                { id: 'openai', label: 'OpenAI', desc: 'GPT-4o / GPT-4o-mini' },
                { id: 'anthropic', label: 'Anthropic', desc: 'Claude 3.5 Sonnet' },
                { id: 'ollama', label: 'Local Ollama', desc: 'Private offline LLM' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setActiveProvider(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    activeProvider === opt.id
                      ? 'bg-[#0071e3]/20 border-[#2997ff] text-white'
                      : 'bg-white/[0.02] border-white/10 text-[#86868b] hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-xs text-white">{opt.label}</div>
                  <div className="text-[10px] text-[#86868b] mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-1 border-t border-white/10">
            
            {/* Google Gemini Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-[#f5f5f7] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2997ff]" />
                  <span>Google Gemini API Key</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#30d158]/20 text-[#30d158] font-bold">Recommended</span>
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#2997ff] hover:underline flex items-center gap-1"
                >
                  <span>Get Free Gemini Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showGemini ? 'text' : 'password'}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full pl-3 pr-10 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-[#636366] text-xs font-mono focus:outline-none focus:border-[#2997ff]"
                />
                <button
                  type="button"
                  onClick={() => setShowGemini(!showGemini)}
                  className="absolute right-3 top-2.5 text-[#86868b] hover:text-white"
                >
                  {showGemini ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Groq Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-[#f5f5f7] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ff9f0a]" />
                  <span>Groq Cloud API Key (Llama 3.3 70B)</span>
                </label>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#ff9f0a] hover:underline flex items-center gap-1"
                >
                  <span>Get Free Groq Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showGroq ? 'text' : 'password'}
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full pl-3 pr-10 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-[#636366] text-xs font-mono focus:outline-none focus:border-[#ff9f0a]"
                />
                <button
                  type="button"
                  onClick={() => setShowGroq(!showGroq)}
                  className="absolute right-3 top-2.5 text-[#86868b] hover:text-white"
                >
                  {showGroq ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* OpenAI Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-[#f5f5f7] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#30d158]" />
                  <span>OpenAI API Key (GPT-4o / GPT-4o-mini)</span>
                </label>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#30d158] hover:underline flex items-center gap-1"
                >
                  <span>OpenAI Dashboard</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showOpenai ? 'text' : 'password'}
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full pl-3 pr-10 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-[#636366] text-xs font-mono focus:outline-none focus:border-[#30d158]"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenai(!showOpenai)}
                  className="absolute right-3 top-2.5 text-[#86868b] hover:text-white"
                >
                  {showOpenai ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Anthropic Claude Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-[#f5f5f7] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#bf5af2]" />
                  <span>Anthropic Claude API Key (Claude 3.5 Sonnet)</span>
                </label>
                <a
                  href="https://console.anthropic.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#bf5af2] hover:underline flex items-center gap-1"
                >
                  <span>Anthropic Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showAnthropic ? 'text' : 'password'}
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="w-full pl-3 pr-10 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-[#636366] text-xs font-mono focus:outline-none focus:border-[#bf5af2]"
                />
                <button
                  type="button"
                  onClick={() => setShowAnthropic(!showAnthropic)}
                  className="absolute right-3 top-2.5 text-[#86868b] hover:text-white"
                >
                  {showAnthropic ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Local Ollama Endpoint */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-[#f5f5f7] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#64d2ff]" />
                  <span>Local Ollama Daemon (Self-Hosted Private LLM)</span>
                </label>
                <span className="text-[10px] text-[#86868b]">Run `ollama serve`</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-[#636366] text-xs font-mono focus:outline-none focus:border-[#64d2ff]"
                />
                <input
                  type="text"
                  value={ollamaModel}
                  onChange={(e) => setOllamaModel(e.target.value)}
                  placeholder="Model name (e.g. llama3, mistral)"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-[#636366] text-xs font-mono focus:outline-none focus:border-[#64d2ff]"
                />
              </div>
            </div>

          </div>

          {/* Test Status feedback */}
          {testResult && (
            <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 transition-all ${
              testResult.success
                ? 'bg-[#30d158]/10 border-[#30d158]/30 text-[#30d158]'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <Activity className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{testResult.message}</div>
            </div>
          )}

          {saveBanner && (
            <div className="p-3 rounded-2xl bg-[#30d158]/20 border border-[#30d158]/30 text-[#30d158] text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Credentials saved securely! Connecting active neural engine...</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTestConnection()}
                disabled={isTesting}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-medium flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Activity className={`w-3.5 h-3.5 text-[#2997ff] ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Testing Handshake...' : 'Test Connection'}</span>
              </button>
              <button
                type="button"
                onClick={handleClearKeys}
                className="p-2 text-[#86868b] hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                title="Clear all keys"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-[#86868b] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-2 px-5 font-semibold shadow-lg shadow-[#0071e3]/30"
              >
                Save Settings
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

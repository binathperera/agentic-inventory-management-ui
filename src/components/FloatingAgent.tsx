import { useState } from "react";
import { Bot, X, Send, TrendingUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { aiChatService } from "../services/api";
import "../styles/FloatingAgent.css";

const FloatingAgent = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handleAsk = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || loading) return;

    setLoading(true);
    setError(null);
    setLastPrompt(trimmedPrompt);

    try {
      setResponse(await aiChatService.query(trimmedPrompt));
      setPrompt("");
    } catch {
      setError("Unable to fetch an AI response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="floating-agent">
      {isOpen && (
        <section
          className="floating-agent-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="floating-agent-title"
        >
          <header className="floating-agent-header">
            <div className="floating-agent-heading">
              <Bot size={22} aria-hidden="true" />
              <div>
                <h2 id="floating-agent-title">Inventory Assistant</h2>
                <p>Ask about stock, orders, or products.</p>
              </div>
            </div>
            <button
              type="button"
              className="floating-agent-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close inventory assistant"
              title="Close assistant"
            >
              <X size={19} aria-hidden="true" />
            </button>
          </header>

          <div className="floating-agent-content">
            {!lastPrompt && !error && (
              <p className="floating-agent-empty">
                Try “Which items are low in stock?”
              </p>
            )}
            {lastPrompt && <p className="floating-agent-prompt">{lastPrompt}</p>}
            {loading && (
              <p className="floating-agent-status">Thinking...</p>
            )}
            {error && <p className="floating-agent-error">{error}</p>}
            {!loading && response && (
              <p className="floating-agent-response">{response}</p>
            )}
          </div>

          <form className="floating-agent-form" onSubmit={handleAsk}>
            <label htmlFor="floating-agent-prompt" className="sr-only">
              Ask the inventory assistant
            </label>
            <textarea
              id="floating-agent-prompt"
              rows={2}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask a question..."
              disabled={loading}
            />
            <button
              type="submit"
              className="floating-agent-submit"
              disabled={loading || !prompt.trim()}
              aria-label="Send question"
              title="Send question"
            >
              {loading ? (
                <TrendingUp size={18} className="floating-agent-spinning" />
              ) : (
                <Send size={18} aria-hidden="true" />
              )}
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="floating-agent-bubble"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close inventory assistant" : "Open inventory assistant"}
        aria-expanded={isOpen}
        title="Open inventory assistant"
      >
        {isOpen ? <X size={25} aria-hidden="true" /> : <Bot size={27} aria-hidden="true" />}
      </button>
    </div>
  );
};

export default FloatingAgent;
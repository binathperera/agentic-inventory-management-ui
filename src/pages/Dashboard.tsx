import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import "../styles/Dashboard.css";
import { aiChatService, transactionService } from "../services/api";
//import type { AiChatDocument } from "../types";
import { Sparkles, Send, ShoppingCart, TrendingUp } from "lucide-react";

const renderHighlightedResponse = (response: string) =>
  response.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <mark className="ai-chat-highlight" key={`${part}-${index}`}>
          {part.slice(2, -2)}
        </mark>
      );
    }

    return part;
  });

const Dashboard = () => {
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<string>("");
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const loadSales = async () => {
      try {
        const transactions = await transactionService.getAllTransactions();
        setTotalSales(transactions.length);
      } catch (err) {
        console.error("Failed to load dashboard sales", err);
      }
    };

    loadSales();
  }, []);

  const handleAsk = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    setLoading(true);
    setError(null);
    setLastPrompt(trimmedPrompt);

    try {
      const data = await aiChatService.query(trimmedPrompt);
      console.log("AI chat response:", {
        value: data,
        type: typeof data,
        length: data?.length,
      });
      setResults(data);
    } catch (err) {
      console.error("AI chat query failed", err);
      setError("Unable to fetch AI response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-with-nav">
      <Navigation />
      <div className="page-content">
        <div className="page-header">
          <h1>Dashboard</h1>
          {/* <p className="subtitle">Overview, analytics, and AI insights</p> */}
        </div>

        <div className="content-wrapper">
          <div className="dashboard-grid">
            <div className="ai-chat-card">
              <div className="ai-chat-header">
                <div className="ai-chat-title-wrapper">
                  <Sparkles className="ai-icon" size={24} />
                  <div>
                    <h2>Inventory Operations Assistant</h2>
                    <p className="subtitle">
                      I'm here to help you manage your inventory.
                    </p>
                  </div>
                </div>
              </div>

              <form className="ai-chat-form" onSubmit={handleAsk}>
                <label className="ai-chat-label" htmlFor="ai-chat-prompt">
                  Ask a question
                </label>
                <textarea
                  id="ai-chat-prompt"
                  className="ai-chat-input"
                  rows={3}
                  placeholder="Type your question here, e.g., 'Show me low stock items' or 'What are the top-selling products?'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={loading}
                />
                <div className="ai-chat-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <TrendingUp size={18} className="btn-icon spinning" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <Send size={18} className="btn-icon" />
                        Ask Assistant
                      </>
                    )}
                  </button>
                  {/* <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setPrompt("");
                      setResults([]);
                      setLastPrompt(null);
                      setError(null);
                    }}
                    disabled={loading}
                  >
                    <RotateCcw size={18} className="btn-icon" />
                    Clear
                  </button> */}
                </div>
              </form>

              {error && <div className="ai-chat-error">{error}</div>}

              {lastPrompt && (
                <div className="ai-chat-results">
                  <div className="ai-chat-prompt">You asked: {lastPrompt}</div>

                  {loading && (
                    <div className="ai-chat-loading">Fetching answer...</div>
                  )}

                  {!loading && results.length === 0 && !error && (
                    <div className="ai-chat-empty">No results returned.</div>
                  )}
                  {!loading && results.length > 0 && (
                    <div className="ai-chat-response">
                      {renderHighlightedResponse(results)}
                    </div>
                  )}
                  {/* {!loading &&
                    results.map((doc, index) => (
                      <div
                        className="ai-chat-message"
                        key={doc.id ?? `${index}-${doc.title ?? "result"}`}
                      >
                        {doc.title && (
                          <div className="ai-chat-message-title">
                            {doc.title}
                          </div>
                        )}

                        {doc.content && (
                          <p className="ai-chat-response">{doc.content}</p>
                        )}

                        <div className="ai-chat-data">
                          {Object.entries(doc).map(([key, value]) => {
                            // Skip already displayed fields
                            if (
                              ["id", "title", "content", "score"].includes(key)
                            ) {
                              return null;
                            }

                            // Format the value nicely
                            let displayValue: string;
                            if (typeof value === "object" && value !== null) {
                              displayValue = JSON.stringify(value, null, 2);
                            } else {
                              displayValue = String(value);
                            }

                            return (
                              <div className="ai-chat-field" key={key}>
                                <span className="ai-chat-field-label">
                                  {key}:
                                </span>
                                <span className="ai-chat-field-value">
                                  {displayValue}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {typeof doc.score === "number" && (
                          <div className="ai-chat-score">
                            Relevance: {(doc.score * 100).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    ))} */}
                </div>
              )}
            </div>

            <div className="placeholder-card">
              <h3>Key Performance Indicators</h3>
              <div className="kpi-grid">
                <div className="kpi-widget">
                  <div className="kpi-icon sales">
                    <ShoppingCart size={24} />
                  </div>
                  <div className="kpi-content">
                    <div className="kpi-label">Total Sales</div>
                    <div className="kpi-value">{totalSales}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import "../styles/Dashboard.css";
import { aiChatService } from "../services/api";
import type { AiChatDocument } from "../types";
import {
  Sparkles,
  Send,
  //RotateCcw,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import type { Product } from "../types";
import { productService } from "../services/api";

const Dashboard = () => {
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<AiChatDocument[]>([]);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setError("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load products";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    setLoading(true);
    setError(null);
    setLastPrompt(trimmedPrompt);

    try {
      const data = await aiChatService.query(trimmedPrompt);
      console.log("AI chat documents", data);
      setResults(data);
    } catch (err) {
      console.error("AI chat query failed", err);
      setError("Unable to fetch AI response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

   const lowStockCount = products.filter(
    (p) => (p.remainingQuantity || 0) < 10
  ).length;

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
                    <h2>AI Inventory Assistant</h2>
                    <p className="subtitle">
                      Ask natural-language questions about inventory, stock, and
                      orders.
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
                  placeholder="Example: Show me items with quantity less than 10 in stock"
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
                        Ask AI
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

                  {!loading &&
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
                    ))}
                </div>
              )}
            </div>

            <div className="placeholder-card">
              <h3>Key Performance Indicators</h3>
              <div className="kpi-grid">
                <div className="kpi-widget">
                  <div className="kpi-icon expired">
                    <Clock size={24} />
                  </div>
                  <div className="kpi-content">
                    <div className="kpi-label">Expired Items</div>
                    <div className="kpi-value">0</div>
                  </div>
                </div>
                <div className="kpi-widget">
                  <div className="kpi-icon critical">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="kpi-content">
                    <div className="kpi-label">Critical Stock</div>
                    <div className="kpi-value" style={{ color: lowStockCount > 0 ? "#dc3545" : "#28a745" }}>
                      {lowStockCount}
                    </div>
                  </div>
                </div>
              </div>
              <p className="kpi-footer">
                Real-time analytics and insights coming soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

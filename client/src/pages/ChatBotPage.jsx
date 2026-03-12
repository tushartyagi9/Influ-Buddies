import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import InfluencerCard from '../components/InfluencerCard.jsx';
import './ChatBotPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5050';

function ChatBotPage() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [latestResult, setLatestResult] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const exampleRequests = [
    'I want to promote a new fitness app — ₹5,000 budget, high-engagement Instagram & TikTok influencers in India, health & wellness niche.',
    'Looking for sustainable fashion brand advocates. Budget ~₹2,000, micro-influencers with great engagement, any platform.',
    'Tech product launch on YouTube and Instagram. Budget ₹10,000, 3-5 influencers in tech & gaming niches, high follower counts.',
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  const handleExampleClick = (example) => {
    setInput(example);
    textareaRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('influ_buddies_token');
      // Send full conversation context for better AI understanding
      const conversationContext = messages
        .filter((m) => m.role === 'user')
        .map((m) => m.text)
        .join('\n---\n');

      const response = await fetch(`${API_URL}/api/chatbot/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          brandRequest: trimmed,
          conversationContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to analyze campaign');
        setMessages((prev) => [
          ...prev,
          { role: 'ai', text: 'Sorry, something went wrong. Please try again.' },
        ]);
        return;
      }

      setLatestResult(data);
      // Add AI response as a chat bubble
      const aiText = data.influencers?.length
        ? `Found ${data.influencers.length} influencer(s) matching your campaign! Check the results below.`
        : "I couldn't find exact matches, but I have some suggestions for you below.";
      setMessages((prev) => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      setError('Error connecting to the server');
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Connection error — please check your network and try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClear = () => {
    setInput('');
    setMessages([]);
    setLatestResult(null);
    setError('');
  };

  const showExamples = messages.length === 0 && input === '';

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>AI Campaign Matcher</h1>
        <p>Describe your campaign and let AI find the perfect influencers for you.</p>
      </div>

      {/* Example prompts – shown only when chat is empty */}
      {showExamples && (
        <div className="examples-section">
          <p className="examples-title">Try one of these to get started:</p>
          <div className="examples-list">
            {exampleRequests.map((example, idx) => (
              <button
                key={idx}
                type="button"
                className="example-btn"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat messages */}
      {messages.length > 0 && (
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble chat-bubble--${msg.role}`}>
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="typing-indicator">
              <span />
              <span />
              <span />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {error && <div className="chatbot-error">{error}</div>}

      {/* Input area */}
      <form onSubmit={handleSubmit} className="chatbot-input-area">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your campaign requirements..."
          rows="1"
          disabled={loading}
          className="campaign-textarea"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="send-btn"
          title="Send"
        >
          &#x27A4;
        </button>
      </form>

      {messages.length > 0 && (
        <button type="button" onClick={handleClear} className="clear-chat-btn">
          Clear conversation
        </button>
      )}

      {/* Last result panel */}
      {latestResult && (
        <div className="results-section">
          <div className="result-header">
            <h2>AI Recommendations</h2>
            <p className="result-message">{latestResult.message}</p>
          </div>

          {latestResult.criteria && (
            <div className="criteria-summary">
              <h4>Parsed Campaign Details</h4>
              <div className="criteria-grid">
                {latestResult.criteria.budget && (
                  <div className="criteria-item">
                    <span className="criteria-label">Budget</span>
                    <span className="criteria-value">{latestResult.criteria.budget}</span>
                  </div>
                )}
                {latestResult.criteria.engagementLevel && (
                  <div className="criteria-item">
                    <span className="criteria-label">Engagement</span>
                    <span className="criteria-value">{latestResult.criteria.engagementLevel}</span>
                  </div>
                )}
                {latestResult.criteria.campaignType && (
                  <div className="criteria-item">
                    <span className="criteria-label">Campaign Type</span>
                    <span className="criteria-value">{latestResult.criteria.campaignType}</span>
                  </div>
                )}
                {latestResult.criteria.platforms?.length > 0 && (
                  <div className="criteria-item">
                    <span className="criteria-label">Platforms</span>
                    <span className="criteria-value">
                      {latestResult.criteria.platforms.join(', ')}
                    </span>
                  </div>
                )}
                {latestResult.criteria.niches?.length > 0 && (
                  <div className="criteria-item">
                    <span className="criteria-label">Niches</span>
                    <span className="criteria-value">
                      {latestResult.criteria.niches.join(', ')}
                    </span>
                  </div>
                )}
                {latestResult.criteria.location && (
                  <div className="criteria-item">
                    <span className="criteria-label">Location</span>
                    <span className="criteria-value">{latestResult.criteria.location}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {latestResult.influencers && latestResult.influencers.length > 0 && (
            <div className="matched-influencers">
              <h3>Matched Influencers ({latestResult.influencers.length})</h3>
              <div className="influencers-grid">
                {latestResult.influencers.map((influencer) => (
                  <InfluencerCard key={influencer._id} influencer={influencer} />
                ))}
              </div>
            </div>
          )}

          {latestResult.influencers && latestResult.influencers.length === 0 && (
            <div className="no-results">
              <p>No exact matches found for your criteria.</p>
              <p>Try adjusting your requirements or explore the suggestions below.</p>
            </div>
          )}

          {latestResult.suggestion && (
            <div className="suggestion-box">
              <h3>AI Suggestions</h3>
              <p className="suggestion-text">{latestResult.suggestion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatBotPage;

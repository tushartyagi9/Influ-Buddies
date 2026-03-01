import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import InfluencerCard from '../components/InfluencerCard.jsx';
import './ChatBotPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5050';

function ChatBotPage() {
  const { user } = useAuth();
  const [campaignRequest, setCampaignRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [showExamples, setShowExamples] = useState(true);

  const exampleRequests = [
    'I want to promote a new fitness app. I have a budget of $5000, need high engagement influencers on Instagram and TikTok, based in US, with focus on health and wellness niche.',
    'Looking for sustainable fashion brand advocates. Budget around $2000, prefer micro-influencers (good engagement), any platform, environmental/sustainability focus.',
    'Tech product launch campaign. Need 3-5 influencers for YouTube and Instagram, willing to spend $10000, focus on tech and gaming niches, prefer high follower counts.',
  ];

  const handleExampleClick = (example) => {
    setCampaignRequest(example);
    setShowExamples(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!campaignRequest.trim()) {
      setError('Please describe your campaign requirements');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('influ_buddies_token');
      const response = await fetch(`${API_URL}/api/chatbot/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ brandRequest: campaignRequest })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to analyze campaign');
        return;
      }

      setResult(data);
    } catch (err) {
      setError('Error connecting to the server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCampaignRequest('');
    setResult(null);
    setError('');
    setShowExamples(true);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>🤖 AI Campaign Matcher</h1>
        <p>Describe your campaign in simple terms, and we'll find perfect influencers for you!</p>
      </div>

      <div className="chatbot-content">
        <div className="chatbot-form-section">
          <form onSubmit={handleSubmit} className="chatbot-form">
            <div className="form-group">
              <label htmlFor="campaign-input">Tell us about your campaign:</label>
              <textarea
                id="campaign-input"
                value={campaignRequest}
                onChange={(e) => setCampaignRequest(e.target.value)}
                placeholder="Example: I want to promote my new beauty product. I have a budget of $3000, need Instagram influencers with high engagement, prefer based in India..."
                rows="6"
                disabled={loading}
                className="campaign-textarea"
              />
            </div>

            {showExamples && campaignRequest === '' && (
              <div className="examples-section">
                <p className="examples-title">💡 Not sure what to write? Try these:</p>
                <div className="examples-list">
                  {exampleRequests.map((example, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="example-btn"
                      onClick={() => handleExampleClick(example)}
                    >
                      {example.substring(0, 60)}...
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <div className="error-message">⚠️ {error}</div>}

            <div className="form-buttons">
              <button
                type="submit"
                disabled={loading || !campaignRequest.trim()}
                className="submit-btn"
              >
                {loading ? 'Analyzing... ⏳' : 'Find Influencers 🔍'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="clear-btn"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {result && (
          <div className="results-section">
            <div className="result-header">
              <h2>✨ AI Recommendations</h2>
              <p className="result-message">{result.message}</p>
            </div>

            {result.influencers && result.influencers.length > 0 && (
              <div className="matched-influencers">
                <h3>👥 Matched Influencers ({result.influencers.length})</h3>
                <div className="influencers-grid">
                  {result.influencers.map((influencer) => (
                    <InfluencerCard
                      key={influencer._id}
                      influencer={influencer}
                    />
                  ))}
                </div>
              </div>
            )}

            {result.influencers && result.influencers.length === 0 && (
              <div className="no-results">
                <p>No exact matches found for this niche.</p>
                <p>But I have some great alternatives for you below! ⬇️</p>
              </div>
            )}

            <div className="suggestion-box">
              <h3>💬 What's Next?</h3>
              <p className="suggestion-text">{result.suggestion}</p>
            </div>

            <div className="criteria-summary">
              <h4>Your Campaign Details:</h4>
              <div className="criteria-grid">
                {result.criteria.budget && (
                  <div className="criteria-item">
                    <span className="criteria-label">💰 Budget:</span>
                    <span className="criteria-value">{result.criteria.budget}</span>
                  </div>
                )}
                {result.criteria.engagementLevel && (
                  <div className="criteria-item">
                    <span className="criteria-label">📊 Engagement:</span>
                    <span className="criteria-value">{result.criteria.engagementLevel}</span>
                  </div>
                )}
                {result.criteria.campaignType && (
                  <div className="criteria-item">
                    <span className="criteria-label">🎯 Campaign Type:</span>
                    <span className="criteria-value">{result.criteria.campaignType}</span>
                  </div>
                )}
                {result.criteria.platforms?.length > 0 && (
                  <div className="criteria-item">
                    <span className="criteria-label">📱 Platforms:</span>
                    <span className="criteria-value">{result.criteria.platforms.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBotPage;

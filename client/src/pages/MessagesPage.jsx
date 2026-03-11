import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchConversations, fetchMessages, sendMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import './MessagesPage.css';

export default function MessagesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const chatEndRef = useRef(null);

  // Load conversations
  useEffect(() => {
    fetchConversations()
      .then(setConversations)
      .catch(() => {})
      .finally(() => setLoadingConvos(false));
  }, []);

  // Handle ?to= param for deep-linking
  useEffect(() => {
    const to = searchParams.get('to');
    if (to && !activePartner) {
      setActivePartner({ partnerId: to, partner: { name: 'User' } });
      loadMessages(to);
    }
  }, [searchParams]);

  function loadMessages(partnerId) {
    setLoadingMsgs(true);
    fetchMessages(partnerId)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoadingMsgs(false));
  }

  function selectConversation(convo) {
    setActivePartner(convo);
    loadMessages(convo.partnerId);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || !activePartner) return;
    try {
      const msg = await sendMessage(activePartner.partnerId, input.trim());
      setMessages((prev) => [...prev, msg]);
      setInput('');
      // refresh convos
      fetchConversations().then(setConversations).catch(() => {});
    } catch {
      // ignore
    }
  }

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="messages-page">
      {/* Conversations sidebar */}
      <div className={`convo-sidebar${activePartner ? ' convo-sidebar--hidden-mobile' : ''}`}>
        <div className="convo-header">
          <h3>Messages</h3>
        </div>
        {loadingConvos ? (
          <div className="convo-loading">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="convo-empty">
            <p>No conversations yet</p>
            <span>Message an influencer to start chatting!</span>
          </div>
        ) : (
          <div className="convo-list">
            {conversations.map((c) => (
              <button
                key={c.partnerId}
                className={`convo-item${activePartner?.partnerId === c.partnerId ? ' active' : ''}`}
                onClick={() => selectConversation(c)}
              >
                <div className="convo-avatar">
                  {c.partner?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="convo-info">
                  <span className="convo-name">{c.partner?.name || 'Unknown'}</span>
                  <span className="convo-preview">{c.lastMessage}</span>
                </div>
                {c.unread > 0 && <span className="convo-badge">{c.unread}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className={`chat-area${!activePartner ? ' chat-area--hidden-mobile' : ''}`}>
        {!activePartner ? (
          <div className="chat-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <h3>Select a conversation</h3>
            <p>Choose from the sidebar or message someone from their profile</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <button className="chat-back-btn" onClick={() => setActivePartner(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <div className="chat-header-avatar">
                {activePartner.partner?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <span className="chat-header-name">{activePartner.partner?.name || 'User'}</span>
            </div>

            <div className="chat-messages">
              {loadingMsgs ? (
                <div className="chat-loading">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="chat-empty">No messages yet. Say hello!</div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m._id}
                    className={`chat-bubble${m.sender === user?.id || m.sender === user?._id ? ' mine' : ' theirs'}`}
                  >
                    <p>{m.content}</p>
                    <span className="chat-time">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                autoFocus
              />
              <button type="submit" className="chat-send-btn" disabled={!input.trim()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

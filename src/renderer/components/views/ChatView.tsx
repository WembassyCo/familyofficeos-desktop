import React, { useState } from 'react'

export const ChatView: React.FC = () => {
  const [message, setMessage] = useState('')
  const [activeConversation, setActiveConversation] = useState('1')

  const conversations = [
    { id: '1', name: 'General Family', lastMessage: 'Meeting scheduled for tomorrow', time: '2m ago', unread: 3 },
    { id: '2', name: 'Investment Committee', lastMessage: 'Portfolio review complete', time: '1h ago', unread: 0 },
    { id: '3', name: 'Sarah (Advisor)', lastMessage: 'Documents uploaded', time: '3h ago', unread: 1 },
  ]

  return (
    <div className="view chat-view">
      <div className="chat-sidebar">
        <div className="chat-header">
          <h3>Conversations</h3>
          <button className="btn-icon">➕</button>
        </div>
        <div className="conversation-list">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${activeConversation === conv.id ? 'active' : ''}`}
              onClick={() => setActiveConversation(conv.id)}
            >
              <div className="conversation-avatar">💬</div>
              <div className="conversation-info">
                <div className="conversation-name">
                  {conv.name}
                  {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                </div>
                <div className="conversation-preview">{conv.lastMessage}</div>
              </div>
              <div className="conversation-time">{conv.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-messages">
          <div className="message system">
            Welcome to secure family office chat
          </div>
        </div>
        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && setMessage('')}
          />
          <button className="btn-send">➤</button>
        </div>
      </div>
    </div>
  )
}

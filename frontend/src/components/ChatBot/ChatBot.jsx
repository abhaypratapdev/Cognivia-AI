import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: generateBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return "Hello! How can I assist you with HackAgra today?";
    } else if (lowerInput.includes('help')) {
      return "I can help you with:\n- Understanding features\n- Navigation assistance\n- Study tips\n- General questions about HackAgra\n\nWhat would you like to know?";
    } else if (lowerInput.includes('dashboard') || lowerInput.includes('stats')) {
      return "The dashboard shows your activity overview, leaderboard, revision planner, and notifications. You can track your progress and see how you're doing compared to others!";
    } else if (lowerInput.includes('quiz') || lowerInput.includes('test')) {
      return "You can take quizzes from the Quiz section. They help you test your knowledge and earn points for the leaderboard!";
    } else if (lowerInput.includes('summarizer') || lowerInput.includes('summary')) {
      return "The Smart Summarizer helps you upload files and generate summaries. It can also create mind maps to visualize your content!";
    } else if (lowerInput.includes('planner') || lowerInput.includes('plan')) {
      return "The Revision Planner helps you organize your study schedule. Create plans with subjects, hours per day, and exam dates to stay on track!";
    } else if (lowerInput.includes('buy') || lowerInput.includes('sell')) {
      return "Buy & Sell is a marketplace where you can list items for sale or browse items from other students. Great for textbooks, electronics, and more!";
    } else if (lowerInput.includes('lost') || lowerInput.includes('found')) {
      return "Lost & Found helps you report lost items or claim found items. It's a community-driven way to help each other!";
    } else {
      return "I understand you're asking about: \"" + userInput + "\". While I'm still learning, I can help you navigate HackAgra or answer general questions. Would you like to know more about any specific feature?";
    }
  };

  const toggleChat = () => {
    if (isOpen && !isMinimized) {
      setIsMinimized(true);
    } else if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
          aria-label="Open AI Chatbot"
        >
          <FiMessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[500px] sm:h-[600px] max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FiMessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-white/80">
                  {isTyping ? 'Typing...' : 'Online'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleChat}
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <FiMinimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={closeChat}
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
                title="Close"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 rounded-2xl px-4 py-2 shadow-sm border border-gray-200">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                  >
                    <FiSend className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  AI responses are simulated. Connect to a real API for production use.
                </p>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}


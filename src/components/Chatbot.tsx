import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Sprout,
  Sun,
  Droplets,
  Bug,
  Tractor,
  DollarSign,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      const welcomeMessage: Message = {
        id: '1',
        text: `Hello ${user?.firstName || 'there'}! 👋 I'm AgriBot, your friendly farming assistant. I'm here to help you with all your agricultural questions and farm management needs. How can I assist you today?`,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: [
          'Help with crop diseases',
          'Weather advice',
          'Fertilizer recommendations',
          'Pest control tips',
          'Equipment maintenance',
          'Financial planning'
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, user]);

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];

    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = `Hello ${user?.firstName || 'friend'}! 😊 Great to see you again! I'm here to help with all your farming questions. What's on your mind today?`;
      suggestions = ['Crop health check', 'Weather forecast', 'Task scheduling', 'Equipment status'];
    }
    
    // Crop-related questions
    else if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('grow')) {
      if (lowerMessage.includes('disease') || lowerMessage.includes('sick') || lowerMessage.includes('problem')) {
        response = `🌱 I can help you identify crop diseases! Common signs to look for include:\n\n• Yellow or brown leaves\n• Spots or lesions on leaves\n• Wilting despite adequate water\n• Stunted growth\n• Unusual discoloration\n\nFor accurate diagnosis, I'd recommend taking clear photos of affected plants and consulting with your local agricultural extension office. Would you like specific advice for a particular crop?`;
        suggestions = ['Tomato diseases', 'Corn problems', 'Wheat issues', 'General plant health'];
      } else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
        response = `🌿 Fertilizer recommendations depend on your soil type and crop needs! Here are some general guidelines:\n\n• **Nitrogen (N)**: Promotes leafy growth\n• **Phosphorus (P)**: Supports root development\n• **Potassium (K)**: Enhances disease resistance\n\nI recommend getting a soil test first to determine exact nutrient needs. Most crops benefit from a balanced NPK fertilizer during the growing season.`;
        suggestions = ['Soil testing', 'Organic fertilizers', 'Application timing', 'Nutrient deficiency signs'];
      } else {
        response = `🌾 I'd love to help with your crops! Are you looking for advice on:\n\n• Planting schedules and timing\n• Crop rotation strategies\n• Variety selection\n• Growth monitoring\n• Harvest planning\n\nWhat specific crop are you working with?`;
        suggestions = ['Planting calendar', 'Crop rotation', 'Variety selection', 'Harvest timing'];
      }
    }
    
    // Weather-related questions
    else if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('temperature')) {
      response = `🌤️ Weather is crucial for farming success! Here's what I can help you with:\n\n• **Planning**: Check forecasts before planting, spraying, or harvesting\n• **Protection**: Prepare for extreme weather events\n• **Irrigation**: Adjust watering based on rainfall predictions\n• **Timing**: Schedule field work during optimal conditions\n\nWould you like me to help you interpret weather data for your specific farming activities?`;
      suggestions = ['Frost protection', 'Irrigation scheduling', 'Harvest timing', 'Storm preparation'];
    }
    
    // Pest control questions
    else if (lowerMessage.includes('pest') || lowerMessage.includes('insect') || lowerMessage.includes('bug')) {
      response = `🐛 Pest management is essential for healthy crops! Here's my integrated approach:\n\n**Prevention First:**\n• Crop rotation\n• Beneficial insects\n• Healthy soil practices\n\n**Monitoring:**\n• Regular field scouting\n• Pest threshold levels\n• Early detection\n\n**Treatment Options:**\n• Biological controls\n• Targeted pesticides\n• Cultural practices\n\nWhat type of pest are you dealing with?`;
      suggestions = ['Aphid control', 'Caterpillar management', 'Beneficial insects', 'Organic pest control'];
    }
    
    // Equipment questions
    else if (lowerMessage.includes('equipment') || lowerMessage.includes('tractor') || lowerMessage.includes('machine')) {
      response = `🚜 Equipment maintenance is key to farm efficiency! Here are my top tips:\n\n**Regular Maintenance:**\n• Daily inspections\n• Oil and filter changes\n• Lubrication schedules\n• Seasonal tune-ups\n\n**Troubleshooting:**\n• Keep maintenance logs\n• Address issues early\n• Have spare parts ready\n\nWhat equipment are you having trouble with?`;
      suggestions = ['Maintenance schedule', 'Troubleshooting guide', 'Parts ordering', 'Seasonal prep'];
    }
    
    // Financial questions
    else if (lowerMessage.includes('money') || lowerMessage.includes('cost') || lowerMessage.includes('profit') || lowerMessage.includes('budget')) {
      response = `💰 Farm financial management is crucial for success! Here's how I can help:\n\n**Budgeting:**\n• Track income and expenses\n• Plan seasonal cash flow\n• Monitor profitability by crop\n\n**Cost Reduction:**\n• Optimize input usage\n• Improve efficiency\n• Bulk purchasing strategies\n\n**Revenue Enhancement:**\n• Market timing\n• Value-added products\n• Direct sales opportunities\n\nWhat financial aspect would you like to focus on?`;
      suggestions = ['Budget planning', 'Cost analysis', 'Market prices', 'Investment decisions'];
    }
    
    // Task and planning questions
    else if (lowerMessage.includes('task') || lowerMessage.includes('schedule') || lowerMessage.includes('plan')) {
      response = `📅 Good planning makes farming so much easier! I can help you with:\n\n**Seasonal Planning:**\n• Planting schedules\n• Maintenance timing\n• Harvest planning\n\n**Daily Tasks:**\n• Priority setting\n• Time management\n• Resource allocation\n\n**Long-term Goals:**\n• Crop rotation plans\n• Infrastructure improvements\n• Business expansion\n\nWhat would you like to plan for?`;
      suggestions = ['Planting schedule', 'Maintenance calendar', 'Harvest planning', 'Daily tasks'];
    }
    
    // General farming advice
    else if (lowerMessage.includes('advice') || lowerMessage.includes('tip') || lowerMessage.includes('help')) {
      response = `🌟 I'm full of farming wisdom! Here are some of my favorite tips:\n\n**Soil Health:**\n• Test soil regularly\n• Add organic matter\n• Practice crop rotation\n\n**Water Management:**\n• Monitor soil moisture\n• Use efficient irrigation\n• Collect rainwater\n\n**Record Keeping:**\n• Track everything\n• Learn from data\n• Plan improvements\n\nWhat area would you like specific advice on?`;
      suggestions = ['Soil improvement', 'Water conservation', 'Record keeping', 'Sustainable practices'];
    }
    
    // Sustainability questions
    else if (lowerMessage.includes('organic') || lowerMessage.includes('sustainable') || lowerMessage.includes('environment')) {
      response = `🌍 Sustainable farming is the future! Here's how to farm responsibly:\n\n**Soil Conservation:**\n• Cover crops\n• Minimal tillage\n• Composting\n\n**Biodiversity:**\n• Native plants\n• Beneficial insects\n• Wildlife corridors\n\n**Resource Efficiency:**\n• Water conservation\n• Energy efficiency\n• Waste reduction\n\nWhat sustainable practice interests you most?`;
      suggestions = ['Cover crops', 'Composting', 'Water conservation', 'Biodiversity'];
    }
    
    // Default response for unrecognized questions
    else {
      response = `🤔 That's an interesting question! While I might not have a specific answer for that, I'm here to help with all aspects of farming. I'm particularly knowledgeable about:\n\n• Crop management and plant health\n• Weather and irrigation\n• Pest and disease control\n• Equipment maintenance\n• Financial planning\n• Sustainable practices\n\nCould you tell me more about what you're trying to accomplish? I'd love to help!`;
      suggestions = ['Crop questions', 'Weather help', 'Equipment advice', 'Financial planning'];
    }

    return {
      id: Date.now().toString(),
      text: response,
      sender: 'bot',
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 z-50 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AgriBot</h3>
            <p className="text-xs text-green-100">Your Farming Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-white" />
            ) : (
              <Minimize2 className="w-4 h-4 text-white" />
            )}
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[480px]">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-2 rounded-full ${message.sender === 'user' ? 'bg-green-100' : 'bg-blue-100'}`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 text-green-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Suggestions */}
            {messages.length > 0 && messages[messages.length - 1].suggestions && (
              <div className="flex flex-wrap gap-2 mt-4">
                {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about farming..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
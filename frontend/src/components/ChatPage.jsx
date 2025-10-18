import React, { useState, useRef, useEffect } from 'react'
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa'
import { chatApi } from '../services/api'

// /* Функции гуглил использовал документацию и переиспользовал другой код */

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Test', 
      isBot: true,
      timestamp: new Date()
    },
    { 
      id: 2, 
      text: 'Test 2', 
      isBot: true,
      timestamp: new Date()
    },
    { 
      id: 3, 
      text: 'Test 3', 
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = { 
      id: Date.now(), 
      text: inputMessage, 
      isBot: false,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await chatApi.sendMessage(inputMessage, 'telegram_user')
      const botMessage = { 
        id: Date.now() + 1, 
        text: response.response, 
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage = { 
        id: Date.now() + 1, 
        text: 'error', 
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Чат</h1>
      
      <div className="rounded-lg h-96 overflow-y-auto p-4 mb-4 border ">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.isBot ? '' : 'text-right'}`}
          >
            <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} items-start space-x-2`}>
              {message.isBot && (
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <FaRobot size={14} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isBot
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
                    : 'bg-blue-500 text-white rounded-tr-none'
                }`}
              >
                <div className="text-sm">{message.text}</div>
                <div className={`text-xs mt-1 ${message.isBot ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100'}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
              {!message.isBot && (
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaUser size={14} className="text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center space-x-2 mb-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <FaRobot size={14} className="text-white" />
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg rounded-tl-none px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите ваше сообщение..."
          className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
        >
          <FaPaperPlane size={16} />
          <span>Отправить</span>
        </button>
      </div>
    </div>
  )
}

export default ChatPage
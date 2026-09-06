import React, { useState, useRef, useEffect } from 'react'
import { Send, User, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp?: string
}

export interface ChatWindowProps {
  messages: ChatMessage[]
  onSendMessage: (text: string) => void
  isTyping?: boolean
  suggestedPrompts?: string[]
  onSelectSuggestedPrompt?: (prompt: string) => void
  disclaimerText?: string
  placeholder?: string
  assistantName?: string
  assistantRole?: string
  assistantAvatarIcon?: React.ComponentType<{ className?: string }>
  emptyStateTitle?: string
  emptyStateSubtitle?: string
  accentColor?: string
  className?: string
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isTyping = false,
  suggestedPrompts = [],
  onSelectSuggestedPrompt,
  disclaimerText,
  placeholder = 'Type your question or request...',
  assistantName = 'ScholeOS Assistant',
  assistantRole = 'AI Copilot',
  assistantAvatarIcon: AssistantIcon = Sparkles,
  emptyStateTitle = 'How can I assist you today?',
  emptyStateSubtitle = 'Ask any question about academic performance, school finances, or student records.',
  accentColor = '#4338CA',
  className,
}) => {
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed || isTyping) return
    onSendMessage(trimmed)
    setInputText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handlePromptClick = (prompt: string) => {
    if (isTyping) return
    if (onSelectSuggestedPrompt) {
      onSelectSuggestedPrompt(prompt)
    } else {
      onSendMessage(prompt)
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-cream-surface rounded-2xl border border-cream-border/80 shadow-xs overflow-hidden',
        className
      )}
    >
      {/* 1. Header Bar */}
      <div className="px-5 py-3.5 border-b border-cream-border/80 bg-cream-surface/90 backdrop-blur-xs flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-2xs shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            <AssistantIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-charcoal-dark flex items-center gap-1.5">
              <span>{assistantName}</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                Active
              </span>
            </div>
            <p className="text-[11px] text-charcoal-muted leading-none mt-0.5">
              {assistantRole}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isTyping && (
            <span className="text-xs text-indigo-brand font-medium animate-pulse flex items-center gap-1">
              <span>Thinking</span>
              <span className="inline-block animate-bounce">.</span>
              <span className="inline-block animate-bounce [animation-delay:0.2s]">.</span>
              <span className="inline-block animate-bounce [animation-delay:0.4s]">.</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Scrollable Messages Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 font-body text-sm bg-cream-base/20">
        {/* Empty State */}
        {messages.length === 0 && (
          <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto p-4 space-y-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm mb-1"
              style={{ backgroundColor: accentColor }}
            >
              <AssistantIcon className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-charcoal-dark">
              {emptyStateTitle}
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              {emptyStateSubtitle}
            </p>
          </div>
        )}

        {/* Message Bubbles */}
        {messages.map((msg) => {
          const isUser = msg.sender === 'user'

          return (
            <div
              key={msg.id}
              className={cn(
                'flex items-end gap-2.5 animate-in fade-in-50 duration-200',
                isUser ? 'justify-end' : 'justify-start'
              )}
            >
              {/* Assistant Avatar */}
              {!isUser && (
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs mb-1"
                  style={{ backgroundColor: accentColor }}
                >
                  <AssistantIcon className="w-4 h-4" />
                </div>
              )}

              {/* Bubble Body */}
              <div
                className={cn(
                  'max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm shadow-2xs leading-relaxed whitespace-pre-wrap',
                  isUser
                    ? 'text-white rounded-br-xs font-medium'
                    : 'bg-white text-charcoal-dark border border-cream-border/80 rounded-bl-xs'
                )}
                style={isUser ? { backgroundColor: accentColor } : undefined}
              >
                {msg.text}

                {msg.timestamp && (
                  <div
                    className={cn(
                      'text-[10px] mt-1.5 text-right opacity-70',
                      isUser ? 'text-white/80' : 'text-charcoal-muted'
                    )}
                  >
                    {msg.timestamp}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-charcoal-dark text-white flex items-center justify-center shrink-0 shadow-2xs mb-1">
                  <User className="w-4 h-4 text-cream-base" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Indicator Bubble */}
        {isTyping && (
          <div className="flex items-end gap-2.5 justify-start animate-in fade-in-50 duration-200">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs mb-1"
              style={{ backgroundColor: accentColor }}
            >
              <AssistantIcon className="w-4 h-4" />
            </div>

            <div className="bg-white text-charcoal-dark border border-cream-border/80 rounded-2xl rounded-bl-xs px-4 py-3 shadow-2xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-brand/60 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-indigo-brand/60 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-brand/60 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Bottom Action Bar & Suggested Chips */}
      <div className="p-3 sm:p-4 bg-cream-surface border-t border-cream-border/80 shrink-0 space-y-2.5">
        {/* Suggested Prompt Chips (Render when empty or provided) */}
        {suggestedPrompts.length > 0 && messages.length === 0 && (
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
              Suggested Prompts:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                  disabled={isTyping}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-cream-base/70 hover:bg-indigo-50 hover:text-indigo-brand hover:border-indigo-200 text-charcoal-dark border border-cream-border transition-all duration-150 text-left disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer Text */}
        {disclaimerText && (
          <p className="text-[11px] text-charcoal-muted/80 text-center font-medium italic">
            {disclaimerText}
          </p>
        )}

        {/* Input Form */}
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isTyping}
              className="w-full bg-cream-base/50 text-charcoal-dark text-xs sm:text-sm rounded-xl py-2.5 pl-4 pr-3 border border-cream-border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-indigo-brand focus:ring-indigo-brand/20 disabled:bg-cream-base/30"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="h-10 px-4 rounded-xl text-white font-medium flex items-center justify-center transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs shrink-0"
            style={{ backgroundColor: accentColor }}
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

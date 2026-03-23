import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState('')
  const [tone, setTone] = useState('FRIENDLY')
  const [mode, setMode] = useState('reply')  // 'reply' or 'rephrase'
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const tones = [
    { name: 'FRIENDLY', emoji: '😊', color: 'from-blue-500 to-cyan-500' },
    { name: 'CARING', emoji: '🤗', color: 'from-pink-500 to-rose-500' },
    { name: 'FUNNY', emoji: '😄', color: 'from-yellow-500 to-orange-500' },
    { name: 'FLIRTY', emoji: '😉', color: 'from-purple-500 to-pink-500' },
    { name: 'PROFESSIONAL', emoji: '💼', color: 'from-gray-600 to-slate-600' }
  ]

  const generateReplies = async () => {
    if (!message.trim()) return
    
    setLoading(true)
    setError(null)
    setReplies([])  // Clear old replies to avoid confusion
    
    // Track generate event
    if (window.gtag) {
      window.gtag('event', 'generate_clicked', {
        event_category: 'engagement',
        event_label: tone,
        mode: mode
      })
    }
    
    try {
      console.log('🚀 Sending request:', { message, tone, mode })
      const response = await axios.post(`${API_URL}/api/generate-reply`, {
        message,
        tone,
        mode
      }, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      console.log('✅ Received replies:', response.data.replies)
      setReplies(response.data.replies)
      
      // Track successful generation
      if (window.gtag) {
        window.gtag('event', 'generation_success', {
          event_category: 'engagement',
          tone: tone,
          mode: mode
        })
      }
    } catch (err) {
      setError('Failed to generate replies. Please try again.')
      
      // Track generation failure
      if (window.gtag) {
        window.gtag('event', 'generation_failed', {
          event_category: 'error'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    
    // Track copy event (KEY SUCCESS METRIC)
    if (window.gtag) {
      window.gtag('event', 'copy_clicked', {
        event_category: 'engagement',
        reply_index: index + 1,
        tone: tone,
        mode: mode
      })
    }
    
    // Reset after 2 seconds
    setTimeout(() => {
      setCopiedIndex(null)
    }, 2000)
  }

  // Keyboard shortcuts - unique feature
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Cmd/Ctrl + 1/2/3 to copy replies
      if ((e.metaKey || e.ctrlKey) && ['1', '2', '3'].includes(e.key)) {
        e.preventDefault()
        const index = parseInt(e.key) - 1
        if (replies[index]) {
          copyToClipboard(replies[index].text, index)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [replies])

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Clean, Unique Header */}
        <div className="text-center mb-8 pt-6">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="relative group">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              SayRight
            </h1>
          </div>
          <p className="text-sm text-gray-600">
            AI-powered replies that sound like you
          </p>
        </div>

        {/* Mode Toggle - Clean Design */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setMode('reply')}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                mode === 'reply'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reply
            </button>
            <button
              onClick={() => setMode('rephrase')}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                mode === 'rephrase'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rephrase
            </button>
          </div>
        </div>

        {/* Input Card - Clean Design */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              {mode === 'reply' ? 'Message you received' : 'Your message'}
            </label>
            {!message.trim() && (
              <button
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText()
                    if (text) setMessage(text)
                  } catch (err) {
                    console.log('Clipboard access denied')
                  }
                }}
                className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1 transition-all"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Quick paste
              </button>
            )}
          </div>
          <textarea
            className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all resize-none text-gray-900 placeholder:text-gray-400"
            rows="4"
            placeholder={
              mode === 'reply' 
                ? "Paste the message..." 
                : "Type your message..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault()
                if (message.trim() && !loading) generateReplies()
              }
            }}
          />
          <div className="mt-2 flex items-center justify-between">
            {message.length > 0 && (
              <div className="text-xs text-gray-500">
                {message.length} characters
              </div>
            )}
            <div className="text-xs text-gray-400">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">⌘</kbd>
              <span className="mx-1">+</span>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">Enter</kbd>
              <span className="ml-1">to generate</span>
            </div>
          </div>
        </div>

        {/* Tone Selector - Clean & Centered */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Tone</p>
          <div className="flex flex-wrap justify-center gap-2">
            {tones.map(t => (
              <button
                key={t.name}
                onClick={() => setTone(t.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tone === t.name 
                    ? 'bg-black text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <span className="mr-1.5">{t.emoji}</span>
                {t.name.charAt(0) + t.name.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button - Clean Design */}
        <button
          onClick={generateReplies}
          disabled={loading || !message.trim()}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
            loading || !message.trim()
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-black text-white hover:shadow-lg active:scale-[0.98]'
          }`}
        >
          {loading 
            ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </span>
            )
            : mode === 'reply' 
              ? 'Generate Replies' 
              : 'Rephrase Message'
          }
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Loading State - Clean Skeleton */}
        {loading && (
          <div className="mt-8 animate-fade-in">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-5 border border-gray-200 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State - Clean & Minimal */}
        {!loading && replies.length === 0 && !error && (
          <div className="mt-12 text-center animate-fade-in">
            <div className="text-gray-400 mb-3">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">
              Enter a message and choose a tone to get started
            </p>
          </div>
        )}

        {replies.length > 0 && (
          <div className="mt-8 animate-fade-in">
            {/* Quick Stats - Clean & Compact */}
            <div className="flex items-center justify-between text-xs text-gray-600 mb-4 px-1">
              <div className="flex items-center gap-3">
                <span>Generated in ~2s</span>
                <span className="text-gray-400">•</span>
                <span>3 options</span>
              </div>
              <button
                onClick={generateReplies}
                disabled={loading}
                className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium transition-all disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Regenerate</span>
              </button>
            </div>
            
            {/* Reply Cards - Clean, Refined Design */}
            <div className="space-y-3">
              {replies.map((reply, i) => (
                <div 
                  key={i} 
                  className={`rounded-lg p-5 border transition-all animate-slide-up ${
                    i === 0 
                      ? 'bg-white border-black hover:shadow-md' 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                  }`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Reply Text - Clean & Readable */}
                  <div className="mb-3">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                            i === 0 ? 'bg-black text-white' : 'bg-gray-300 text-gray-700'
                          }`}>
                            {i + 1}
                          </span>
                          {i === 0 && (
                            <span className="px-2 py-0.5 bg-black text-white text-xs font-semibold rounded">
                              Best
                            </span>
                          )}
                        </div>
                        <p className="text-base text-gray-900 leading-relaxed flex-1">
                          {reply.text}
                        </p>
                      </div>
                      {/* Confidence indicator - unique visual */}
                      <div className="flex-shrink-0 flex gap-0.5">
                        {[...Array(3)].map((_, idx) => (
                          <div 
                            key={idx}
                            className={`w-1 h-4 rounded-full ${
                              idx < (3 - i) ? 'bg-black' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Bar - Copy Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="font-medium">Why:</span>
                      <span>{reply.reason}</span>
                      {mode === 'rephrase' && (
                        <>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1">
                            {reply.text.length < message.length ? (
                              <>
                                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                                <span className="text-green-600 font-medium">{message.length - reply.text.length} shorter</span>
                              </>
                            ) : reply.text.length > message.length ? (
                              <>
                                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                                <span className="text-blue-600 font-medium">+{reply.text.length - message.length}</span>
                              </>
                            ) : (
                              <span className="text-gray-500">Same length</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={() => copyToClipboard(reply.text, i)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                        copiedIndex === i
                          ? 'bg-green-600 text-white'
                          : 'bg-black text-white hover:shadow-md active:scale-[0.98]'
                      }`}
                    >
                      {copiedIndex === i ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>Copy</span>
                          <kbd className="ml-1 px-1.5 py-0.5 bg-gray-800 text-white text-xs font-mono rounded">
                            ⌘{i + 1}
                          </kbd>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Watermark - Very Subtle */}
                  <p className="text-xs text-gray-400 text-center mt-3">
                    Generated by SayRight
                  </p>
                </div>
              ))}
            </div>

            {/* Pro Tips - Minimal & Elegant */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono">⌘ ↵</kbd>
                  <span>Generate</span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono">⌘ 1-3</kbd>
                  <span>Copy</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer - Minimal */}
        <div className="mt-12 mb-8 text-center">
          <p className="text-xs text-gray-400">
            Made for better conversations
          </p>
        </div>
      </div>
    </div>
  )
}

export default App

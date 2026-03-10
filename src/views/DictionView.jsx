import { useState, useEffect, useRef } from 'react'

const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

export default function DictionView({ active, onAddTask }) {
  const [lang, setLang]             = useState('en-US')
  const [listening, setListening]   = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim]       = useState('')
  const recognitionRef = useRef(null)

  // Set up recognition once
  useEffect(() => {
    if (!SpeechRecognition) return
    const rec = new SpeechRecognition()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = lang

    rec.onresult = (e) => {
      let finalText = ''
      let interimText = ''
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalText += e.results[i][0].transcript
        } else {
          interimText += e.results[i][0].transcript
        }
      }
      if (finalText) setTranscript(prev => prev + finalText)
      setInterim(interimText)
    }

    rec.onend = () => {
      setListening(false)
      setInterim('')
    }

    rec.onerror = () => {
      setListening(false)
      setInterim('')
    }

    recognitionRef.current = rec

    return () => {
      rec.abort()
    }
  }, []) // only once

  // Update lang without recreating
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang
    }
  }, [lang])

  // Stop when navigating away
  useEffect(() => {
    if (!active && listening) {
      recognitionRef.current?.stop()
      setListening(false)
    }
  }, [active])

  function toggleListening() {
    if (!recognitionRef.current) return
    if (listening) {
      recognitionRef.current.stop()
      setListening(false)
    } else {
      recognitionRef.current.lang = lang
      recognitionRef.current.start()
      setListening(true)
    }
  }

  function handleSaveTask() {
    const text = (transcript + interim).trim()
    if (!text) return
    onAddTask({ title: text, category: 'professional', mins: 30, stars: 2 })
    setTranscript('')
    setInterim('')
  }

  function handleClear() {
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
    }
    setTranscript('')
    setInterim('')
  }

  const hasText = transcript.length > 0 || interim.length > 0

  return (
    <div id="view-diction" className={`view${active ? ' active' : ''}`}>
      <div className="header-row">
        <div>
          <div className="label">Speak your task</div>
          <h1>Diction</h1>
        </div>
      </div>

      {/* Language toggle */}
      <div className="diction-lang-toggle">
        <button
          className={`lang-btn${lang === 'en-US' ? ' active' : ''}`}
          onClick={() => setLang('en-US')}
        >
          🇺🇸 English
        </button>
        <button
          className={`lang-btn${lang === 'zh-CN' ? ' active' : ''}`}
          onClick={() => setLang('zh-CN')}
        >
          🇨🇳 中文
        </button>
      </div>

      {SpeechRecognition ? (
        <>
          {/* Mic button */}
          <div className="mic-stage">
            <div className="mic-ring-wrap">
              <div className={`mic-ring${listening ? ' listening' : ''}`} />
              <button
                className={`mic-main-btn${listening ? ' listening' : ''}`}
                onClick={toggleListening}
              >
                {listening ? '⏹' : '🎙'}
              </button>
            </div>
            <div className="mic-status">
              {listening
                ? lang === 'zh-CN' ? '正在聆听…' : 'Listening…'
                : lang === 'zh-CN' ? '点击开始录音' : 'Tap to start'}
            </div>
          </div>

          {/* Transcript */}
          <div className="transcript-box">
            {!hasText ? (
              <span className="transcript-placeholder">
                {lang === 'zh-CN'
                  ? '你说的话会出现在这里…'
                  : 'Your speech will appear here…'}
              </span>
            ) : (
              <>
                <span>{transcript}</span>
                {interim && <span className="transcript-interim">{interim}</span>}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="diction-actions">
            <button className="diction-btn clear" onClick={handleClear}>
              {lang === 'zh-CN' ? '清除' : 'Clear'}
            </button>
            <button
              className="diction-btn save"
              onClick={handleSaveTask}
              disabled={!hasText}
              style={{ opacity: hasText ? 1 : 0.4 }}
            >
              {lang === 'zh-CN' ? '保存为任务 ✅' : 'Save as Task ✅'}
            </button>
          </div>

          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-medium)', textAlign: 'center', lineHeight: 1.5 }}>
            {lang === 'zh-CN'
              ? '支持普通话 · 粤语请切换为中文后使用'
              : 'Supports English · Switch to 中文 for Mandarin'}
          </div>
        </>
      ) : (
        <div className="no-speech-msg">
          <div className="no-speech-icon">🎙️</div>
          <div>
            Speech recognition is not supported in this browser.
            <br /><br />
            Use <strong>Safari on iOS</strong> or <strong>Chrome on desktop</strong> for dictation.
          </div>
        </div>
      )}
    </div>
  )
}

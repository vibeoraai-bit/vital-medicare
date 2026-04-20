'use client'
import { useState, useRef, useEffect } from 'react'
import { X, Send, MessageCircle, Camera, Upload, Bot, Minimize2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  image?: string
}

export default function AriaChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m Aria, your Vital Medicare assistant 👋 I can help you find medications, answer health questions, or search by photo. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showImageOptions, setShowImageOptions] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraPreview, setCameraPreview] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text?: string, imageData?: string) => {
    const content = text || input
    if (!content.trim() && !imageData) return
    setLoading(true)
    setInput('')
    setShowImageOptions(false)

    const userMsg: Message = { role: 'user', content: content || 'I uploaded an image, can you identify this medication?', image: imageData }
    setMessages(prev => [...prev, userMsg])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.image
              ? [{ type: 'image_url', image_url: m.image }, { type: 'text', text: m.content }]
              : m.content
          }))
        })
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || data.message || 'I\'m here to help! Could you rephrase that?'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I\'m having trouble connecting right now. Please try again or call us at +234 801 234 5678.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      send(`I'm looking for a medication. Can you identify what's in this image and suggest similar products available at Vital Medicare?`, dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const startCamera = async () => {
    setShowCamera(true)
    setShowImageOptions(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch {
      alert('Camera access denied. Please allow camera in your browser settings.')
      setShowCamera(false)
    }
  }

  const captureImage = () => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg')
    setCameraPreview(dataUrl)
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  const sendCapturedImage = () => {
    if (!cameraPreview) return
    send('I took a photo of a medication. Can you identify it and show me similar products at Vital Medicare?', cameraPreview)
    setCameraPreview(null)
    setShowCamera(false)
  }

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setShowCamera(false)
    setCameraPreview(null)
  }

  return (
    <>
      {/* Floating Button */}
      <button onClick={() => setOpen(!open)}
        style={{ position: 'fixed', bottom: '28px', right: '28px', width: '58px', height: '58px', borderRadius: '50%', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, boxShadow: '0 4px 24px rgba(45,156,219,0.5)', transition: 'transform 0.2s' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}>
        {open ? <X size={22} color="white" /> : <MessageCircle size={24} color="white" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{ position: 'fixed', bottom: '100px', right: '28px', width: '360px', height: '520px', background: '#141C24', border: '1px solid rgba(45,156,219,0.25)', borderRadius: '20px', display: 'flex', flexDirection: 'column', zIndex: 9998, boxShadow: '0 8px 48px rgba(0,0,0,0.6)', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot size={18} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Aria</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06D6A0' }} />
                Vital Medicare AI · Online
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Minimize2 size={14} />
            </button>
          </div>

          {/* Camera View */}
          {showCamera && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0A0F14' }}>
              {cameraPreview ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', gap: '12px' }}>
                  <p style={{ color: '#E0E6ED', fontSize: '13px', textAlign: 'center' }}>Send this photo to Aria?</p>
                  <img src={cameraPreview} alt="Captured" style={{ flex: 1, objectFit: 'contain', borderRadius: '10px', border: '1px solid rgba(45,156,219,0.2)', maxHeight: '260px' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={sendCapturedImage} style={{ flex: 1, background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                      Send Photo
                    </button>
                    <button onClick={() => setCameraPreview(null)} style={{ flex: 1, background: 'rgba(45,156,219,0.1)', border: '1px solid rgba(45,156,219,0.2)', color: '#2d9cdb', borderRadius: '8px', padding: '10px', cursor: 'pointer', fontSize: '13px' }}>
                      Retake
                    </button>
                  </div>
                  <button onClick={closeCamera} style={{ background: 'transparent', border: 'none', color: '#8896A7', fontSize: '12px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px', gap: '10px' }}>
                  <p style={{ color: '#E0E6ED', fontSize: '12px', textAlign: 'center', margin: 0 }}>Point camera at medication packaging</p>
                  <div style={{ flex: 1, borderRadius: '10px', overflow: 'hidden', border: '2px solid rgba(45,156,219,0.3)', position: 'relative' }}>
                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: '10px', border: '2px dashed rgba(45,156,219,0.5)', borderRadius: '8px', pointerEvents: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={captureImage} style={{ flex: 1, background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <Camera size={14} /> Capture
                    </button>
                    <button onClick={closeCamera} style={{ flex: 1, background: 'rgba(239,35,60,0.1)', border: '1px solid rgba(239,35,60,0.2)', color: '#EF233C', borderRadius: '8px', padding: '10px', cursor: 'pointer', fontSize: '13px' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          {!showCamera && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {msg.role === 'assistant' && (
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(45,156,219,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '6px', flexShrink: 0, marginTop: '2px' }}>
                      <Bot size={13} style={{ color: '#2d9cdb' }} />
                    </div>
                  )}
                  <div style={{ maxWidth: '76%' }}>
                    {msg.image && (
                      <img src={msg.image} alt="Uploaded" style={{ width: '100%', borderRadius: '8px', marginBottom: '4px', border: '1px solid rgba(45,156,219,0.2)' }} />
                    )}
                    <div style={{ background: msg.role === 'user' ? 'linear-gradient(135deg, #2d9cdb, #1a7ab8)' : '#1a2535', color: '#E0E6ED', padding: '10px 13px', borderRadius: msg.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px', fontSize: '13px', lineHeight: 1.55 }}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(45,156,219,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={13} style={{ color: '#2d9cdb' }} />
                  </div>
                  <div style={{ background: '#1a2535', padding: '10px 14px', borderRadius: '4px 14px 14px 14px', display: 'flex', gap: '4px' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2d9cdb', opacity: 0.6, animation: `bounce 1s infinite ${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Image Options Panel */}
          {showImageOptions && !showCamera && (
            <div style={{ padding: '10px 14px', background: '#0A0F14', borderTop: '1px solid rgba(45,156,219,0.1)', display: 'flex', gap: '8px' }}>
              <button onClick={startCamera}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '10px', padding: '10px', cursor: 'pointer' }}>
                <Camera size={18} style={{ color: '#2d9cdb' }} />
                <span style={{ color: '#E0E6ED', fontSize: '11px', fontWeight: 600 }}>Camera</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', background: 'rgba(6,214,160,0.06)', border: '1px solid rgba(6,214,160,0.2)', borderRadius: '10px', padding: '10px', cursor: 'pointer' }}>
                <Upload size={18} style={{ color: '#06D6A0' }} />
                <span style={{ color: '#E0E6ED', fontSize: '11px', fontWeight: 600 }}>Upload</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            </div>
          )}

          {/* Quick Suggestions */}
          {messages.length === 1 && !showCamera && (
            <div style={{ padding: '0 14px 8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['Find Paracetamol', 'Order status', 'Delivery time', 'Book pharmacist'].map(s => (
                <button key={s} onClick={() => send(s)}
                  style={{ background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '50px', padding: '5px 12px', cursor: 'pointer', color: '#2d9cdb', fontSize: '11px', fontWeight: 500 }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          {!showCamera && (
            <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(45,156,219,0.1)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={() => setShowImageOptions(!showImageOptions)}
                title="Search by photo"
                style={{ width: '34px', height: '34px', borderRadius: '8px', background: showImageOptions ? 'rgba(45,156,219,0.2)' : 'rgba(45,156,219,0.08)', border: `1px solid ${showImageOptions ? 'rgba(45,156,219,0.4)' : 'rgba(45,156,219,0.2)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#2d9cdb' }}>
                <Camera size={15} />
              </button>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !loading && send()} placeholder="Ask about medications..."
                style={{ flex: 1, background: '#0A0F14', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '8px', padding: '9px 12px', color: '#E0E6ED', fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif' }} />
              <button onClick={() => send()} disabled={loading || !input.trim()}
                style={{ width: '34px', height: '34px', borderRadius: '8px', background: input.trim() ? 'linear-gradient(135deg, #2d9cdb, #1a7ab8)' : 'rgba(45,156,219,0.1)', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Send size={14} color={input.trim() ? 'white' : '#8896A7'} />
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }
      `}</style>
    </>
  )
}
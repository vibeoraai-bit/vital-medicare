'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, ArrowLeft, Send, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button' // Assume UI lib or inline

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return setMessage('Please enter your email')

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    setLoading(false)
    if (error) {
      setMessage(error.message)
    } else {
      setSent(true)
      setMessage('Password reset email sent! Check your inbox.')
    }
  }

  if (sent) {
    return (
      <div style={{ /* matching style */ }}>
        <button onClick={() => router.push('/login')} style={{ /* back */ }}>
          <ArrowLeft />
        </button>
        <p>{message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ /* full matching login style */ }}>
      {/* Email input matching login */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        style={inputStyle}
      />
      {message && <div style={{ errorStyle }}>{message}</div>}
      <button type="submit" disabled={loading}>
        {loading ? <Loader2 /> : <Send />}
        Send Reset Link
      </button>
      <Link href="/login">← Back to login</Link>
    </form>
  )
}

// Inline styles matching existing...
// Styles defined inline in components


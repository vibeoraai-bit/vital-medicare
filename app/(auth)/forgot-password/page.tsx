'use client'
import { useState, useEffect } from "react"
import Link from "next/link"
// import { useRouter } from "next/navigation" - unused
import { Mail, ArrowLeft, Loader2, AlertCircle, Send } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ForgotPassword() {
  const [isMobile, setIsMobile] = useState(false)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    handler()
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.trim()) {
      setMessage("Please enter your email address")
      return
    }

    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
    } else {
      setSent(true)
      setMessage("Password reset email sent! Check your inbox (including spam).")
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(10,15,20,0.8)",
    border: "1.5px solid rgba(45,156,219,0.2)",
    borderRadius: 12,
    padding: "14px 14px 14px 44px",
    fontSize: isMobile ? 16 : 14,
    color: "#E0E6ED",
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
    WebkitAppearance: "none" as const,
    transition: "border-color 0.2s ease",
    boxSizing: "border-box" as const,
  }

  const errorStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    background: "rgba(239,35,60,0.08)",
    border: "1px solid rgba(239,35,60,0.25)",
    borderRadius: 12,
    padding: "13px 16px",
    marginBottom: 22,
    color: "#EF233C",
  }

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    background: loading ? "rgba(45,156,219,0.35)" : "linear-gradient(135deg, #2d9cdb, #1a7ab8)",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "15px",
    fontSize: 15,
    fontWeight: 700 as const,
    cursor: loading ? "not-allowed" : "pointer",
    fontFamily: "DM Sans, sans-serif",
    boxShadow: loading ? "none" : "0 6px 20px rgba(45,156,219,0.28)",
    transition: "all 0.2s ease",
    marginBottom: 20,
  }

  if (sent) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0A0F14",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "DM Sans, sans-serif",
        color: "#E0E6ED",
        padding: "40px 20px",
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <Link 
            href="/login"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              color: "#2d9cdb",
              fontSize: 14,
              cursor: "pointer",
              marginBottom: 32,
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={20} />
            Back to login
          </Link>
          <div style={{
            background: "rgba(6,214,160,0.1)",
            border: "1px solid #06D6A0",
            borderRadius: 12,
            padding: "40px",
            textAlign: "center",
          }}>
            <Mail size={48} style={{ color: "#06D6A0", margin: "0 auto 20px", display: "block" }} />
            <h2 style={{ fontFamily: "Playfair Display, Georgia, serif", fontSize: "1.8rem", marginBottom: 12, lineHeight: 1.2 }}>
              Check Your Email
            </h2>
            <p style={{ color: "#8896A7", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              {message}
            </p>
            <p style={{ color: "#8896A7", fontSize: 12 }}>
              Didn&apos;t receive? Check spam folder.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0F14",
      display: "flex",
      fontFamily: "DM Sans, sans-serif",
      color: "#E0E6ED",
    }}>
      {!isMobile && (
        <div style={{
          width: 460,
          flexShrink: 0,
          background: "linear-gradient(160deg, #0D1F3C 0%, #0A1628 55%, #060B14 100%)",
          padding: "48px 52px",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -100, right: -80, width: 350, height: 350, borderRadius: "50%", background: "rgba(45,156,219,0.05)", pointerEvents: "none" }} />
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", marginBottom: 60 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #2d9cdb, #1a7ab8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px rgba(45,156,219,0.35)" }}>
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <rect x="12" y="4" width="8" height="24" rx="4" fill="white" />
                <rect x="4" y="12" width="24" height="8" rx="4" fill="white" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "Playfair Display, Georgia, serif", color: "#E0E6ED", fontSize: "1.15rem", fontWeight: 700, lineHeight: 1 }}>Vital Medicare</div>
              <div style={{ color: "#2d9cdb", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 2 }}>Pharmaceutical Ltd.</div>
            </div>
          </Link>
          <div>
            <h1 style={{ fontFamily: "Playfair Display, Georgia, serif", color: "#E0E6ED", fontSize: "2.4rem", fontWeight: 700, lineHeight: 1.2, marginBottom: 18 }}>
              Forgot Password?
            </h1>
            <p style={{ color: "#8896A7", fontSize: "15px", lineHeight: 1.8, marginBottom: 40 }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
        </div>
      )}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "40px 20px" : "32px 48px", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36, justifyContent: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #2d9cdb, #1a7ab8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 18px rgba(45,156,219,0.3)" }}>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <rect x="12" y="4" width="8" height="24" rx="4" fill="white" />
                  <rect x="4" y="12" width="24" height="8" rx="4" fill="white" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: "Playfair Display, Georgia, serif", color: "#E0E6ED", fontSize: "1.1rem", fontWeight: 700 }}>Vital Medicare</div>
                <div style={{ color: "#2d9cdb", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase" }}>Pharmaceutical Ltd.</div>
              </div>
            </div>
          )}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "Playfair Display, Georgia, serif", color: "#E0E6ED", fontSize: isMobile ? "1.8rem" : "2rem", fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>
              Reset Password
            </h2>
            <p style={{ color: "#8896A7", fontSize: 14, lineHeight: 1.6 }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          {message && (
            <div style={errorStyle}>
              <AlertCircle size={17} style={{ color: "#EF233C", flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 13, lineHeight: 1.55 }}>{message}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", color: "#E0E6ED", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8896A7", pointerEvents: "none" }} />
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value)
                    setMessage("")
                  }}
                  placeholder="your@email.com"
                  required
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#2d9cdb"
                    e.target.style.boxShadow = "0 0 0 3px rgba(45,156,219,0.12)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(45,156,219,0.2)"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={buttonStyle}
            >
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Reset Link
                </>
              )}
            </button>
          </form>
          <p style={{ textAlign: "center", color: "#8896A7", fontSize: 14 }}>
            <Link href="/login" style={{ color: "#2d9cdb", fontWeight: 700, textDecoration: "none" }}>
              ← Back to login
            </Link>
          </p>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}


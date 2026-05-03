'use client'
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const _type = searchParams.get("type") // prefixed to avoid unused
  const [isMobile, setIsMobile] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    handler()
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
      return
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters")
      return
    }
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.updateUser({
      password
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
    } else {
      setSuccess(true)
      setMessage("Password updated successfully!")
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

  if (success) {
    setTimeout(() => router.push("/login"), 2000)
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0A0F14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "DM Sans, sans-serif",
        color: "#E0E6ED",
        padding: "40px 20px",
      }}>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <ShieldCheck size={64} style={{ color: "#06D6A0", margin: "0 auto 24px", display: "block" }} />
          <h2 style={{ fontFamily: "Playfair Display, Georgia, serif", fontSize: "1.8rem", marginBottom: 12 }}>
            Password Updated!
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>
            {message} Redirecting to login...
          </p>
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
          <h1 style={{ fontFamily: "Playfair Display, Georgia, serif", color: "#E0E6ED", fontSize: "2.4rem", fontWeight: 700, lineHeight: 1.2 }}>
            Set New Password
          </h1>
          <p style={{ color: "#8896A7", fontSize: "15px", lineHeight: 1.8 }}>
            Enter your new password. It must be at least 8 characters.
          </p>
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
            <h2 style={{ fontFamily: "Playfair Display, Georgia, serif", color: "#E0E6ED", fontSize: isMobile ? "1.8rem" : "2rem", fontWeight: 700, marginBottom: 8 }}>
              New Password
            </h2>
            <p style={{ color: "#8896A7", fontSize: 14, lineHeight: 1.6 }}>
              Create a strong password (min 8 characters).
            </p>
          </div>
          {message && (
            <div style={errorStyle}>
              <AlertCircle size={17} style={{ color: "#EF233C", flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 13, lineHeight: 1.55 }}>{message}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", color: "#E0E6ED", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                New Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8896A7", pointerEvents: "none" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value)
                    setMessage("")
                  }}
                  placeholder="New password (min 8 chars)"
                  required
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#2d9cdb"
                    e.target.style.boxShadow = "0 0 0 3px rgba(45,156,219,0.12)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(45,156,219,0.2)"
                    e.target.style.boxShadow = "none"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8896A7", padding: 4, display: "flex", alignItems: "center" }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", color: "#E0E6ED", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8896A7", pointerEvents: "none" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setConfirmPassword(e.target.value)
                    setMessage("")
                  }}
                  placeholder="Confirm new password"
                  required
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#2d9cdb"
                    e.target.style.boxShadow = "0 0 0 3px rgba(45,156,219,0.12)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(45,156,219,0.2)"
                    e.target.style.boxShadow = "none"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8896A7", padding: 4, display: "flex", alignItems: "center" }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
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
                  Updating...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Update Password
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


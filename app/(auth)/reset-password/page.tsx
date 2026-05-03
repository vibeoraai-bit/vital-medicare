'use client'
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

// Copy full style from login for consistency

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
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
      setMessage("Password updated successfully! Redirecting to login...")
      setTimeout(() => router.push("/login"), 2000)
    }
  }

  // Full UI matching login page...
  if (success) {
    return <div>{message}</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
        style={inputStyle}
      />
      <input
        type={showPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm password"
        style={inputStyle}
      />
      <button type="submit" disabled={loading}>
        {loading ? <Loader2 /> : "Update Password"}
      </button>
      {message && <div>{message}</div>}
      <Link href="/login">← Back to login</Link>
    </form>
  )
}


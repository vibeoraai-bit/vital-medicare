'use client'
import { useState, useEffect, useRef } from 'react'
import PortalSidebar from '@/components/portal/PortalSidebar'
import Link from 'next/link'
import { FileText, Upload, CheckCircle, Clock, AlertCircle, XCircle, Camera, X, ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Prescription {
  id: string
  prescription_number: string
  doctor_name: string
  hospital: string
  issued_date: string
  expiry_date: string
  medications: string
  status: string
  pharmacist_notes: string
  created_at: string
}

const sColor: Record<string, string> = { Verified: '#06D6A0', Pending: '#F4A261', Rejected: '#EF233C', Expired: '#8896A7' }
const sBg: Record<string, string> = { Verified: 'rgba(6,214,160,0.1)', Pending: 'rgba(244,162,97,0.1)', Rejected: 'rgba(239,35,60,0.1)', Expired: 'rgba(136,150,167,0.1)' }
const sIcon: Record<string, React.ReactNode> = {
  Verified: <CheckCircle size={11} />, Pending: <Clock size={11} />,
  Rejected: <XCircle size={11} />, Expired: <AlertCircle size={11} />
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadMode, setUploadMode] = useState<'options' | 'camera' | 'preview' | 'success'>('options')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    loadPrescriptions()
  }, [])

  const loadPrescriptions = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setPrescriptions(data || [])
    setLoading(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => { setPreview(ev.target?.result as string); setUploadMode('preview') }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    setUploadMode('camera')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (cameraRef.current) { cameraRef.current.srcObject = stream; cameraRef.current.play() }
    } catch { alert('Camera access denied. Please allow camera in browser settings.'); setUploadMode('options') }
  }

  const capturePhoto = () => {
    if (!cameraRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = cameraRef.current.videoWidth
    canvas.height = cameraRef.current.videoHeight
    canvas.getContext('2d')?.drawImage(cameraRef.current, 0, 0)
    setPreview(canvas.toDataURL('image/jpeg'))
    streamRef.current?.getTracks().forEach(t => t.stop())
    setUploadMode('preview')
  }

  const submitUpload = async () => {
    setUploading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const rxNumber = 'RX-' + Date.now().toString().slice(-6)
      const { data: newRx } = await supabase.from('prescriptions').insert({
        user_id: user.id,
        prescription_number: rxNumber,
        doctor_name: 'Pending verification',
        hospital: 'Pending verification',
        medications: 'Under review by pharmacist',
        status: 'Pending',
        issued_date: new Date().toISOString().split('T')[0],
      }).select().single()

      if (newRx) {
        setPrescriptions(prev => [newRx, ...prev])
      }
    }
    setUploading(false)
    setUploadMode('success')
  }

  const resetUpload = () => {
    setPreview(null)
    setUploadMode('options')
    setShowUpload(false)
    streamRef.current?.getTracks().forEach(t => t.stop())
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F14', fontFamily: 'Inter, sans-serif' }}>
      <PortalSidebar active="Prescriptions" />
      <div style={{ flex: 1, overflow: 'auto' }}>

        <div style={{ background: '#141C24', padding: '20px 32px', borderBottom: '1px solid rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.5rem', fontWeight: 700 }}>My Prescriptions</h1>
            <p style={{ color: '#8896A7', fontSize: '13px', marginTop: '3px' }}>Upload and manage your prescriptions</p>
          </div>
          <button onClick={() => { setShowUpload(true); setUploadMode('options') }}
            style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 0 14px rgba(45,156,219,0.25)' }}>
            <Upload size={14} /> Upload Prescription
          </button>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* Upload Panel */}
          {showUpload && (
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '16px', padding: '28px', marginBottom: '24px', position: 'relative' }}>
              <button onClick={resetUpload}
                style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', color: '#8896A7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} />
              </button>

              {uploadMode === 'options' && (
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Upload Your Prescription</h3>
                  <p style={{ color: '#8896A7', fontSize: '13px', marginBottom: '24px' }}>Take a clear photo or upload from your gallery</p>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={startCamera}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '14px', padding: '24px 32px', cursor: 'pointer' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(45,156,219,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Camera size={24} style={{ color: '#2d9cdb' }} />
                      </div>
                      <div><div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600 }}>Take Photo</div><div style={{ color: '#8896A7', fontSize: '11px' }}>Use camera</div></div>
                    </button>
                    <button onClick={() => fileInputRef.current?.click()}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: 'rgba(6,214,160,0.06)', border: '1px solid rgba(6,214,160,0.2)', borderRadius: '14px', padding: '24px 32px', cursor: 'pointer' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(6,214,160,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageIcon size={24} style={{ color: '#06D6A0' }} />
                      </div>
                      <div><div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 600 }}>Choose File</div><div style={{ color: '#8896A7', fontSize: '11px' }}>JPG, PNG, PDF</div></div>
                    </button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileSelect} style={{ display: 'none' }} />
                </div>
              )}

              {uploadMode === 'camera' && (
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.1rem', marginBottom: '14px' }}>Position prescription clearly in frame</h3>
                  <div style={{ position: 'relative', display: 'inline-block', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(45,156,219,0.3)', maxWidth: '100%' }}>
                    <video ref={cameraRef} autoPlay playsInline style={{ width: '100%', maxWidth: '480px', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: '10px', border: '2px dashed rgba(45,156,219,0.5)', borderRadius: '8px', pointerEvents: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>
                    <button onClick={capturePhoto} style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '50px', padding: '11px 28px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Camera size={15} /> Capture
                    </button>
                    <button onClick={() => setUploadMode('options')} style={{ background: 'rgba(239,35,60,0.1)', border: '1px solid rgba(239,35,60,0.2)', color: '#EF233C', borderRadius: '50px', padding: '11px 20px', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
                  </div>
                </div>
              )}

              {uploadMode === 'preview' && preview && (
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.1rem', marginBottom: '14px' }}>Review Your Prescription</h3>
                  <img src={preview} alt="Preview" style={{ maxWidth: '360px', width: '100%', borderRadius: '10px', border: '1px solid rgba(45,156,219,0.2)', marginBottom: '16px' }} />
                  <p style={{ color: '#8896A7', fontSize: '13px', marginBottom: '18px' }}>Is the prescription text clear and readable?</p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={submitUpload} disabled={uploading}
                      style={{ background: uploading ? 'rgba(45,156,219,0.3)' : 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '8px', padding: '11px 24px', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600 }}>
                      {uploading ? 'Uploading...' : '✓ Submit to Pharmacist'}
                    </button>
                    <button onClick={() => setUploadMode('options')} style={{ background: 'transparent', border: '1px solid rgba(45,156,219,0.2)', color: '#2d9cdb', borderRadius: '8px', padding: '11px 18px', cursor: 'pointer', fontSize: '13px' }}>Retake</button>
                  </div>
                </div>
              )}

              {uploadMode === 'success' && (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <CheckCircle size={48} style={{ color: '#06D6A0', marginBottom: '12px' }} />
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.2rem', marginBottom: '8px' }}>Prescription Submitted!</h3>
                  <p style={{ color: '#8896A7', fontSize: '13px', marginBottom: '8px' }}>Our pharmacist will review and verify it within 20 minutes.</p>
                  <p style={{ color: '#2d9cdb', fontSize: '12px', marginBottom: '18px' }}>You will see it appear in your list below with &quot;Pending&quot; status.</p>
                  <button onClick={resetUpload} style={{ background: 'rgba(45,156,219,0.1)', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', color: '#2d9cdb', fontSize: '13px', fontWeight: 600 }}>
                    Upload Another
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Prescriptions List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#8896A7' }}>Loading your prescriptions...</div>
          ) : prescriptions.length === 0 && !showUpload ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', background: '#141C24', borderRadius: '16px', border: '1px solid rgba(45,156,219,0.1)' }}>
              <FileText size={48} style={{ color: 'rgba(45,156,219,0.2)', marginBottom: '16px' }} />
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.2rem', marginBottom: '8px' }}>No prescriptions yet</h3>
              <p style={{ color: '#8896A7', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px', maxWidth: '380px', margin: '0 auto 20px' }}>
                Upload your first prescription and our licensed pharmacists will verify it within 20 minutes.
              </p>
              <button onClick={() => { setShowUpload(true); setUploadMode('options') }}
                style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontWeight: 700, fontSize: '14px', boxShadow: '0 0 14px rgba(45,156,219,0.25)' }}>
                Upload First Prescription
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {prescriptions.map(rx => (
                <div key={rx.id}
                  style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.1)', borderRadius: '12px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.3)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.1)'}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(45,156,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={18} style={{ color: '#2d9cdb' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <div style={{ color: '#2d9cdb', fontSize: '12px', fontWeight: 700, marginBottom: '2px' }}>{rx.prescription_number}</div>
                    <div style={{ color: '#E0E6ED', fontSize: '13px', fontWeight: 500 }}>
                      {rx.doctor_name && rx.doctor_name !== 'Pending verification' ? rx.doctor_name : 'Awaiting pharmacist review'}
                      {rx.hospital && rx.hospital !== 'Pending verification' ? ` · ${rx.hospital}` : ''}
                    </div>
                    <div style={{ color: '#8896A7', fontSize: '11px', marginTop: '2px' }}>{rx.medications}</div>
                    {rx.pharmacist_notes && <div style={{ color: '#F4A261', fontSize: '11px', marginTop: '4px' }}>Note: {rx.pharmacist_notes}</div>}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#8896A7', fontSize: '10px' }}>Uploaded</div>
                    <div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 500 }}>
                      {rx.issued_date || new Date(rx.created_at).toLocaleDateString('en-NG')}
                    </div>
                  </div>
                  {rx.expiry_date && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#8896A7', fontSize: '10px' }}>Expires</div>
                      <div style={{ color: '#E0E6ED', fontSize: '12px', fontWeight: 500 }}>{rx.expiry_date}</div>
                    </div>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 600, color: sColor[rx.status] || '#8896A7', background: sBg[rx.status] || 'rgba(255,255,255,0.05)' }}>
                    {sIcon[rx.status]} {rx.status}
                  </span>
                  <Link href="/shop" style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', borderRadius: '7px', padding: '7px 14px', cursor: 'pointer', fontSize: '11px', fontWeight: 600, textDecoration: 'none' }}>
                    Request Refill
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
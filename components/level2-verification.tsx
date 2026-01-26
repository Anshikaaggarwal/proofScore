"use client"

import { useState, useRef, useCallback } from "react"
import {
  Camera,
  CreditCard,
  FileText,
  Check,
  X,
  Shield,
  AlertCircle,
  Loader2,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Level2VerificationProps {
  open: boolean
  onClose: () => void
  onComplete: (bonusPoints: number) => void
}

type VerificationStep = "overview" | "photo" | "aadhar" | "pan" | "processing" | "complete"

interface VerificationStatus {
  photo: "pending" | "captured" | "verified" | "failed"
  aadhar: "pending" | "submitted" | "verified" | "failed"
  pan: "pending" | "submitted" | "verified" | "failed"
}

export function Level2Verification({ open, onClose, onComplete }: Level2VerificationProps) {
  const [step, setStep] = useState<VerificationStep>("overview")
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    photo: "pending",
    aadhar: "pending",
    pan: "pending",
  })
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [aadharNumber, setAadharNumber] = useState("")
  const [panNumber, setPanNumber] = useState("")
  const [showAadhar, setShowAadhar] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setCameraActive(true)
      }
    } catch (error) {
      setCameraError("Unable to access camera. Please check permissions.")
      console.error("Camera error:", error)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      setCameraActive(false)
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedPhoto(dataUrl)
        setVerificationStatus(prev => ({ ...prev, photo: "captured" }))
        stopCamera()
      }
    }
  }, [stopCamera])

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null)
    setVerificationStatus(prev => ({ ...prev, photo: "pending" }))
    startCamera()
  }, [startCamera])

  const formatAadhar = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12)
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ")
  }

  const formatPAN = (value: string) => {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10)
  }

  const validateAadhar = (value: string) => {
    const digits = value.replace(/\s/g, "")
    return digits.length === 12 && /^\d+$/.test(digits)
  }

  const validatePAN = (value: string) => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value)
  }

  const handleAadharSubmit = () => {
    if (validateAadhar(aadharNumber)) {
      setVerificationStatus(prev => ({ ...prev, aadhar: "submitted" }))
      setStep("pan")
    }
  }

  const handlePanSubmit = () => {
    if (validatePAN(panNumber)) {
      setVerificationStatus(prev => ({ ...prev, pan: "submitted" }))
      processVerification()
    }
  }

  const processVerification = async () => {
    setStep("processing")

    await new Promise(resolve => setTimeout(resolve, 1500))
    setVerificationStatus(prev => ({ ...prev, photo: "verified" }))
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    setVerificationStatus(prev => ({ ...prev, aadhar: "verified" }))
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    setVerificationStatus(prev => ({ ...prev, pan: "verified" }))
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    setStep("complete")
  }

  const handleClose = () => {
    stopCamera()
    setStep("overview")
    setVerificationStatus({ photo: "pending", aadhar: "pending", pan: "pending" })
    setCapturedPhoto(null)
    setAadharNumber("")
    setPanNumber("")
    onClose()
  }

  const handleComplete = () => {
    const bonusPoints = 150
    onComplete(bonusPoints)
    handleClose()
  }

  const verificationItems = [
    {
      id: "photo",
      icon: Camera,
      title: "Selfie Verification",
      description: "Quick photo to verify your identity",
      bonus: "+50 pts",
      status: verificationStatus.photo,
    },
    {
      id: "aadhar",
      icon: CreditCard,
      title: "Aadhar Verification",
      description: "12-digit Aadhar number validation",
      bonus: "+50 pts",
      status: verificationStatus.aadhar,
    },
    {
      id: "pan",
      icon: FileText,
      title: "PAN Verification",
      description: "PAN card number validation",
      bonus: "+50 pts",
      status: verificationStatus.pan,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <Check className="w-4 h-4 text-void-black" />
      case "failed":
        return <X className="w-4 h-4 text-pure-white" />
      case "submitted":
      case "captured":
        return <Loader2 className="w-4 h-4 text-void-black animate-spin" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-neon-green"
      case "failed":
        return "bg-hot-pink"
      case "submitted":
      case "captured":
        return "bg-neon-yellow"
      default:
        return "bg-charcoal"
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-carbon border-white/10 p-0 gap-0 rounded-2xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-white/5 bg-gradient-to-r from-charcoal to-carbon">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-purple to-neon-cyan flex items-center justify-center">
              <Shield className="w-6 h-6 text-void-black" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-pure-white">
                Level 2 Verification
              </DialogTitle>
              <p className="text-sm text-light-gray mt-0.5">
                Boost your score by +150 points
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          {/* Overview Step */}
          {step === "overview" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-electric-purple/10 border border-electric-purple/30">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-electric-purple mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-pure-white">Privacy Protected</p>
                    <p className="text-xs text-light-gray mt-1">
                      Your documents are verified locally using zero-knowledge proofs. 
                      We never store your personal data.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {verificationItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-charcoal border border-white/5 hover:border-neon-cyan/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        item.status === "verified" 
                          ? "bg-neon-green/20" 
                          : "bg-neon-cyan/10"
                      )}>
                        <item.icon className={cn(
                          "w-5 h-5",
                          item.status === "verified" ? "text-neon-green" : "text-neon-cyan"
                        )} />
                      </div>
                      <div>
                        <p className="font-medium text-pure-white">{item.title}</p>
                        <p className="text-xs text-light-gray">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-electric-purple bg-electric-purple/10 px-2 py-1 rounded-full border border-electric-purple/30">
                        {item.bonus}
                      </span>
                      {item.status !== "pending" && (
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center",
                          getStatusColor(item.status)
                        )}>
                          {getStatusIcon(item.status)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => {
                  setStep("photo")
                  startCamera()
                }}
                className="w-full h-12 bg-gradient-to-r from-neon-cyan to-neon-green hover:opacity-90 text-void-black font-semibold rounded-lg mt-4 uppercase tracking-wide"
              >
                Start Verification
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* Photo Capture Step */}
          {step === "photo" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-pure-white">Take a Selfie</h3>
                <p className="text-sm text-light-gray">
                  Position your face in the frame
                </p>
              </div>

              <div className="relative aspect-[4/3] bg-void-black rounded-xl overflow-hidden">
                {cameraError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-4">
                    <AlertCircle className="w-12 h-12 text-hot-pink" />
                    <p className="text-sm text-light-gray">{cameraError}</p>
                    <Button
                      variant="outline"
                      onClick={startCamera}
                      className="mt-2 bg-transparent border-white/20 text-pure-white hover:bg-charcoal"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                ) : capturedPhoto ? (
                  <img
                    src={capturedPhoto || "/placeholder.svg"}
                    alt="Captured selfie"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Face guide overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-60 border-2 border-dashed border-neon-cyan/50 rounded-full" />
                    </div>
                    {/* Corner guides */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-neon-cyan rounded-tl-lg" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-neon-cyan rounded-tr-lg" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-neon-cyan rounded-bl-lg" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-neon-cyan rounded-br-lg" />
                  </>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex gap-3">
                {capturedPhoto ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={retakePhoto}
                      className="flex-1 h-12 border-white/20 text-pure-white hover:bg-charcoal bg-transparent rounded-lg"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retake
                    </Button>
                    <Button
                      onClick={() => setStep("aadhar")}
                      className="flex-1 h-12 bg-gradient-to-r from-neon-cyan to-neon-green text-void-black rounded-lg"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={capturePhoto}
                    disabled={!cameraActive}
                    className="w-full h-12 bg-gradient-to-r from-neon-cyan to-neon-green text-void-black rounded-lg"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capture Photo
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Aadhar Step */}
          {step === "aadhar" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-7 h-7 text-neon-cyan" />
                </div>
                <h3 className="font-semibold text-pure-white">Aadhar Verification</h3>
                <p className="text-sm text-light-gray">
                  Enter your 12-digit Aadhar number
                </p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type={showAadhar ? "text" : "password"}
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(formatAadhar(e.target.value))}
                    placeholder="XXXX XXXX XXXX"
                    className="h-14 text-lg font-mono text-center bg-charcoal border-white/10 rounded-lg focus:border-neon-cyan focus:ring-neon-cyan/20 pr-12 text-pure-white placeholder:text-text-muted"
                    maxLength={14}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAadhar(!showAadhar)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-light-gray hover:text-pure-white"
                  >
                    {showAadhar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {aadharNumber && !validateAadhar(aadharNumber) && (
                  <p className="text-xs text-hot-pink flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Please enter a valid 12-digit Aadhar number
                  </p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-charcoal border border-white/5">
                <p className="text-xs text-light-gray flex items-start gap-2">
                  <Lock className="w-4 h-4 text-neon-cyan flex-shrink-0 mt-0.5" />
                  Your Aadhar number is hashed locally using SHA-256. Only the hash is used for verification.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("photo")}
                  className="flex-1 h-12 border-white/20 text-pure-white hover:bg-charcoal bg-transparent rounded-lg"
                >
                  Back
                </Button>
                <Button
                  onClick={handleAadharSubmit}
                  disabled={!validateAadhar(aadharNumber)}
                  className="flex-1 h-12 bg-gradient-to-r from-neon-cyan to-neon-green text-void-black rounded-lg disabled:opacity-50"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* PAN Step */}
          {step === "pan" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-xl bg-electric-purple/10 border border-electric-purple/30 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-7 h-7 text-electric-purple" />
                </div>
                <h3 className="font-semibold text-pure-white">PAN Verification</h3>
                <p className="text-sm text-light-gray">
                  Enter your 10-character PAN number
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(formatPAN(e.target.value))}
                  placeholder="ABCDE1234F"
                  className="h-14 text-lg font-mono text-center bg-charcoal border-white/10 rounded-lg focus:border-electric-purple focus:ring-electric-purple/20 uppercase text-pure-white placeholder:text-text-muted"
                  maxLength={10}
                />
                
                {panNumber && !validatePAN(panNumber) && panNumber.length === 10 && (
                  <p className="text-xs text-hot-pink flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Invalid PAN format. Expected: AAAAA0000A
                  </p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-charcoal border border-white/5">
                <p className="text-xs text-light-gray flex items-start gap-2">
                  <Lock className="w-4 h-4 text-electric-purple flex-shrink-0 mt-0.5" />
                  Your PAN is verified using zero-knowledge proofs without revealing the actual number.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("aadhar")}
                  className="flex-1 h-12 border-white/20 text-pure-white hover:bg-charcoal bg-transparent rounded-lg"
                >
                  Back
                </Button>
                <Button
                  onClick={handlePanSubmit}
                  disabled={!validatePAN(panNumber)}
                  className="flex-1 h-12 bg-gradient-to-r from-neon-cyan to-neon-green text-void-black rounded-lg disabled:opacity-50"
                >
                  Verify All
                  <Shield className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {step === "processing" && (
            <div className="py-8 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-electric-purple flex items-center justify-center mx-auto mb-4 animate-pulse-neon">
                  <Shield className="w-8 h-8 text-void-black" />
                </div>
                <h3 className="font-semibold text-pure-white">Verifying Your Identity</h3>
                <p className="text-sm text-light-gray mt-1">
                  Processing with zero-knowledge proofs...
                </p>
              </div>

              <div className="space-y-3">
                {verificationItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all duration-500",
                      item.status === "verified"
                        ? "bg-neon-green/10 border-neon-green/30"
                        : "bg-charcoal border-white/5"
                    )}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        getStatusColor(item.status)
                      )}>
                        {item.status === "verified" ? (
                          <Check className="w-4 h-4 text-void-black" />
                        ) : (
                          <Loader2 className="w-4 h-4 text-void-black animate-spin" />
                        )}
                      </div>
                      <span className="font-medium text-pure-white">{item.title}</span>
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      item.status === "verified" ? "text-neon-green" : "text-light-gray"
                    )}>
                      {item.status === "verified" ? "Verified" : "Verifying..."}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complete Step */}
          {step === "complete" && (
            <div className="py-8 text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center mx-auto glow-box-green">
                  <Check className="w-10 h-10 text-void-black" />
                </div>
                <div className="absolute -top-2 -right-2 left-0 right-0 mx-auto w-fit">
                  <Sparkles className="w-6 h-6 text-neon-yellow animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-pure-white">Verification Complete!</h3>
                <p className="text-light-gray mt-2">
                  You have successfully completed Level 2 verification
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/30">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-sm text-light-gray">Bonus Points Earned:</span>
                  <span className="text-2xl font-bold gradient-text-static">+150</span>
                </div>
              </div>

              <Button
                onClick={handleComplete}
                className="w-full h-12 bg-gradient-to-r from-neon-cyan to-neon-green text-void-black font-semibold rounded-lg uppercase tracking-wide"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Claim Bonus & Continue
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

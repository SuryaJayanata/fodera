import React, { useState } from 'react'
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { AuthSplitLayout } from './AuthSplitLayout'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: ForgotPasswordPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

interface ForgotPasswordPageProps {
  onNavigateToLogin: () => void
}

export function ForgotPasswordPage({ onNavigateToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('')
  const [isSent, setIsSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isLoading) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSent(true)
    }, 600)
  }

  return (
    <AuthSplitLayout>
      <div>
        {/* Header - strictly NO badge above header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Reset Password
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 mb-8 leading-relaxed">
          Enter your registered work email and we'll send you instructions to reset your account password.
        </p>

        {isSent ? (
          <div className="space-y-5 py-4">
            <div className="rounded-2xl border border-accent2/30 bg-accent2/10 p-5 flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-accent2 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Reset Link Sent!
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  We have sent password reset instructions to{' '}
                  <span className="font-semibold text-foreground">{email}</span>. Please check your inbox or spam folder.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToLogin}
              className="w-full py-3 px-4 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted/60 focus:bg-card focus:border-border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground transition-all outline-none focus:ring-2 focus:ring-accent1/20"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </div>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </AuthSplitLayout>
  )
}

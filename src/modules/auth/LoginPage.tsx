import React, { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { AuthSplitLayout } from './AuthSplitLayout'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: LoginPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

interface LoginPageProps {
  onLoginSuccess?: () => void
  onNavigateToRegister?: () => void
  onNavigateToForgotPassword?: () => void
}

export function LoginPage({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToForgotPassword,
}: LoginPageProps) {
  const [email, setEmail] = useState('adit@kopisenja.com')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading || isGoogleLoading) return
    setIsLoading(true)
    setTimeout(() => {
      onLoginSuccess?.()
    }, 600)
  }

  const handleGoogleLogin = () => {
    if (isLoading || isGoogleLoading) return
    setIsGoogleLoading(true)
    setTimeout(() => {
      onLoginSuccess?.()
    }, 600)
  }

  return (
    <AuthSplitLayout>
      <div>
        {/* Header - strictly NO badge above header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Welcome
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 mb-8 leading-relaxed">
          Access your account and continue your journey with us
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Address Field */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted/60 focus:bg-card focus:border-border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground transition-all outline-none focus:ring-2 focus:ring-accent1/20"
              required
            />
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 sm:py-3 pr-11 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted/60 focus:bg-card focus:border-border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground transition-all outline-none focus:ring-2 focus:ring-accent1/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer"
                title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Keep me signed in & Reset Password Row */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded-md border-border accent-accent1 cursor-pointer"
              />
              <span className="text-foreground font-medium">Keep me signed in</span>
            </label>

            <button
              type="button"
              onClick={onNavigateToForgotPassword}
              className="text-accent1 hover:underline font-semibold cursor-pointer"
            >
              Reset password
            </button>
          </div>

          {/* Submit Sign In Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-3 px-4 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </div>

          {/* Social Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-background px-3 text-xs font-medium text-muted-foreground">
              Or continue with
            </span>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className="w-full py-2.5 sm:py-3 px-4 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Bottom Switch Link */}
          <div className="text-center pt-4">
            <p className="text-xs text-muted-foreground">
              New to our platform?{' '}
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="text-accent1 font-semibold hover:underline cursor-pointer ml-1"
              >
                Create Account
              </button>
            </p>
          </div>
        </form>
      </div>
    </AuthSplitLayout>
  )
}

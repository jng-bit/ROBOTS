import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User } from 'lucide-react';
import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-[var(--bg-secondary)] backdrop-blur-2xl border border-[var(--border-subtle)] p-8 rounded-3xl shadow-[var(--card-shadow)] overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[250px] h-[150px] bg-primary/20 blur-[80px] pointer-events-none rounded-full" />
            
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--text-main)]/5 hover:bg-[var(--text-main)]/10 p-2 rounded-full transition-all"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-8 relative z-10">
              <h2 className="text-3xl font-bold text-[var(--text-main)] mb-2">
                {isLogin ? 'Welcome Back' : 'Join Bisonix'}
              </h2>
              <p className="text-[var(--text-muted)] text-sm">
                {isLogin ? 'Enter your details to access your account' : 'Create an account to explore premium robotics'}
              </p>
            </div>

            <div className="flex bg-[var(--bg-primary)]/50 rounded-full p-1.5 mb-8 border border-[var(--border-subtle)] relative z-10">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                  isLogin ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                  !isLogin ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form className="space-y-4 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>

              {isLogin && (
                <div className="flex justify-end pt-1">
                  <a href="#" className="text-xs font-medium text-[var(--text-muted)] hover:text-primary transition-colors">
                    Forgot Password?
                  </a>
                </div>
              )}

              <button className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(255,106,0,0.25)] hover:shadow-[0_0_30px_rgba(255,106,0,0.4)] mt-4">
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4 relative z-10">
              <div className="h-[1px] flex-1 bg-[var(--border-subtle)]"></div>
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Or continue with</span>
              <div className="h-[1px] flex-1 bg-[var(--border-subtle)]"></div>
            </div>

            <button className="mt-6 w-full flex items-center justify-center gap-3 bg-[var(--text-main)] hover:bg-[var(--text-main)]/90 text-[var(--bg-primary)] font-semibold py-3.5 rounded-xl transition-all duration-300 relative z-10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.37 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.74 17.57V20.31H19.31C21.4 18.38 22.56 15.58 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.01 19.31 20.31L15.74 17.57C14.74 18.25 13.48 18.66 12 18.66C9.14 18.66 6.71 16.73 5.84 14.13H2.15V16.99C4.01 20.67 7.7 23 12 23Z" fill="#34A853"/>
                <path d="M5.84 14.13C5.62 13.47 5.49 12.75 5.49 12C5.49 11.25 5.62 10.53 5.84 9.87V7.01H2.15C1.39 8.53 0.96 10.22 0.96 12C0.96 13.78 1.39 15.47 2.15 16.99L5.84 14.13Z" fill="#FBBC05"/>
                <path d="M12 5.34C13.62 5.34 15.06 5.89 16.2 6.99L19.39 3.8C17.45 1.99 14.97 0.96 12 0.96C7.7 0.96 4.01 3.33 2.15 7.01L5.84 9.87C6.71 7.27 9.14 5.34 12 5.34Z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

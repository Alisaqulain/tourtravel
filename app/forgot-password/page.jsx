'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, KeyRound, Lock, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/lib/toast';

const STEP_EMAIL = 'email';
const STEP_OTP = 'otp';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(STEP_EMAIL);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const emailForm = useForm();
  const otpForm = useForm();

  const onEmailSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || 'Failed to send OTP');
        return;
      }
      setEmail(data.email);
      setStep(STEP_OTP);
      setSuccessMessage(json.message || 'OTP sent to your email.');
      toast.success('OTP sent. Check spam if you don\'t see it.');
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const onOtpSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      otpForm.setError('confirmPassword', { message: 'Passwords do not match' });
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: data.otp,
          newPassword: data.newPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || 'Failed to reset password');
        return;
      }
      setResetSuccess(true);
      setSuccessMessage('Password reset successfully. Redirecting to login...');
      toast.success('Password reset successfully!');
      setTimeout(() => router.push('/login?reset=success'), 2000);
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const backToEmail = () => {
    setStep(STEP_EMAIL);
    setSuccessMessage('');
    emailForm.reset();
    otpForm.reset();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link href="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-premium">
          <h1 className="text-2xl font-bold mb-2">Forgot password</h1>
          <p className="text-muted-foreground mb-6">
            {step === STEP_EMAIL
              ? 'Enter your email and we’ll send you a one-time code to reset your password.'
              : `Enter the 6-digit code sent to ${email} and choose a new password.`}
          </p>

          <AnimatePresence mode="wait">
            {step === STEP_EMAIL && (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      {...emailForm.register('email', { required: 'Email is required' })}
                    />
                  </div>
                  {emailForm.formState.errors.email && (
                    <p className="text-sm text-primary mt-1">{emailForm.formState.errors.email.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full rounded-xl" size="lg" disabled={loading}>
                  {loading ? 'Sending code...' : 'Send reset code'}
                </Button>
              </motion.form>
            )}

            {step === STEP_OTP && !resetSuccess && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                className="space-y-4"
              >
                {successMessage && (
                  <p className="text-sm text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                    {successMessage}
                  </p>
                )}
                {step === STEP_OTP && (
                  <p className="text-xs text-muted-foreground -mt-1 mb-2">If you don&apos;t see the email, check your spam or junk folder.</p>
                )}
                <div>
                  <Label htmlFor="otp">Verification code (6 digits)</Label>
                  <div className="relative mt-1">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="000000"
                      maxLength={6}
                      className="pl-10 font-mono text-lg tracking-[0.3em]"
                      {...otpForm.register('otp', {
                        required: 'Code is required',
                        pattern: { value: /^\d{6}$/, message: 'Enter 6 digits' },
                      })}
                    />
                  </div>
                  {otpForm.formState.errors.otp && (
                    <p className="text-sm text-primary mt-1">{otpForm.formState.errors.otp.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="newPassword">New password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      {...otpForm.register('newPassword', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'At least 6 characters' },
                      })}
                    />
                  </div>
                  {otpForm.formState.errors.newPassword && (
                    <p className="text-sm text-primary mt-1">{otpForm.formState.errors.newPassword.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      {...otpForm.register('confirmPassword', { required: 'Please confirm your password' })}
                    />
                  </div>
                  {otpForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-primary mt-1">{otpForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="rounded-xl flex-1" onClick={backToEmail} disabled={loading}>
                    Change email
                  </Button>
                  <Button type="submit" className="rounded-xl flex-1" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset password'}
                  </Button>
                </div>
              </motion.form>
            )}

            {step === STEP_OTP && resetSuccess && (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-6 text-center"
              >
                <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-foreground font-medium">{successMessage}</p>
                <Link href="/login" className="text-primary font-medium hover:underline mt-2">
                  Go to login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Remember your password?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}

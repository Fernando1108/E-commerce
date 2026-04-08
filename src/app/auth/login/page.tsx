'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthField from '@/components/ui/AuthField';
import StatusMessage from '@/components/ui/StatusMessage';

type LoginFormValues = { email: string; password: string };
type StatusState = 'idle' | 'loading' | 'success' | 'error';

const EMAIL_KEY = 'novastore-login-email';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<StatusState>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Active-session detection
  const [activeSession, setActiveSession] = useState<{
    email: string;
    name: string | null;
  } | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({ defaultValues: { email: '', password: '' } });

  const emailValue = watch('email');

  // ── Check for existing session on mount ─────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setActiveSession({
          email: session.user.email ?? '',
          name: session.user.user_metadata?.name ?? session.user.user_metadata?.full_name ?? null,
        });
      }
      setSessionChecked(true);
    });
  }, []);

  // Restore remembered email
  useEffect(() => {
    const saved = window.localStorage.getItem(EMAIL_KEY);
    if (saved) setValue('email', saved);
  }, [setValue]);

  // Persist email as user types
  useEffect(() => {
    if (emailValue?.trim()) {
      window.localStorage.setItem(EMAIL_KEY, emailValue);
    } else {
      window.localStorage.removeItem(EMAIL_KEY);
    }
  }, [emailValue]);

  const redirectParam = searchParams.get('redirect');
  const isValidRedirect =
    typeof redirectParam === 'string' &&
    redirectParam.startsWith('/') &&
    !redirectParam.startsWith('//');
  const redirectTarget = isValidRedirect ? redirectParam : '/homepage';

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setStatus('loading');
    setFeedbackMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus('error');
      setFeedbackMessage(
        error.message === 'Invalid login credentials'
          ? 'Correo o contraseña incorrectos.'
          : error.message
      );
      return;
    }
    setStatus('success');
    router.push(redirectTarget);
  });

  const handleGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTarget}` },
    });
  };

  // ── Sign out from existing session and stay on login ────────────────────────
  const handleSignOutAndStay = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setActiveSession(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />

      <section className="relative overflow-hidden pt-[72px]">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(28,28,28,0.8) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 right-0 h-[420px] w-[420px] rounded-full bg-[#E8E5DF] blur-[120px] opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-[#2563EB] blur-[120px] opacity-[0.06] pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 items-start">
            {/* Left */}
            <div className="max-w-2xl pt-4 lg:pt-10">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 border border-[#DDD9D3] bg-white/70 backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-[#2563EB]" />
                <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#2563EB]">
                  Acceso NovaStore
                </span>
              </div>

              <h1
                className="mt-8 font-display font-900 italic uppercase leading-[0.88] tracking-[-0.04em] text-[#1C1C1C]"
                style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
              >
                Entra y
                <br />
                <span
                  className="inline-block"
                  style={{ WebkitTextStroke: '1px rgba(28,28,28,0.22)', color: 'transparent' }}
                >
                  continúa
                </span>
                <br />
                tu compra.
              </h1>

              <p className="mt-6 max-w-xl text-base lg:text-lg leading-relaxed text-[#5A5A5A]">
                Accede con tu cuenta para retomar pedidos, revisar tu carrito y mantener una
                experiencia consistente en todo el storefront.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Acceso rápido', value: '01' },
                  { label: 'Email recordado', value: '02' },
                  { label: 'Auth real', value: '03' },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="border border-[#DDD9D3] bg-white/75 px-5 py-5 backdrop-blur-sm"
                  >
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8A8A8A]">
                      {f.label}
                    </p>
                    <p className="mt-3 text-2xl font-display font-900 text-[#1C1C1C]">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="relative">
              <div className="absolute -inset-px bg-gradient-to-br from-[#DDD9D3]/70 via-transparent to-transparent pointer-events-none" />
              <div className="relative border border-[#DDD9D3] bg-white/90 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-[0_24px_80px_rgba(28,28,28,0.08)]">
                {/* ── Active session banner ── */}
                {sessionChecked && activeSession ? (
                  <div>
                    <div className="flex items-start justify-between gap-4 border-b border-[#E6E1DA] pb-6">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#8A8A8A]">
                          Sesión activa
                        </p>
                        <h2 className="mt-3 text-3xl font-display font-900 uppercase italic text-[#1C1C1C]">
                          Ya estás dentro
                        </h2>
                      </div>
                      <span className="inline-flex items-center border border-emerald-200 bg-emerald-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">
                        Activo
                      </span>
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="border border-[#E6E1DA] bg-[#FCFBF9] px-5 py-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#8A8A8A]">
                          Ya tienes sesión activa como
                        </p>
                        <p className="mt-2 text-[15px] font-600 text-[#1C1C1C] break-all">
                          {activeSession.email}
                        </p>
                      </div>

                      <button
                        onClick={() => router.push(redirectTarget)}
                        className="inline-flex h-14 w-full items-center justify-center bg-[#1C1C1C] px-6 text-[11px] font-black uppercase tracking-[0.28em] text-white transition hover:bg-[#2563EB]"
                      >
                        Continuar{activeSession.name ? ` como ${activeSession.name}` : ''}
                      </button>

                      <button
                        onClick={handleSignOutAndStay}
                        className="inline-flex h-12 w-full items-center justify-center border border-[#DDD9D3] px-6 text-[11px] font-black uppercase tracking-[0.24em] text-[#5A5A5A] transition hover:border-[#1C1C1C] hover:text-[#1C1C1C]"
                      >
                        Cerrar sesión e ingresar con otra cuenta
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── Normal login form ── */
                  <div>
                    <div className="flex items-start justify-between gap-4 border-b border-[#E6E1DA] pb-6">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#8A8A8A]">
                          Formulario de acceso
                        </p>
                        <h2 className="mt-3 text-3xl font-display font-900 uppercase italic text-[#1C1C1C]">
                          Inicia sesión
                        </h2>
                      </div>
                      <span className="inline-flex items-center border border-[#D8E4FF] bg-[#EFF6FF] px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#2563EB]">
                        Seguro
                      </span>
                    </div>

                    <div className="mt-8">
                      <form className="space-y-5" onSubmit={onSubmit}>
                        <div className="grid gap-5">
                          <AuthField
                            label="Email"
                            type="email"
                            placeholder="tu@email.com"
                            registration={register('email', {
                              required: 'El email es obligatorio.',
                              pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: 'Ingresa un email válido.',
                              },
                            })}
                            error={errors.email}
                          />
                          <AuthField
                            label="Contraseña"
                            type="password"
                            placeholder="Tu contraseña"
                            registration={register('password', {
                              required: 'La contraseña es obligatoria.',
                              minLength: { value: 6, message: 'Mínimo 6 caracteres.' },
                            })}
                            error={errors.password}
                          />
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t border-[#E6E1DA] pt-6">
                          <Link
                            href="/auth/register"
                            className="text-[11px] font-black uppercase tracking-[0.24em] text-[#1C1C1C] transition hover:text-[#2563EB]"
                          >
                            Registrarse
                          </Link>
                          <Link
                            href="/auth/forgot-password"
                            className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8A8A8A] transition hover:text-[#1C1C1C]"
                          >
                            Olvidé contraseña
                          </Link>
                        </div>

                        {feedbackMessage && status !== 'idle' && (
                          <StatusMessage
                            message={feedbackMessage}
                            type={status === 'success' ? 'success' : 'error'}
                          />
                        )}

                        <button
                          type="submit"
                          disabled={status === 'loading'}
                          className="inline-flex h-14 w-full items-center justify-center bg-[#1C1C1C] px-6 text-[11px] font-black uppercase tracking-[0.28em] text-white transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:bg-[#8A8A8A]"
                        >
                          {status === 'loading' ? 'Cargando...' : 'Continuar'}
                        </button>

                        <button
                          type="button"
                          onClick={handleGoogle}
                          className="inline-flex h-14 w-full items-center justify-center gap-3 border border-[#DDD9D3] bg-white px-6 text-[11px] font-black uppercase tracking-[0.28em] text-[#1C1C1C] transition hover:border-[#1C1C1C] hover:bg-[#F8F7F5]"
                        >
                          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                            <path
                              fill="#EA4335"
                              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                            />
                            <path
                              fill="#4285F4"
                              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                            />
                            <path
                              fill="#34A853"
                              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                            />
                          </svg>
                          Continuar con Google
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
          <div className="size-8 border-2 border-[#1C1C1C] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

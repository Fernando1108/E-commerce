'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthField from '@/components/ui/AuthField';
import StatusMessage from '@/components/ui/StatusMessage';

type StatusState = 'idle' | 'loading' | 'success' | 'error';

type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const [status, setStatus] = useState<StatusState>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=/profile` },
    });
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');

  const onSubmit = handleSubmit(async ({ fullName, email, password }) => {
    setStatus('loading');
    setFeedbackMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: fullName.trim() } },
    });

    if (error) {
      setStatus('error');
      setFeedbackMessage(error.message);
      return;
    }

    // Send welcome email (non-blocking)
    try {
      await fetch('/api/auth/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: fullName.trim() }),
      });
    } catch {
      // Welcome email is non-critical
    }

    setStatus('success');
    setFeedbackMessage(
      'Cuenta creada correctamente. Revisa tu correo para confirmar tu email antes de iniciar sesión.'
    );
  });

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />

      <section className="relative overflow-hidden pt-[72px]">
        <div className="absolute inset-0 pointer-events-none opacity-[0.025] bg-dot-pattern" />
        <div className="absolute top-0 right-0 h-[420px] w-[420px] rounded-full bg-[#E8E5DF] blur-[120px] opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-[#2563EB] blur-[120px] opacity-[0.06] pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 items-start">
            {/* Left */}
            <div className="max-w-2xl pt-4 lg:pt-10">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 border border-[#DDD9D3] bg-white/70 backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-[#2563EB]" />
                <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#2563EB]">
                  Registro NovaStore
                </span>
              </div>

              <h1
                className="mt-8 font-display font-900 italic uppercase leading-[0.88] tracking-[-0.04em] text-[#1C1C1C]"
                style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
              >
                Crea una
                <br />
                <span
                  className="inline-block"
                  style={{ WebkitTextStroke: '1px rgba(28,28,28,0.22)', color: 'transparent' }}
                >
                  cuenta con
                </span>
                <br />
                criterio.
              </h1>

              <p className="mt-6 max-w-xl text-base lg:text-lg leading-relaxed text-[#5A5A5A]">
                Registra tus datos para acelerar futuros pedidos con autenticación real vía
                Supabase.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Datos completos', value: '01' },
                  { label: 'Validación clara', value: '02' },
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
                <div className="flex items-start justify-between gap-4 border-b border-[#E6E1DA] pb-6">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#8A8A8A]">
                      Formulario de registro
                    </p>
                    <h2 className="mt-3 text-3xl font-display font-900 uppercase italic text-[#1C1C1C]">
                      Crear cuenta
                    </h2>
                  </div>
                  <span className="inline-flex items-center border border-[#D8E4FF] bg-[#EFF6FF] px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#2563EB]">
                    Seguro
                  </span>
                </div>

                <div className="mt-8">
                  <form className="space-y-5" onSubmit={onSubmit}>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <AuthField
                        label="Nombre Completo"
                        type="text"
                        placeholder="Ingresa tu nombre"
                        registration={register('fullName', {
                          required: 'El nombre completo es obligatorio.',
                          minLength: { value: 3, message: 'Ingresa un nombre más completo.' },
                        })}
                        error={errors.fullName}
                        className="sm:col-span-2"
                      />

                      <AuthField
                        label="Email"
                        type="email"
                        placeholder="tu@email.com"
                        registration={register('email', {
                          required: 'El email es obligatorio.',
                          pattern: { value: /\S+@\S+\.\S+/, message: 'Ingresa un email válido.' },
                        })}
                        error={errors.email}
                        className="sm:col-span-2"
                      />

                      <AuthField
                        label="Contraseña"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        registration={register('password', {
                          required: 'La contraseña es obligatoria.',
                          minLength: { value: 6, message: 'Mínimo 6 caracteres.' },
                        })}
                        error={errors.password}
                      />

                      <AuthField
                        label="Confirmar Contraseña"
                        type="password"
                        placeholder="Repite tu contraseña"
                        registration={register('confirmPassword', {
                          required: 'Debes confirmar la contraseña.',
                          validate: (v) => v === passwordValue || 'Las contraseñas no coinciden.',
                        })}
                        error={errors.confirmPassword}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-[#E6E1DA] pt-6">
                      <Link
                        href="/auth/login"
                        className="text-[11px] font-black uppercase tracking-[0.24em] text-[#1C1C1C] transition hover:text-[#2563EB]"
                      >
                        Ya tengo cuenta
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
                      disabled={status === 'loading' || status === 'success'}
                      className="inline-flex h-14 w-full items-center justify-center bg-[#1C1C1C] px-6 text-[11px] font-black uppercase tracking-[0.28em] text-white transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:bg-[#8A8A8A]"
                    >
                      {status === 'loading' ? 'Creando cuenta...' : 'Registrarse'}
                    </button>
                  </form>

                  <div className="flex items-center gap-4 mt-5">
                    <span className="flex-1 h-px bg-[#E6E1DA]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8A8A]">
                      O
                    </span>
                    <span className="flex-1 h-px bg-[#E6E1DA]" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogle}
                    className="mt-4 inline-flex h-12 w-full items-center justify-center gap-3 border border-[#DDD9D3] bg-white px-6 text-[11px] font-black uppercase tracking-[0.22em] text-[#1C1C1C] transition hover:border-[#1C1C1C] hover:bg-[#F8F7F5]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continuar con Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

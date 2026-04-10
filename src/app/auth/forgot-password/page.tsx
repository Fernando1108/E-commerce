'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthField from '@/components/ui/AuthField';
import StatusMessage from '@/components/ui/StatusMessage';

type StatusState = 'idle' | 'loading' | 'success' | 'error';

type ForgotFormValues = { email: string };

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<StatusState>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({ defaultValues: { email: '' } });

  const onSubmit = handleSubmit(async ({ email }) => {
    setStatus('loading');
    setFeedbackMessage(null);

    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?redirect=/auth/reset-password`,
    });

    if (error) {
      setStatus('error');
      setFeedbackMessage(error.message);
      return;
    }

    setStatus('success');
    setFeedbackMessage(
      `Si ${email} existe en NovaStore, recibirás instrucciones para restablecer tu contraseña.`
    );
  });

  return (
    <main className="min-h-screen bg-[#FAF9F7] dark:bg-slate-900">
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
              <div className="inline-flex items-center gap-3 px-5 py-2.5 border border-[#DDD9D3] dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-[#2563EB]" />
                <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#2563EB]">
                  Recuperación NovaStore
                </span>
              </div>

              <h1
                className="mt-8 font-display font-900 italic uppercase leading-[0.88] tracking-[-0.04em] text-[#1C1C1C] dark:text-slate-100"
                style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
              >
                Recupera el
                <br />
                <span
                  className="inline-block"
                  style={{ WebkitTextStroke: '1px rgba(28,28,28,0.22)', color: 'transparent' }}
                >
                  acceso sin
                </span>
                <br />
                fricción.
              </h1>

              <p className="mt-6 max-w-xl text-base lg:text-lg leading-relaxed text-[#5A5A5A] dark:text-slate-300">
                Enviaremos un enlace de restablecimiento a tu correo. El mensaje de éxito no revela
                si el correo existe — comportamiento correcto para producción.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Paso único', value: '01' },
                  { label: 'Respuesta clara', value: '02' },
                  { label: 'Auth real', value: '03' },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="border border-[#DDD9D3] dark:border-slate-700 bg-white/75 px-5 py-5 backdrop-blur-sm"
                  >
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8A8A8A] dark:text-slate-400">
                      {f.label}
                    </p>
                    <p className="mt-3 text-2xl font-display font-900 text-[#1C1C1C] dark:text-slate-100">
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="relative">
              <div className="absolute -inset-px bg-gradient-to-br from-[#DDD9D3]/70 via-transparent to-transparent pointer-events-none" />
              <div className="relative border border-[#DDD9D3] dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-[0_24px_80px_rgba(28,28,28,0.08)]">
                <div className="flex items-start justify-between gap-4 border-b border-[#E6E1DA] pb-6">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#8A8A8A] dark:text-slate-400">
                      Restablecer acceso
                    </p>
                    <h2 className="mt-3 text-3xl font-display font-900 uppercase italic text-[#1C1C1C] dark:text-slate-100">
                      Olvidé mi contraseña
                    </h2>
                  </div>
                  <span className="inline-flex items-center border border-[#D8E4FF] bg-[#EFF6FF] px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#2563EB]">
                    Seguro
                  </span>
                </div>

                <div className="mt-8">
                  <form className="space-y-5" onSubmit={onSubmit}>
                    <AuthField
                      label="Email"
                      type="email"
                      placeholder="tu@email.com"
                      registration={register('email', {
                        required: 'El email es obligatorio.',
                        pattern: { value: /\S+@\S+\.\S+/, message: 'Ingresa un email válido.' },
                      })}
                      error={errors.email}
                    />

                    <div className="flex items-center justify-between gap-4 border-t border-[#E6E1DA] pt-6">
                      <Link
                        href="/auth/login"
                        className="text-[11px] font-black uppercase tracking-[0.24em] text-[#1C1C1C] dark:text-slate-100 transition hover:text-[#2563EB]"
                      >
                        Volver al acceso
                      </Link>
                      <Link
                        href="/auth/register"
                        className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8A8A8A] dark:text-slate-400 transition hover:text-[#1C1C1C] dark:text-slate-100"
                      >
                        Registrarse
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
                      {status === 'loading' ? 'Enviando...' : 'Enviar instrucciones'}
                    </button>
                  </form>
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

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

import AuthField from '@/components/ui/AuthField';
import StatusMessage from '@/components/ui/StatusMessage';

type StatusState = 'idle' | 'loading' | 'success' | 'error';

type SettingsFormValues = {
  name: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ProfileSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<StatusState>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    defaultValues: { name: '', newPassword: '', confirmPassword: '' },
  });

  const newPasswordValue = watch('newPassword');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/profile/settings');
    }
    if (user) {
      const name =
        user.user_metadata?.name ??
        user.user_metadata?.full_name ??
        user.email?.split('@')[0] ??
        '';
      reset({ name, newPassword: '', confirmPassword: '' });
      setAvatarPreview(user.user_metadata?.avatar_url ?? null);
    }
  }, [loading, user, router, reset]);

  const onSubmit = handleSubmit(async ({ name, newPassword }) => {
    setStatus('loading');
    setFeedbackMessage(null);

    const supabase = createClient();
    const updates: Record<string, unknown> = {};

    if (name.trim()) {
      updates.data = { name: name.trim() };
    }
    if (newPassword) {
      updates.password = newPassword;
    }

    if (Object.keys(updates).length === 0) {
      setStatus('idle');
      return;
    }

    const { error } = await supabase.auth.updateUser(
      updates as Parameters<typeof supabase.auth.updateUser>[0]
    );

    if (error) {
      setStatus('error');
      setFeedbackMessage(error.message);
      return;
    }

    setStatus('success');
    setFeedbackMessage('Los cambios se guardaron correctamente.');
    reset({ name: name.trim(), newPassword: '', confirmPassword: '' });
  });

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
        <div className="absolute top-0 right-0 h-[360px] w-[360px] rounded-full bg-[#E8E5DF] blur-[120px] opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[280px] w-[280px] rounded-full bg-[#2563EB] blur-[120px] opacity-[0.05] pointer-events-none" />

        <div className="relative mx-auto max-w-[1440px] px-6 py-14 lg:px-12 lg:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* Left */}
            <div className="max-w-xl pt-4 lg:pt-10">
              <div className="inline-flex items-center gap-3 border border-[#DDD9D3] bg-white/70 px-5 py-2.5 backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-[#2563EB]" />
                <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#2563EB]">
                  Configuración de perfil
                </span>
              </div>

              <h1
                className="mt-8 font-display font-900 italic uppercase leading-[0.88] tracking-[-0.04em] text-[#1C1C1C]"
                style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
              >
                Ajusta tu
                <br />
                <span
                  className="inline-block"
                  style={{ WebkitTextStroke: '1px rgba(28,28,28,0.22)', color: 'transparent' }}
                >
                  identidad
                </span>
                <br />
                visible.
              </h1>

              <p className="mt-6 text-base leading-relaxed text-[#5A5A5A] lg:text-lg">
                Actualiza tu nombre o contraseña. Los cambios se aplican directamente en Supabase
                Auth.
              </p>

              <div className="mt-10 border border-[#DDD9D3] bg-white/85 p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8A8A8A]">
                  Avatar actual
                </p>
                <div className="mt-5 flex justify-center">
                  <div className="flex size-32 items-center justify-center overflow-hidden rounded-full border border-[#DDD9D3] bg-[#EFEDE9]">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm text-[#8A8A8A]">Sin imagen</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="relative">
              <div className="absolute -inset-px bg-gradient-to-br from-[#DDD9D3]/70 via-transparent to-transparent pointer-events-none" />
              <div className="relative border border-[#DDD9D3] bg-white/90 p-6 shadow-[0_24px_80px_rgba(28,28,28,0.08)] backdrop-blur-xl sm:p-8 lg:p-10">
                <div className="flex items-start justify-between gap-4 border-b border-[#E6E1DA] pb-6">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#8A8A8A]">
                      Datos del perfil
                    </p>
                    <h2 className="mt-3 text-3xl font-display font-900 uppercase italic text-[#1C1C1C]">
                      Editar perfil
                    </h2>
                  </div>
                  <span className="inline-flex items-center border border-[#D8E4FF] bg-[#EFF6FF] px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#2563EB]">
                    Supabase Auth
                  </span>
                </div>

                {loading ? (
                  <p className="mt-8 text-base leading-relaxed text-[#8A8A8A]">
                    Cargando configuración...
                  </p>
                ) : (
                  <form className="mt-8 space-y-5" onSubmit={onSubmit}>
                    <div className="grid gap-5">
                      <AuthField
                        label="Nombre"
                        type="text"
                        placeholder="Tu nombre"
                        registration={register('name', {
                          minLength: { value: 2, message: 'Mínimo 2 caracteres.' },
                        })}
                        error={errors.name}
                      />

                      <div className="border border-[#E6E1DA] bg-[#F8F7F5] px-4 py-3 text-sm text-[#5A5A5A]">
                        <span className="font-black text-[10px] uppercase tracking-widest text-[#8A8A8A] block mb-1">
                          Email
                        </span>
                        {user?.email ?? '—'}
                        <span className="block mt-1 text-[11px] text-[#8A8A8A]">
                          El email no puede cambiarse aquí.
                        </span>
                      </div>

                      <AuthField
                        label="Nueva contraseña (opcional)"
                        type="password"
                        placeholder="Dejar en blanco para no cambiar"
                        registration={register('newPassword', {
                          minLength: { value: 6, message: 'Mínimo 6 caracteres.' },
                        })}
                        error={errors.newPassword}
                      />

                      {newPasswordValue && (
                        <AuthField
                          label="Confirmar nueva contraseña"
                          type="password"
                          placeholder="Repite la nueva contraseña"
                          registration={register('confirmPassword', {
                            validate: (v) =>
                              !newPasswordValue ||
                              v === newPasswordValue ||
                              'Las contraseñas no coinciden.',
                          })}
                          error={errors.confirmPassword}
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-[#E6E1DA] pt-6">
                      <Link
                        href="/profile"
                        className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8A8A8A] transition hover:text-[#1C1C1C]"
                      >
                        Volver al perfil
                      </Link>
                    </div>

                    <StatusMessage
                      type={status === 'error' ? 'error' : 'success'}
                      message={status !== 'idle' ? feedbackMessage : null}
                    />

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="inline-flex h-14 w-full items-center justify-center bg-[#1C1C1C] px-6 text-[11px] font-black uppercase tracking-[0.28em] text-white transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:bg-[#8A8A8A]"
                    >
                      {status === 'loading' ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </form>
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

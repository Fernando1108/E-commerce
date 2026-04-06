'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthField from '@/features/auth/components/AuthField';
import AuthStatusMessage from '@/features/auth/components/AuthStatusMessage';
import { accountService } from '@/features/account/services/account.service';
import type { UpdateProfileInput, UserProfile } from '@/features/account/types';
import type { AuthStatus } from '@/features/auth/types';

export default function ProfileSettingsPage() {
  const [initialProfile, setInitialProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    defaultValues: {
      name: '',
      email: '',
      address: '',
      avatar: '',
    },
  });

  const avatarPreview = watch('avatar');

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoadingProfile(true);
      setFeedbackMessage(null);

      try {
        const profile = await accountService.getProfile();
        setInitialProfile(profile);
        reset({
          name: profile.name,
          email: profile.email,
          address: profile.address,
          avatar: profile.avatar,
        });
      } catch (error) {
        setStatus('error');
        setFeedbackMessage(
          error instanceof Error ? error.message : 'No fue posible cargar la configuración del perfil.'
        );
      } finally {
        setIsLoadingProfile(false);
      }
    };

    void loadProfile();
  }, [reset]);

  const onSubmit = handleSubmit(async (values) => {
    setStatus('loading');
    setFeedbackMessage(null);

    try {
      const updatedProfile = await accountService.updateProfile(values);
      setInitialProfile(updatedProfile);
      reset({
        name: updatedProfile.name,
        email: updatedProfile.email,
        address: updatedProfile.address,
        avatar: updatedProfile.avatar,
      });
      setStatus('success');
      setFeedbackMessage('Los cambios del perfil se guardaron correctamente.');
    } catch (error) {
      setStatus('error');
      setFeedbackMessage(
        error instanceof Error ? error.message : 'No fue posible guardar los cambios.'
      );
    }
  });

  const handleCancel = () => {
    if (!initialProfile) {
      return;
    }

    reset({
      name: initialProfile.name,
      email: initialProfile.email,
      address: initialProfile.address,
      avatar: initialProfile.avatar,
    });
    setStatus('idle');
    setFeedbackMessage(null);
  };

  const avatarRegistration = register('avatar', {
    required: 'La URL del avatar es obligatoria.',
    pattern: {
      value: /^(https?:\/\/|\/|data:image\/).+/,
      message: 'Ingresa una URL valida, una ruta interna o una imagen cargada.',
    },
  });

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(new Error('No fue posible leer la imagen seleccionada.'));
        reader.readAsDataURL(file);
      });

      setValue('avatar', dataUrl, { shouldDirty: true, shouldValidate: true });
      setStatus('idle');
      setFeedbackMessage(null);
    } catch (error) {
      setStatus('error');
      setFeedbackMessage(
        error instanceof Error ? error.message : 'No fue posible cargar el avatar.'
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />

      <section className="relative overflow-hidden pt-[72px]">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(28,28,28,0.8) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 right-0 h-[360px] w-[360px] rounded-full bg-[#E8E5DF] blur-[120px] opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[280px] w-[280px] rounded-full bg-[#2563EB] blur-[120px] opacity-[0.05] pointer-events-none" />

        <div className="relative mx-auto max-w-[1440px] px-6 py-14 lg:px-12 lg:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="max-w-xl pt-4 lg:pt-10">
              <div className="inline-flex items-center gap-3 border border-[#DDD9D3] bg-white/70 px-5 py-2.5 backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-[#2563EB]" />
                <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#2563EB]">
                  Configuracion de perfil
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
                  style={{
                    WebkitTextStroke: '1px rgba(28,28,28,0.22)',
                    color: 'transparent',
                  }}
                >
                  identidad
                </span>
                <br />
                visible.
              </h1>

              <p className="mt-6 text-base leading-relaxed text-[#5A5A5A] lg:text-lg">
                Esta vista permite actualizar los datos base del perfil dentro del entorno mock de NovaStore. El objetivo es dejar lista la estructura para una integración real posterior.
              </p>

              <div className="mt-10 border border-[#DDD9D3] bg-white/85 p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8A8A8A]">
                  Preview de avatar
                </p>
                <div className="mt-5 flex justify-center">
                  <div className="flex size-32 items-center justify-center overflow-hidden rounded-full border border-[#DDD9D3] bg-[#EFEDE9]">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Preview del avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm text-[#8A8A8A]">Sin imagen</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

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
                    Mock activo
                  </span>
                </div>

                {isLoadingProfile ? (
                  <p className="mt-8 text-base leading-relaxed text-[#8A8A8A]">
                    Cargando configuración...
                  </p>
                ) : (
                  <form className="mt-8 space-y-5" onSubmit={onSubmit}>
                    <div className="grid gap-5">
                      <AuthField
                        label="Name"
                        type="text"
                        placeholder="Ingresa tu nombre"
                        registration={register('name', {
                          required: 'El nombre es obligatorio.',
                          minLength: {
                            value: 3,
                            message: 'Ingresa un nombre mas completo.',
                          },
                        })}
                        error={errors.name}
                      />

                      <AuthField
                        label="Email"
                        type="email"
                        placeholder="correo@novastore.com"
                        registration={register('email', {
                          required: 'El email es obligatorio.',
                          pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: 'Ingresa un email valido.',
                          },
                        })}
                        error={errors.email}
                      />

                      <AuthField
                        label="Address"
                        type="text"
                        placeholder="Ingresa tu direccion"
                        registration={register('address', {
                          required: 'La direccion es obligatoria.',
                          minLength: {
                            value: 8,
                            message: 'Ingresa una direccion mas completa.',
                          },
                        })}
                        error={errors.address}
                      />

                      <AuthField
                        label="Avatar"
                        type="url"
                        placeholder="https://ejemplo.com/avatar.png"
                        registration={avatarRegistration}
                        error={errors.avatar}
                      />

                      <label className="block">
                        <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-[#5A5A5A]">
                          Cargar nuevo avatar
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileChange}
                          className="w-full border border-[#DDD9D3] bg-[#FCFBF9] px-4 py-4 text-[13px] text-[#1C1C1C] outline-none transition file:mr-4 file:border-0 file:bg-[#1C1C1C] file:px-4 file:py-2 file:text-[11px] file:font-black file:uppercase file:tracking-[0.24em] file:text-white hover:file:bg-[#2563EB] focus:border-[#1C1C1C] focus:bg-white"
                        />
                        <span className="mt-2 block text-sm leading-relaxed text-[#8A8A8A]">
                          Puedes pegar una URL o cargar otra imagen desde tu equipo y cambiarla cuando quieras.
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-[#E6E1DA] pt-6">
                      <Link
                        href="/profile"
                        className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8A8A8A] transition hover:text-[#1C1C1C]"
                      >
                        Volver al perfil
                      </Link>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="text-[11px] font-black uppercase tracking-[0.24em] text-[#1C1C1C] transition hover:text-[#2563EB]"
                      >
                        Cancelar
                      </button>
                    </div>

                    <AuthStatusMessage status={status} message={feedbackMessage} />

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="inline-flex h-14 w-full items-center justify-center bg-[#1C1C1C] px-6 text-[11px] font-black uppercase tracking-[0.28em] text-white transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:bg-[#8A8A8A]"
                    >
                      {status === 'loading' ? 'Guardando cambios...' : 'Guardar cambios'}
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

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import AuthField from '@/features/auth/components/AuthField';
import AuthShell from '@/features/auth/components/AuthShell';
import AuthStatusMessage from '@/features/auth/components/AuthStatusMessage';
import { authService } from '@/features/auth/services/auth.service';
import type { AuthStatus, RegisterFormValues } from '@/features/auth/types';

export default function RegisterPage() {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  });

  const passwordValue = watch('password');

  const onSubmit = handleSubmit(async (values) => {
    setStatus('loading');
    setFeedbackMessage(null);

    try {
      const result = await authService.register(values);
      setStatus('success');
      setFeedbackMessage(result.message);
    } catch (error) {
      setStatus('error');
      setFeedbackMessage(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    }
  });

  return (
    <AuthShell
      eyebrow="Registro NovaStore"
      title={
        <>
          Crea una
          <br />
          <span
            className="inline-block"
            style={{
              WebkitTextStroke: '1px rgba(28,28,28,0.22)',
              color: 'transparent',
            }}
          >
            cuenta con
          </span>
          <br />
          criterio.
        </>
      }
      description="Registra tus datos para acelerar futuros pedidos y dejar lista una base clara para integrar autenticación real más adelante."
      features={[
        { label: 'Datos completos', value: '01' },
        { label: 'Validación clara', value: '02' },
        { label: 'Mock estable', value: '03' },
      ]}
      panelEyebrow="Formulario de registro"
      panelTitle="Crear cuenta"
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <AuthField
            label="Nombre Completo"
            type="text"
            placeholder="Ingresa tu nombre"
            registration={register('fullName', {
              required: 'El nombre completo es obligatorio.',
              minLength: {
                value: 3,
                message: 'Ingresa un nombre más completo.',
              },
            })}
            error={errors.fullName}
            className="sm:col-span-2"
          />

          <AuthField
            label="Email"
            type="email"
            placeholder="correo@novastore.com"
            registration={register('email', {
              required: 'El email es obligatorio.',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Ingresa un email válido.',
              },
            })}
            error={errors.email}
            className="sm:col-span-2"
          />

          <AuthField
            label="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            registration={register('password', {
              required: 'La contraseña es obligatoria.',
              minLength: {
                value: 8,
                message: 'La contraseña debe tener al menos 8 caracteres.',
              },
            })}
            error={errors.password}
          />

          <AuthField
            label="Confirmar Contraseña"
            type="password"
            placeholder="Repite tu contraseña"
            registration={register('confirmPassword', {
              required: 'Debes confirmar la contraseña.',
              validate: (value) => value === passwordValue || 'Las contraseñas no coinciden.',
            })}
            error={errors.confirmPassword}
          />

          <AuthField
            label="Telefono"
            type="tel"
            placeholder="+57 300 000 0000"
            registration={register('phone', {
              required: 'El teléfono es obligatorio.',
              minLength: {
                value: 7,
                message: 'Ingresa un teléfono válido.',
              },
            })}
            error={errors.phone}
            className="sm:col-span-2"
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
            Olvido Contraseña
          </Link>
        </div>

        <AuthStatusMessage status={status} message={feedbackMessage} />

        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex h-14 w-full items-center justify-center bg-[#1C1C1C] px-6 text-[11px] font-black uppercase tracking-[0.28em] text-white transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:bg-[#8A8A8A]"
        >
          {status === 'loading' ? 'Creando cuenta...' : 'Registrarse'}
        </button>

        <p className="text-sm leading-relaxed text-[#8A8A8A]">
          Este flujo usa un servicio mock tipado. No hay dependencia real con Supabase en esta etapa.
        </p>
      </form>
    </AuthShell>
  );
}

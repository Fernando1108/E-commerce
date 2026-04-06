'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import AuthField from '@/features/auth/components/AuthField';
import AuthShell from '@/features/auth/components/AuthShell';
import AuthStatusMessage from '@/features/auth/components/AuthStatusMessage';
import { authService } from '@/features/auth/services/auth.service';
import type { AuthStatus, ForgotPasswordFormValues } from '@/features/auth/types';

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus('loading');
    setFeedbackMessage(null);

    try {
      const result = await authService.forgotPassword(values);
      setStatus('success');
      setFeedbackMessage(result.message);
    } catch (error) {
      setStatus('error');
      setFeedbackMessage(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    }
  });

  return (
    <AuthShell
      eyebrow="Recuperación NovaStore"
      title={
        <>
          Recupera el
          <br />
          <span
            className="inline-block"
            style={{
              WebkitTextStroke: '1px rgba(28,28,28,0.22)',
              color: 'transparent',
            }}
          >
            acceso sin
          </span>
          <br />
          fricción.
        </>
      }
      description="Solicita un restablecimiento con un flujo simple y claro. La integración real puede reemplazar este mock sin tocar la UI."
      features={[
        { label: 'Paso único', value: '01' },
        { label: 'Respuesta clara', value: '02' },
        { label: 'Mock desacoplado', value: '03' },
      ]}
      panelEyebrow="Restablecer acceso"
      panelTitle="Olvidé mi contraseña"
    >
      <form className="space-y-5" onSubmit={onSubmit}>
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
        />

        <div className="flex items-center justify-between gap-4 border-t border-[#E6E1DA] pt-6">
          <Link
            href="/auth/login"
            className="text-[11px] font-black uppercase tracking-[0.24em] text-[#1C1C1C] transition hover:text-[#2563EB]"
          >
            Volver al acceso
          </Link>
          <Link
            href="/auth/register"
            className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8A8A8A] transition hover:text-[#1C1C1C]"
          >
            Registrarse
          </Link>
        </div>

        <AuthStatusMessage status={status} message={feedbackMessage} />

        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex h-14 w-full items-center justify-center bg-[#1C1C1C] px-6 text-[11px] font-black uppercase tracking-[0.28em] text-white transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:bg-[#8A8A8A]"
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar instrucciones'}
        </button>

        <p className="text-sm leading-relaxed text-[#8A8A8A]">
          El mensaje de éxito no expone si el correo existe, que es el comportamiento correcto para producción.
        </p>
      </form>
    </AuthShell>
  );
}

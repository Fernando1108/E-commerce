'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import AuthField from '@/features/auth/components/AuthField';
import AuthShell from '@/features/auth/components/AuthShell';
import AuthStatusMessage from '@/features/auth/components/AuthStatusMessage';
import { useRememberedEmail } from '@/features/auth/hooks/useRememberedEmail';
import { authService } from '@/features/auth/services/auth.service';
import { setAuthCookie } from '@/features/auth/utils/auth-cookie';
import type { AuthStatus, LoginFormValues } from '@/features/auth/types';
import { useAuthStore } from '@/store/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useRememberedEmail<LoginFormValues>({
    fieldName: 'email',
    setValue,
    watch,
  });

  const email = watch('email');
  const redirectParam = searchParams.get('redirect');
  const isValidRedirect =
    typeof redirectParam === 'string' &&
    redirectParam.startsWith('/') &&
    !redirectParam.startsWith('//') &&
    !redirectParam.startsWith('/http') &&
    !redirectParam.startsWith('/https');
  const redirectTarget = isValidRedirect ? redirectParam : '/homepage';

  const onSubmit = handleSubmit(async (values) => {
    setStatus('loading');
    setFeedbackMessage(null);

    try {
      const result = await authService.login(values);
      setAuthCookie();
      login(result.user);
      setStatus('success');
      setFeedbackMessage(result.message);
      router.push(redirectTarget);
    } catch (error) {
      setStatus('error');
      setFeedbackMessage(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    }
  });

  return (
    <AuthShell
      eyebrow="Acceso NovaStore"
      title={
        <>
          Entra y
          <br />
          <span
            className="inline-block"
            style={{
              WebkitTextStroke: '1px rgba(28,28,28,0.22)',
              color: 'transparent',
            }}
          >
            continúa
          </span>
          <br />
          tu compra.
        </>
      }
      description="Accede con tu cuenta para retomar pedidos, revisar tu carrito y mantener una experiencia consistente en todo el storefront."
      features={[
        { label: 'Acceso rápido', value: '01' },
        { label: 'Email recordado', value: '02' },
        { label: 'Flujo modular', value: '03' },
      ]}
      panelEyebrow="Formulario de acceso"
      panelTitle="Inicia sesión"
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="grid gap-5">
          <AuthField
            label="Email"
            type="email"
            placeholder="demo@novastore.com"
            registration={register('email', {
              required: 'El email es obligatorio.',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Ingresa un email válido.',
              },
            })}
            error={errors.email}
            onClick={() => console.log(email)}
          />

          <AuthField
            label="Contraseña"
            type="password"
            placeholder="NovaStore123"
            registration={register('password', {
              required: 'La contraseña es obligatoria.',
              minLength: {
                value: 8,
                message: 'La contraseña debe tener al menos 8 caracteres.',
              },
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
            Olvido Contraseña
          </Link>
        </div>

        <AuthStatusMessage status={status} message={feedbackMessage} />

        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex h-14 w-full items-center justify-center bg-[#1C1C1C] px-6 text-[11px] font-black uppercase tracking-[0.28em] text-white transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:bg-[#8A8A8A]"
        >
          {status === 'loading' ? 'Cargando...' : 'Continuar'}
        </button>

        <p className="text-sm leading-relaxed text-[#8A8A8A]">
          Usa el mock `demo@novastore.com` con la contraseña `NovaStore123` para probar el flujo.
        </p>
      </form>
    </AuthShell>
  );
}

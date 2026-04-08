'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────
type PersonalForm = {
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type SectionStatus = 'idle' | 'loading' | 'success' | 'error';

// ─── Shared field style ────────────────────────────────────────────────────────
const INPUT =
  'mt-1.5 w-full h-11 px-4 border border-[#DDD9D3] bg-white text-sm text-[#1C1C1C] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#2563EB] transition-colors';
const LABEL = 'block text-[10px] font-black uppercase tracking-[0.22em] text-[#8A8A8A]';

const LATAM_COUNTRIES = [
  'Argentina',
  'Bolivia',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'Ecuador',
  'El Salvador',
  'España',
  'Estados Unidos',
  'Guatemala',
  'Honduras',
  'México',
  'Nicaragua',
  'Panamá',
  'Paraguay',
  'Perú',
  'Puerto Rico',
  'República Dominicana',
  'Uruguay',
  'Venezuela',
];

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#E6E1DA] bg-white">
      <div className="px-6 py-5 border-b border-[#E6E1DA]">
        <h2 className="text-base font-display font-900 uppercase italic text-[#1C1C1C]">{title}</h2>
        {description && <p className="text-sm text-[#8A8A8A] mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}

function StatusBanner({ status, message }: { status: SectionStatus; message: string }) {
  if (status === 'idle' || !message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-4 px-4 py-3 text-sm font-semibold rounded-lg ${
        status === 'success'
          ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
          : 'bg-red-50 border border-red-200 text-red-700'
      }`}
    >
      {message}
    </motion.div>
  );
}

// ─── Section 1: Personal data ─────────────────────────────────────────────────
function PersonalSection({
  user,
}: {
  user: { email?: string; user_metadata?: Record<string, string> } | null;
}) {
  const [status, setStatus] = useState<SectionStatus>('idle');
  const [msg, setMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalForm>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postal_code: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name:
          user.user_metadata?.name ??
          user.user_metadata?.full_name ??
          user.email?.split('@')[0] ??
          '',
        phone: user.user_metadata?.phone ?? '',
        address: user.user_metadata?.address ?? '',
        city: user.user_metadata?.city ?? '',
        country: user.user_metadata?.country ?? '',
        postal_code: user.user_metadata?.postal_code ?? '',
      });
    }
  }, [user, reset]);

  const onSubmit = handleSubmit(async ({ name, phone, address, city, country, postal_code }) => {
    setStatus('loading');
    setMsg('');
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        country,
        postal_code: postal_code.trim(),
      },
    });
    if (error) {
      setStatus('error');
      setMsg(error.message);
    } else {
      setStatus('success');
      setMsg('Datos actualizados correctamente.');
      toast.success('Datos actualizados');
    }
  });

  return (
    <SectionCard
      title="Datos personales"
      description="Actualiza tu información de contacto y envío"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Email — readonly */}
        <div>
          <label className={LABEL}>Email</label>
          <div className="mt-1.5 h-11 px-4 flex items-center border border-[#E6E1DA] bg-[#F8F7F5] text-sm text-[#5A5A5A]">
            {user?.email ?? '—'}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className={LABEL}>Nombre</label>
          <input
            {...register('name', { minLength: { value: 2, message: 'Mínimo 2 caracteres.' } })}
            className={INPUT}
            placeholder="Tu nombre"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className={LABEL}>Teléfono</label>
          <input type="tel" {...register('phone')} className={INPUT} placeholder="+507 6644-9530" />
        </div>

        {/* Address */}
        <div>
          <label className={LABEL}>Dirección</label>
          <input
            {...register('address')}
            className={INPUT}
            placeholder="Calle, número, apartamento"
          />
        </div>

        {/* City + Postal code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Ciudad</label>
            <input {...register('city')} className={INPUT} placeholder="Ciudad" />
          </div>
          <div>
            <label className={LABEL}>Código postal</label>
            <input {...register('postal_code')} className={INPUT} placeholder="0801" />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className={LABEL}>País</label>
          <select {...register('country')} className={INPUT + ' appearance-none cursor-pointer'}>
            <option value="">Selecciona un país</option>
            {LATAM_COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <StatusBanner status={status} message={msg} />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex h-11 items-center gap-2 bg-[#1C1C1C] px-6 text-[11px] font-black uppercase tracking-[0.26em] text-white transition hover:bg-[#2563EB] disabled:opacity-50"
          >
            <Icon name="CheckIcon" size={13} variant="outline" />
            {status === 'loading' ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </SectionCard>
  );
}

// ─── Section 2: Security ──────────────────────────────────────────────────────
function SecuritySection({ user }: { user: { email?: string } | null }) {
  const [status, setStatus] = useState<SectionStatus>('idle');
  const [msg, setMsg] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const newPwd = watch('newPassword');

  const onSubmit = handleSubmit(async ({ currentPassword, newPassword, confirmPassword }) => {
    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMsg('Las contraseñas nuevas no coinciden.');
      return;
    }
    setStatus('loading');
    setMsg('');
    const supabase = createClient();
    // Verify current password
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user?.email ?? '',
      password: currentPassword,
    });
    if (signInErr) {
      setStatus('error');
      setMsg('Contraseña actual incorrecta.');
      return;
    }
    // Update password
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setStatus('error');
      setMsg(error.message);
    } else {
      setStatus('success');
      setMsg('Contraseña actualizada correctamente.');
      reset();
    }
  });

  return (
    <SectionCard title="Seguridad" description="Cambia tu contraseña de acceso">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className={LABEL}>Contraseña actual *</label>
          <input
            type="password"
            {...register('currentPassword', { required: 'La contraseña actual es obligatoria.' })}
            className={INPUT}
            placeholder="Tu contraseña actual"
            autoComplete="current-password"
          />
          {errors.currentPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>
          )}
        </div>
        <div>
          <label className={LABEL}>Nueva contraseña</label>
          <input
            type="password"
            {...register('newPassword', {
              required: 'Introduce la nueva contraseña.',
              minLength: { value: 6, message: 'Mínimo 6 caracteres.' },
            })}
            className={INPUT}
            placeholder="Nueva contraseña"
            autoComplete="new-password"
          />
          {errors.newPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
          )}
        </div>
        <div>
          <label className={LABEL}>Confirmar nueva contraseña</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Confirma la nueva contraseña.',
              validate: (v) => v === newPwd || 'Las contraseñas no coinciden.',
            })}
            className={INPUT}
            placeholder="Repite la nueva contraseña"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        <StatusBanner status={status} message={msg} />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex h-11 items-center gap-2 bg-[#1C1C1C] px-6 text-[11px] font-black uppercase tracking-[0.26em] text-white transition hover:bg-[#2563EB] disabled:opacity-50"
          >
            <Icon name="LockClosedIcon" size={13} variant="outline" />
            {status === 'loading' ? 'Verificando...' : 'Cambiar contraseña'}
          </button>
        </div>
      </form>
    </SectionCard>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ProfileSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/profile/settings');
    }
  }, [loading, user, router]);

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Header />

      <div className="pt-[72px]">
        {/* Page header */}
        <div className="bg-white border-b border-[#E6E1DA]">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="/profile"
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors"
              >
                <Icon name="ArrowLeftIcon" size={12} variant="outline" />
                Volver al perfil
              </Link>
            </div>
            <h1 className="text-3xl font-display font-900 italic uppercase text-[#1C1C1C] leading-tight">
              Configuración
            </h1>
            <p className="text-sm text-[#5A5A5A] mt-1">
              Gestiona tu información personal y contraseña.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 bg-[#EFEDE9] animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <PersonalSection user={user} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
              >
                <SecuritySection user={user} />
              </motion.div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

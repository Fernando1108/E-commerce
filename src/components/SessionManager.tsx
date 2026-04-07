'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Icon from '@/components/ui/AppIcon';

// ── Constants ─────────────────────────────────────────────────────────────────
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_TIMEOUT_MS    = 25 * 60 * 1000; // 25 minutes
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const;

// ── Expiry Modal ───────────────────────────────────────────────────────────────
function SessionExpiredModal({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        key="session-expired-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm bg-white border border-[#DDD9D3] shadow-[0_32px_80px_rgba(0,0,0,0.18)] p-8 text-center"
        >
          {/* Icon */}
          <div className="mx-auto mb-5 flex size-14 items-center justify-center bg-[#FFF7ED] border border-[#FED7AA]">
            <Icon name="ClockIcon" size={26} variant="outline" className="text-[#EA580C]" />
          </div>

          {/* Eyebrow */}
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#EA580C]">
            Sesión expirada
          </p>

          {/* Headline */}
          <h2 className="mt-3 font-display font-900 italic uppercase text-2xl text-[#1C1C1C] tracking-[-0.02em]">
            Tu sesión expiró
          </h2>

          {/* Body */}
          <p className="mt-3 text-[13px] text-[#5A5A5A] leading-relaxed">
            Tu sesión fue cerrada automáticamente por{' '}
            <strong className="text-[#1C1C1C]">30 minutos de inactividad</strong>. Ingresa de nuevo
            para continuar.
          </p>

          {/* CTA */}
          <button
            onClick={onLoginClick}
            className="mt-7 inline-flex h-12 w-full items-center justify-center bg-[#1C1C1C] text-white text-[11px] font-black uppercase tracking-[0.26em] hover:bg-[#2563EB] transition-colors duration-300"
          >
            Iniciar sesión
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── SessionManager ─────────────────────────────────────────────────────────────
export default function SessionManager() {
  const { user } = useAuth();
  const router = useRouter();
  const [expired, setExpired] = useState(false);

  const warningTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expireTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningToastRef  = useRef<string | number | null>(null);

  // ── Sign out + redirect ──────────────────────────────────────────────────────
  const performSignOut = useCallback(async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      await supabase.auth.signOut();
    } catch {
      // best-effort
    }
    setExpired(true);
  }, []);

  const goToLogin = useCallback(() => {
    setExpired(false);
    router.push('/auth/login');
  }, [router]);

  // ── Reset timers on activity ─────────────────────────────────────────────────
  const resetTimers = useCallback(() => {
    if (warningTimerRef.current)  clearTimeout(warningTimerRef.current);
    if (expireTimerRef.current)   clearTimeout(expireTimerRef.current);
    if (warningToastRef.current)  toast.dismiss(warningToastRef.current);

    // 25-min warning
    warningTimerRef.current = setTimeout(() => {
      warningToastRef.current = toast.warning(
        '⚠️ Tu sesión expirará en 5 minutos por inactividad.',
        {
          duration: 5 * 60 * 1000, // stays until closed or dismissed
          id: 'session-warning',
        }
      );
    }, WARNING_TIMEOUT_MS);

    // 30-min hard expiry
    expireTimerRef.current = setTimeout(() => {
      toast.dismiss('session-warning');
      performSignOut();
    }, INACTIVITY_TIMEOUT_MS);
  }, [performSignOut]);

  // ── Attach / detach activity listeners ──────────────────────────────────────
  useEffect(() => {
    // Only run if user is logged in and the modal isn't showing
    if (!user || expired) return;

    resetTimers();

    // Throttle so rapid movements don't reset constantly
    let throttleHandle: ReturnType<typeof setTimeout> | null = null;
    const handleActivity = () => {
      if (throttleHandle) return;
      throttleHandle = setTimeout(() => {
        throttleHandle = null;
        resetTimers();
      }, 1000); // throttle to once per second
    };

    ACTIVITY_EVENTS.forEach((ev) =>
      window.addEventListener(ev, handleActivity, { passive: true })
    );

    return () => {
      ACTIVITY_EVENTS.forEach((ev) =>
        window.removeEventListener(ev, handleActivity)
      );
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (expireTimerRef.current)  clearTimeout(expireTimerRef.current);
      if (throttleHandle)          clearTimeout(throttleHandle);
      toast.dismiss('session-warning');
    };
  }, [user, expired, resetTimers]);

  // ── Render ───────────────────────────────────────────────────────────────────
  // Nothing to render if no user and no expiry modal
  if (!user && !expired) return null;

  return expired ? <SessionExpiredModal onLoginClick={goToLogin} /> : null;
}

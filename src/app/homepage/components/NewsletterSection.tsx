'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { toast } from 'sonner';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.status === 429) {
        toast.error('Demasiados intentos. Intenta en unos minutos.');
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al suscribirse');
      }
      toast.success('Te has suscrito exitosamente');
      setSubmitted(true);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al suscribirse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#1C1C1C] py-14 lg:py-20">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-[#2563EB]/5 blur-[160px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 lg:col-span-5"
          >
            <div className="inline-flex items-center gap-3 border border-white/10 bg-white/5 px-5 py-2.5">
              <Icon name="EnvelopeIcon" size={14} variant="outline" className="text-[#2563EB]" />
              <span className="label-eyebrow text-[#2563EB]">Newsletter exclusivo</span>
            </div>
            <h2
              className="font-display font-900 italic leading-[0.88] tracking-[-0.04em] text-white uppercase"
              style={{ fontSize: 'clamp(2.5rem, 4.5vw, 5rem)' }}
            >
              Primero en
              <br />
              <span className="text-[#2563EB]">Saberlo.</span>
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-white/45">
              Suscríbete y recibe acceso anticipado a lanzamientos, ofertas exclusivas y contenido
              editorial sobre tecnologia premium.
            </p>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-[11px] font-600 uppercase tracking-widest text-white/30">
                <Icon
                  name="ShieldCheckIcon"
                  size={14}
                  variant="outline"
                  className="text-[#2563EB]"
                />
                Sin spam
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2 text-[11px] font-600 uppercase tracking-widest text-white/30">
                <Icon name="XMarkIcon" size={14} variant="outline" className="text-[#2563EB]" />
                Cancela cuando quieras
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative flex flex-col gap-2 sm:flex-row">
                  <div className="contents">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      aria-label="Tu direccion de correo electronico"
                      className="flex-1 border border-white/10 bg-white/5 px-6 py-4 text-sm font-500 text-white outline-none transition-all duration-300 placeholder-white/25 focus:border-[#2563EB] focus:bg-white/8"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex items-center gap-2 whitespace-nowrap bg-[#2563EB] px-8 py-4 text-[11px] font-black uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-[#1C1C1C] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Suscribiendo...' : 'Suscribirme'}
                      {!loading && (
                        <Icon
                          name="ArrowRightIcon"
                          size={14}
                          variant="outline"
                          className="transition-transform group-hover:translate-x-1"
                        />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-white/25">
                  Al suscribirte aceptas nuestra{' '}
                  <Link
                    href="/privacidad"
                    className="underline transition-colors hover:text-white/60"
                  >
                    politica de privacidad
                  </Link>
                  . Mas de <strong className="text-white/50">8.000 profesionales</strong> ya estan
                  suscritos.
                </p>

                <div className="flex items-center gap-4 border-t border-white/8 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="size-8 overflow-hidden rounded-full border-2 border-[#1C1C1C] bg-white/10"
                      >
                        <AppImage
                          src={`https://i.pravatar.cc/32?img=${n + 10}`}
                          alt={`Suscriptor ${n}`}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover grayscale"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-[12px] text-white/30">
                    <strong className="text-white/50">+8.000</strong> profesionales suscritos
                  </p>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-6 border border-white/10 bg-white/5 p-10"
              >
                <div className="flex size-14 shrink-0 items-center justify-center bg-[#2563EB]">
                  <Icon name="CheckIcon" size={24} variant="outline" className="text-white" />
                </div>
                <div>
                  <p className="text-xl font-700 text-white">Bienvenido a NovaStore!</p>
                  <p className="mt-1.5 text-sm text-white/40">
                    Te hemos enviado un email de confirmación a{' '}
                    <strong className="text-white/70">{email}</strong>.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

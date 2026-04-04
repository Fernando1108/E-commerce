'use client';

import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section ref={ref} className="relative py-24 lg:py-36 bg-[#1C1C1C] overflow-hidden">
      {/* Subtle warm texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Very subtle blue accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#2563EB]/5 blur-[160px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 border border-white/10 bg-white/5">
              <Icon name="EnvelopeIcon" size={14} variant="outline" className="text-[#2563EB]" />
              <span className="label-eyebrow text-[#2563EB]">Newsletter exclusivo</span>
            </div>
            <h2
              className="font-display font-900 italic text-white uppercase leading-[0.88] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2.5rem, 4.5vw, 5rem)' }}
            >
              Primero en
              <br />
              <span className="text-[#2563EB]">Saberlo.</span>
            </h2>
            <p className="text-base text-white/45 max-w-sm leading-relaxed">
              Suscríbete y recibe acceso anticipado a lanzamientos, ofertas exclusivas y contenido editorial sobre tecnología premium.
            </p>

            {/* Trust signals */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-[11px] font-600 text-white/30 uppercase tracking-widest">
                <Icon name="ShieldCheckIcon" size={14} variant="outline" className="text-[#2563EB]" />
                Sin spam
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2 text-[11px] font-600 text-white/30 uppercase tracking-widest">
                <Icon name="XMarkIcon" size={14} variant="outline" className="text-[#2563EB]" />
                Cancela cuando quieras
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    aria-label="Tu dirección de correo electrónico"
                    className="flex-1 px-6 py-4 bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm font-500 outline-none focus:border-[#2563EB] focus:bg-white/8 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="group px-8 py-4 bg-[#2563EB] text-white text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-[#1C1C1C] transition-all duration-300 whitespace-nowrap inline-flex items-center gap-2"
                  >
                    Suscribirme
                    <Icon name="ArrowRightIcon" size={14} variant="outline" className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <p className="text-[11px] text-white/25 leading-relaxed">
                  Al suscribirte aceptas nuestra{' '}
                  <a href="#" className="underline hover:text-white/60 transition-colors">política de privacidad</a>.
                  Más de <strong className="text-white/50">8.000 profesionales</strong> ya están suscritos.
                </p>

                {/* Social proof avatars */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/8">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="size-8 rounded-full bg-white/10 border-2 border-[#1C1C1C] overflow-hidden">
                        <img
                          src={`https://i.pravatar.cc/32?img=${n + 10}`}
                          alt={`Suscriptor ${n}`}
                          className="w-full h-full object-cover grayscale"
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
                className="flex items-center gap-6 p-10 bg-white/5 border border-white/10"
              >
                <div className="size-14 bg-[#2563EB] flex items-center justify-center shrink-0">
                  <Icon name="CheckIcon" size={24} variant="outline" className="text-white" />
                </div>
                <div>
                  <p className="font-700 text-white text-xl">¡Bienvenido a NovaStore!</p>
                  <p className="text-sm text-white/40 mt-1.5">
                    Te hemos enviado un email de confirmación a <strong className="text-white/70">{email}</strong>.
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
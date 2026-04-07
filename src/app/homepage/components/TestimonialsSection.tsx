'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const testimonials = [
  {
    id: 1,
    quote:
      'NovaStore cambió completamente mi forma de trabajar. La calidad de los productos es excepcional y el proceso de compra es el más fluido que he experimentado. Mi setup nunca había sido tan profesional.',
    name: 'Alejandro Martínez',
    role: 'Director de Diseño',
    company: 'Studio AM, Madrid',
    rating: 5,
    avatar: 'https://i.pravatar.cc/200?u=alejandro-martinez-madrid',
  },
  {
    id: 2,
    quote:
      'Llevo 3 años comprando en NovaStore y nunca me han fallado. Los productos llegan en perfectas condiciones y el soporte post-venta es de otro nivel. Totalmente recomendable para cualquier profesional.',
    name: 'Valeria Ortega',
    role: 'Desarrolladora Senior',
    company: 'TechLab, Barcelona',
    rating: 5,
    avatar: 'https://i.pravatar.cc/200?u=valeria-ortega-barcelona',
  },
  {
    id: 3,
    quote:
      'La selección de productos en NovaStore es simplemente increíble. Todo está cuidadosamente elegido y la experiencia de compra es premium de principio a fin. Mi equipo completo compra aquí.',
    name: 'Carlos Fernández',
    role: 'CEO & Fundador',
    company: 'Nexo Ventures, Valencia',
    rating: 5,
    avatar: 'https://i.pravatar.cc/200?u=carlos-fernandez-valencia',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="StarIcon"
          size={16}
          variant="solid"
          className={i < rating ? 'star-filled' : 'star-empty'}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const current = testimonials[active];

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-[#252525] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left: Header */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="lg:col-span-4 space-y-8"
          >
            <div>
              <p className="label-eyebrow text-[#2563EB] mb-3">Testimonios</p>
              <h2
                className="font-display font-900 italic text-white uppercase leading-tight tracking-editorial"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)' }}
              >
                Lo Que
                <br />
                Dicen
                <br />
                Nuestros
                <br />
                Clientes.
              </h2>
            </div>

            {/* Stats */}
            <div className="space-y-6 pt-4 border-t border-white/10">
              <div>
                <p className="font-display font-900 text-4xl text-white tracking-tightest">12K+</p>
                <p className="label-eyebrow text-white/30 mt-1">Clientes satisfechos</p>
              </div>
              <div>
                <p className="font-display font-900 text-4xl text-white tracking-tightest">4.9/5</p>
                <p className="label-eyebrow text-white/30 mt-1">Valoración media</p>
              </div>
            </div>

            {/* Navigation dots */}
            <div className="flex items-center gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Ver testimonio ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`h-1 transition-all duration-300 ${
                    i === active ? 'w-8 bg-[#2563EB]' : 'w-4 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Right: Testimonial card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="lg:col-span-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="bg-[#2C2C2C] border border-white/8 p-10 lg:p-14 space-y-10"
              >
                {/* Quote icon */}
                <Icon
                  name="ChatBubbleBottomCenterTextIcon"
                  size={48}
                  variant="outline"
                  className="text-white/10"
                />

                {/* Quote */}
                <blockquote
                  className="font-display font-700 italic text-white leading-relaxed"
                  style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)' }}
                >
                  &ldquo;{current.quote}&rdquo;
                </blockquote>

                {/* Rating */}
                <StarRating rating={current.rating} />

                {/* Author */}
                <div className="flex items-center gap-5 pt-4 border-t border-white/10">
                  <div className="size-16 overflow-hidden bg-white/5 shrink-0">
                    <AppImage
                      src={current.avatar}
                      alt={`Foto de perfil de ${current.name}, ${current.role} en ${current.company}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div>
                    <p className="font-700 text-white text-base">{current.name}</p>
                    <p className="text-[12px] font-500 text-white/40 uppercase tracking-widest mt-0.5">
                      {current.role}
                    </p>
                    <p className="text-[11px] font-500 text-[#2563EB] uppercase tracking-widest">
                      {current.company}
                    </p>
                  </div>

                  {/* Nav arrows */}
                  <div className="ml-auto flex gap-3">
                    <button
                      aria-label="Testimonio anterior"
                      onClick={() =>
                        setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                      }
                      className="size-11 border border-white/10 flex items-center justify-center text-white/40 hover:border-white/30 hover:text-white transition-all"
                    >
                      <Icon name="ChevronLeftIcon" size={18} variant="outline" />
                    </button>
                    <button
                      aria-label="Siguiente testimonio"
                      onClick={() => setActive((prev) => (prev + 1) % testimonials.length)}
                      className="size-11 border border-white/10 flex items-center justify-center text-white/40 hover:border-white/30 hover:text-white transition-all"
                    >
                      <Icon name="ChevronRightIcon" size={18} variant="outline" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

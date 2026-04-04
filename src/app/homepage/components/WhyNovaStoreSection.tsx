'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

const advantages = [
  {
    icon: 'TruckIcon' as const,
    label: 'Envíos Seguros',
    headline: 'Entrega garantizada',
    description: 'Envío gratuito en pedidos superiores a €50. Seguimiento en tiempo real y entrega en 24–48h.',
    stat: '24h',
    statLabel: 'Entrega express',
  },
  {
    icon: 'BoltIcon' as const,
    label: 'Compra Rápida',
    headline: 'Checkout en 60 segundos',
    description: 'Proceso de compra optimizado para que completes tu pedido sin fricciones ni pasos innecesarios.',
    stat: '60s',
    statLabel: 'Checkout rápido',
  },
  {
    icon: 'CheckBadgeIcon' as const,
    label: 'Productos Seleccionados',
    headline: 'Curación editorial',
    description: 'Cada producto pasa por un proceso de selección riguroso. Solo lo mejor del mercado llega a NovaStore.',
    stat: '500+',
    statLabel: 'Productos curados',
  },
  {
    icon: 'ChatBubbleLeftRightIcon' as const,
    label: 'Soporte Confiable',
    headline: 'Siempre disponibles',
    description: 'Equipo de soporte especializado disponible por chat, email y teléfono. Respuesta en menos de 2 horas.',
    stat: '2h',
    statLabel: 'Tiempo de respuesta',
  },
  {
    icon: 'ShieldCheckIcon' as const,
    label: 'Calidad Garantizada',
    headline: 'Devolución sin preguntas',
    description: '30 días para devolver cualquier producto sin preguntas. Tu satisfacción es nuestra prioridad.',
    stat: '30d',
    statLabel: 'Garantía de retorno',
  },
];

export default function WhyNovaStoreSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-[#2C2C2C] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Header — split layout */}
        <div className="grid lg:grid-cols-12 gap-10 mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <p className="label-eyebrow text-[#2563EB] mb-4">Por qué elegirnos</p>
            <h2
              className="font-display font-900 italic text-white uppercase leading-[0.88] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
            >
              La Diferencia
              <br />
              <span className="text-[#2563EB]">NovaStore.</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex items-end"
          >
            <p className="text-base text-white/50 leading-relaxed max-w-md">
              Cada detalle de NovaStore está diseñado para ofrecer una experiencia de compra premium, desde la selección de productos hasta la entrega en tu puerta.
            </p>
          </motion.div>
        </div>

        {/* 5 advantages grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border border-white/8">
          {advantages.map((adv, i) => (
            <motion.div
              key={adv.label}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`group p-8 lg:p-10 flex flex-col gap-7 bg-[#333333] hover:bg-[#2563EB] transition-all duration-500 cursor-default relative overflow-hidden
                ${i < advantages.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-white/8' : ''}
              `}
            >
              {/* Background number */}
              <div className="absolute -bottom-4 -right-2 font-display font-900 italic text-white/[0.04] group-hover:text-white/[0.08] transition-colors duration-500 leading-none select-none"
                style={{ fontSize: '7rem' }}>
                {i + 1}
              </div>

              {/* Icon */}
              <div className="size-12 bg-white/8 group-hover:bg-white/15 flex items-center justify-center transition-colors duration-400 relative z-10">
                <Icon
                  name={adv.icon}
                  size={22}
                  variant="outline"
                  className="text-[#2563EB] group-hover:text-white transition-colors duration-400"
                />
              </div>

              {/* Label + headline */}
              <div className="relative z-10">
                <span className="label-eyebrow text-white/30 group-hover:text-white/60 transition-colors duration-400">
                  {adv.label}
                </span>
                <h3 className="font-700 text-white text-lg leading-tight mt-2 transition-colors duration-400">
                  {adv.headline}
                </h3>
              </div>

              <p className="text-[13px] text-white/40 group-hover:text-white/75 leading-relaxed transition-colors duration-400 flex-grow relative z-10">
                {adv.description}
              </p>

              {/* Stat */}
              <div className="pt-5 border-t border-white/8 group-hover:border-white/15 transition-colors duration-400 relative z-10">
                <p className="font-display font-900 italic text-4xl tracking-tightest text-white transition-colors duration-400">
                  {adv.stat}
                </p>
                <p className="label-eyebrow text-white/25 group-hover:text-white/50 mt-1.5 transition-colors duration-400">
                  {adv.statLabel}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
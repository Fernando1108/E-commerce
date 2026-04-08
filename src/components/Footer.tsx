'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const footerColumns = [
  [
    { label: 'Tienda', href: '/products' },
    { label: 'Categorías', href: '/products?view=categories' },
    { label: 'Novedades', href: '/products?sort=newest' },
  ],
  [
    { label: 'Soporte', href: '/contacto' },
    { label: 'Envíos', href: '/envios' },
    { label: 'Devoluciones', href: '/devoluciones' },
  ],
  [
    { label: 'Privacidad', href: '/privacidad' },
    { label: 'Términos', href: '/terminos' },
    { label: 'Contacto', href: '/contacto' },
  ],
];

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1 text-[13px] font-600 text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors duration-200"
    >
      <span className="transition-transform duration-200 group-hover:translate-x-1">{label}</span>
      <Icon
        name="ChevronRightIcon"
        size={10}
        variant="outline"
        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-[#2563EB]"
      />
    </Link>
  );
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <footer ref={ref} className="border-t border-[#DDD9D3] bg-[#EFEDE9]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 lg:max-w-xs"
          >
            <Link href="/homepage" className="flex items-center gap-2.5">
              <AppLogo size={250} />
            </Link>
            <p className="text-sm text-[#5A5A5A] leading-relaxed">
              Tecnologia premium seleccionada para profesionales y creadores.
            </p>
          </motion.div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-x-16 gap-y-8">
            {footerColumns.map((col, colIdx) => (
              <motion.div
                key={colIdx}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: (colIdx + 1) * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col gap-3"
              >
                {col.map((link) => (
                  <FooterLink key={link.label} href={link.href} label={link.label} />
                ))}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative animated separator line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 h-px origin-left"
          style={{
            background: 'linear-gradient(90deg, #2563EB 0%, #DDD9D3 60%, transparent 100%)',
          }}
        />

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-[12px] font-500 text-[#8A8A8A]"
          >
            Copyright 2026 NovaStore. Todos los derechos reservados.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex items-center gap-4"
          >
            {/* Social icons — scale + color on hover */}
            <motion.a
              href="https://instagram.com/kodexasolutions"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram de NovaStore"
              whileHover={{ scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="size-9 flex items-center justify-center text-[#8A8A8A] hover:text-[#E1306C] transition-colors duration-200"
            >
              <Icon name="CameraIcon" size={18} variant="outline" />
            </motion.a>
            <motion.a
              href="https://wa.me/50766449530"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp de NovaStore"
              whileHover={{ scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="size-9 flex items-center justify-center text-[#8A8A8A] hover:text-[#25D366] transition-colors duration-200"
            >
              <Icon name="ChatBubbleLeftIcon" size={18} variant="outline" />
            </motion.a>
            <motion.a
              href="mailto:kodexasolutions@gmail.com"
              aria-label="Email de NovaStore"
              whileHover={{ scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="size-9 flex items-center justify-center text-[#8A8A8A] hover:text-[#2563EB] transition-colors duration-200"
            >
              <Icon name="BuildingOfficeIcon" size={18} variant="outline" />
            </motion.a>

            <span className="mx-2 text-[#DDD9D3]">.</span>
            <Link
              href="/privacidad"
              className="text-[12px] font-500 text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors"
            >
              Privacidad
            </Link>
            <span className="text-[#DDD9D3]">.</span>
            <Link
              href="/terminos"
              className="text-[12px] font-500 text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors"
            >
              Términos
            </Link>
            <span className="mx-1 text-[#DDD9D3]">·</span>
            <a
              href="https://www.kodexasolutions.com/home"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[12px] font-500 text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors duration-200 group/kodexa"
            >
              Desarrollado por{' '}
              <span className="font-700 group-hover/kodexa:text-[#2563EB] transition-colors duration-200">
                Kodexa Solutions
              </span>
              <Icon
                name="ArrowTopRightOnSquareIcon"
                size={11}
                variant="outline"
                className="opacity-50 group-hover/kodexa:opacity-100 transition-opacity duration-200"
              />
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

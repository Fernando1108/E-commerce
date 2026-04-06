import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

export default function Footer() {
  return (
    <footer className="border-t border-[#DDD9D3] bg-[#EFEDE9]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          <div className="space-y-4 lg:max-w-xs">
            <Link href="/homepage" className="flex items-center gap-2.5">
              <AppLogo size={250} />
            </Link>
            <p className="text-sm text-[#5A5A5A] leading-relaxed">
              Tecnologia premium seleccionada para profesionales y creadores.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-8">
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <Link href="/products" className="text-[13px] font-600 text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors">
                  Tienda
                </Link>
                <Link href="/products" className="text-[13px] font-600 text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors">
                  Categorias
                </Link>
                <Link href="/products" className="text-[13px] font-600 text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors">
                  Novedades
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <Link href="/contacto" className="text-[13px] font-600 text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors">
                  Soporte
                </Link>
                <Link href="/envios" className="text-[13px] font-600 text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors">
                  Envios
                </Link>
                <Link href="/devoluciones" className="text-[13px] font-600 text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors">
                  Devoluciones
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <Link href="/privacidad" className="text-[13px] font-600 text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors">
                  Privacidad
                </Link>
                <Link href="/terminos" className="text-[13px] font-600 text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors">
                  Terminos
                </Link>
                <Link href="/contacto" className="text-[13px] font-600 text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors">
                  Contacto
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#DDD9D3] flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[12px] font-500 text-[#8A8A8A]">
            Copyright 2026 NovaStore. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram de NovaStore" className="size-9 flex items-center justify-center text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors">
              <Icon name="CameraIcon" size={18} variant="outline" />
            </a>
            <a href="#" aria-label="Twitter de NovaStore" className="size-9 flex items-center justify-center text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors">
              <Icon name="ChatBubbleLeftIcon" size={18} variant="outline" />
            </a>
            <a href="#" aria-label="LinkedIn de NovaStore" className="size-9 flex items-center justify-center text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors">
              <Icon name="BuildingOfficeIcon" size={18} variant="outline" />
            </a>

            <span className="mx-2 text-[#DDD9D3]">.</span>
            <Link href="/privacidad" className="text-[12px] font-500 text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors">
              Privacidad
            </Link>
            <span className="text-[#DDD9D3]">.</span>
            <Link href="/terminos" className="text-[12px] font-500 text-[#8A8A8A] hover:text-[#1C1C1C] transition-colors">
              Terminos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

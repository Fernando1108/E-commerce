'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

type GalleryImage = { src: string; alt: string };

export default function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [direction, setDirection] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);

  const navigate = (dir: number) => {
    setDirection(dir);
    setActive((a) => (a + dir + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div
        className="bg-[#F4F2EF] flex items-center justify-center"
        style={{ aspectRatio: '4 / 5' }}
      >
        <Icon name="PhotoIcon" size={48} variant="outline" className="text-[#8A8A8A]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div
        className="relative overflow-hidden bg-[#F4F2EF] cursor-zoom-in md:cursor-none group"
        style={{ aspectRatio: '4 / 5' }}
        onClick={() => setZoomed(!zoomed)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        onMouseEnter={() => setCursorVisible(true)}
        onMouseLeave={() => setCursorVisible(false)}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40, scale: 1.03 }}
            animate={{ opacity: 1, x: 0, scale: zoomed ? 1.3 : 1 }}
            exit={{ opacity: 0, x: direction * -30, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <AppImage
              src={images[active].src}
              alt={images[active].alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-5 right-5 flex items-center gap-1.5 bg-white/85 backdrop-blur-md px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#6B6B6B]"
        >
          <Icon name="MagnifyingGlassPlusIcon" size={11} variant="outline" />
          {zoomed ? 'Reducir' : 'Ampliar'}
        </motion.div>

        <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-sm px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
          {active + 1} / {images.length}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(-1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 size-11 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:shadow-nova-md transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Imagen anterior"
            >
              <Icon name="ChevronLeftIcon" size={18} variant="outline" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 size-11 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:shadow-nova-md transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Imagen siguiente"
            >
              <Icon name="ChevronRightIcon" size={18} variant="outline" />
            </button>
          </>
        )}

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setDirection(i > active ? 1 : -1);
                setActive(i);
              }}
              className={`transition-all duration-400 ${active === i ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'}`}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </div>

        {/* Custom cursor — desktop only */}
        <div
          className={`absolute pointer-events-none z-30 hidden md:flex items-center justify-center size-11 rounded-full border border-white/70 bg-black/30 backdrop-blur-sm transition-opacity duration-200 ${
            cursorVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Icon
            name={zoomed ? 'MagnifyingGlassMinusIcon' : 'MagnifyingGlassPlusIcon'}
            size={14}
            variant="outline"
            className="text-white"
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2.5">
          {images.map((img, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setDirection(i > active ? 1 : -1);
                setActive(i);
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative overflow-hidden border-2 transition-all duration-300 ${active === i ? 'border-[#1C1C1C] shadow-nova-sm' : 'border-[#DDD9D3] hover:border-[#8A8A8A]'}`}
              style={{ aspectRatio: '1/1' }}
            >
              <AppImage src={img.src} alt={img.alt} fill className="object-cover" sizes="120px" />
              {active !== i && (
                <div className="absolute inset-0 bg-white/30 hover:bg-transparent transition-colors duration-200" />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

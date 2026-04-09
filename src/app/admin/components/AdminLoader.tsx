'use client';
import { motion } from 'framer-motion';

interface AdminLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export default function AdminLoader({
  message = 'Cargando...',
  fullScreen = false,
}: AdminLoaderProps) {
  const containerClass = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm'
    : 'flex items-center justify-center py-20';

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Logo SVG animado */}
        <div className="relative">
          {/* Anillo exterior rotando */}
          <motion.svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="url(#gradient1)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="120 60"
              fill="none"
            />
            <defs>
              <linearGradient id="gradient1" x1="0" y1="0" x2="64" y2="64">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* Anillo interior rotando en dirección opuesta */}
          <motion.svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <circle
              cx="32"
              cy="32"
              r="18"
              stroke="url(#gradient2)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="60 40"
              fill="none"
            />
            <defs>
              <linearGradient id="gradient2" x1="0" y1="0" x2="64" y2="64">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* Punto central pulsante */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-violet-500" />
          </motion.div>
        </div>

        {/* Texto con animación de puntos */}
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-400">{message}</span>
          <motion.span className="flex gap-0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1 h-1 rounded-full bg-blue-500"
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.span>
        </div>

        {/* Barra de progreso indeterminada */}
        <div className="w-48 h-0.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '50%' }}
          />
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import React, { memo, useMemo } from 'react';
import AppIcon from './AppIcon';
import AppImage from './AppImage';

interface AppLogoProps {
  src?: string; // Image source (optional)
  iconName?: string; // Icon name when no image
  size?: number; // Rendered width in px
  className?: string;
  onClick?: () => void;
}

// Aspect ratio of the default logo (2618 × 735)
const LOGO_RATIO = 735 / 2618;

const AppLogo = memo(function AppLogo({
  src = '/logo/novastore-logo.png',
  iconName = 'SparklesIcon',
  size = 100,
  className = '',
  onClick,
}: AppLogoProps) {
  const containerClassName = useMemo(() => {
    const classes = ['flex items-center'];
    if (onClick) classes.push('cursor-pointer hover:opacity-80 transition-opacity');
    if (className) classes.push(className);
    return classes.join(' ');
  }, [onClick, className]);

  // For the default logo use real aspect ratio; for other images keep square.
  const intrinsicHeight = src === '/logo/novastore-logo.png' ? Math.round(size * LOGO_RATIO) : size;

  return (
    <div className={containerClassName} onClick={onClick}>
      {src ? (
        <AppImage
          src={src}
          alt="NovaStore"
          width={size}
          height={intrinsicHeight}
          className="flex-shrink-0 h-auto"
          priority={true}
          unoptimized={true}
        />
      ) : (
        <AppIcon name={iconName} size={size} className="flex-shrink-0" />
      )}
    </div>
  );
});

export default AppLogo;

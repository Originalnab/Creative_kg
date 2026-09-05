import { motion } from 'motion/react';
import { useAdmin } from '../context/AdminContext';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function LogoIcon({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const dimensions = {
    sm: { width: 24, height: 48 },
    md: { width: 32, height: 64 },
    lg: { width: 44, height: 88 },
    xl: { width: 64, height: 128 },
  }[size];

  // The monogram is a stylized capsule shape (C, K, G combined)
  // Let's render it using a premium, pixel-perfect vector path
  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 32 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[#C28B51] ${className}`}
      style={{ minWidth: dimensions.width }}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DE9E52" />
          <stop offset="50%" stopColor="#C58542" />
          <stop offset="100%" stopColor="#965D28" />
        </linearGradient>
      </defs>
      
      {/* Dynamic Monogram path representing the 'CKG' styling */}
      {/* Outer stadium shape left loop, vertical stem, and elegant diagonal fold */}
      <motion.path
        d="M16 4C9.37 4 4 9.37 4 16V48C4 54.63 9.37 60 16 60C19.8 60 23.2 58.2 25.4 55.4C26.5 54 27.2 52.3 27.5 50.4C27.8 48.2 28 44 28 44"
        stroke="url(#logoGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      <motion.path
        d="M28 20V28H18"
        stroke="url(#logoGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
      />
      <motion.path
        d="M14 28L24 44"
        stroke="url(#logoGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.6, ease: 'easeInOut' }}
      />
      <motion.path
        d="M16 28V60"
        stroke="url(#logoGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.9, ease: 'easeInOut' }}
      />
    </svg>
  );
}

export default function Logo({ className = '', iconOnly = false, size = 'md' }: LogoProps) {
  const { systemSettings } = useAdmin();

  const dimensions = {
    sm: { height: 32, maxW: 48 },
    md: { height: 44, maxW: 64 },
    lg: { height: 56, maxW: 88 },
    xl: { height: 80, maxW: 128 },
  }[size];

  const textSize = {
    sm: { title: 'text-xs', sub: 'text-[7px]' },
    md: { title: 'text-sm md:text-base', sub: 'text-[9px]' },
    lg: { title: 'text-xl md:text-2xl', sub: 'text-xs' },
    xl: { title: 'text-3xl md:text-4xl', sub: 'text-sm' },
  }[size];

  const displayName = systemSettings?.websiteName || systemSettings?.studioName || 'Creative KG';

  return (
    <div className={`flex items-center space-x-3.5 group select-none text-left ${className}`}>
      {systemSettings?.websiteLogo ? (
        <img
          src={systemSettings.websiteLogo}
          alt={displayName}
          style={{ height: dimensions.height, maxWidth: dimensions.maxW }}
          className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      ) : (
        <LogoIcon size={size} className="group-hover:scale-105 transition-transform duration-500 ease-out" />
      )}
      
      {!iconOnly && (
        <div className="flex flex-col justify-center border-l border-neutral-900 pl-3.5 py-1">
          <span className={`font-display font-medium tracking-[0.18em] text-white uppercase leading-none ${textSize.title} group-hover:text-amber-500/90 transition-colors duration-300`}>
            {displayName}
          </span>
          <div className="flex flex-col mt-1 space-y-0.5 text-neutral-400 font-mono tracking-[0.14em] uppercase">
            <span className={`${textSize.sub} leading-none font-medium`}>Style Solution</span>
            <span className={`${textSize.sub} leading-none text-neutral-500`}>Films & Art</span>
          </div>
        </div>
      )}
    </div>
  );
}

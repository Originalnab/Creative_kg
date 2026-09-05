import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera } from 'lucide-react';
import { getCacheBustedUrl } from '../utils/mediaCache';

interface ImagePreloaderProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  referrerPolicy?: 'no-referrer' | 'origin' | 'unsafe-url';
  version?: number | string;
}

export default function ImagePreloader({
  src,
  alt,
  className = '',
  containerClassName = '',
  style,
  onClick,
  referrerPolicy = 'no-referrer',
  version,
}: ImagePreloaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const finalSrc = getCacheBustedUrl(src, version);

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-neutral-950 flex items-center justify-center ${containerClassName}`}
      onClick={onClick}
    >
      {/* Premium Skeleton Screen Placeholder */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-950/90"
          >
            {/* Pulsing Gold Metallic Shimmer Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-800/40 to-neutral-900 bg-[length:200%_100%] animate-[shimmer_1.8s_infinite] opacity-60" />
            
            {/* Center camera icon in bronze with slow pulse */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="flex flex-col items-center space-y-2.5 z-20"
            >
              <Camera className="w-5 h-5 text-amber-500/40 stroke-[1.5]" />
              <span className="font-mono text-[7px] text-neutral-600 tracking-[0.25em] uppercase">Creative KG</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Image with Blur-Up and Scale Effect */}
      {!hasError ? (
        <motion.img
          key={finalSrc}
          src={finalSrc}
          alt={alt}
          referrerPolicy={referrerPolicy}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          initial={{ filter: 'blur(20px) scale(1.05)', opacity: 0 }}
          animate={{
            filter: isLoaded ? 'blur(0px) scale(1)' : 'blur(20px) scale(1.05)',
            opacity: isLoaded ? 1 : 0,
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={style}
          className={`w-full h-full object-cover select-none ${className}`}
        />
      ) : (
        /* Error Fallback */
        <div className="flex flex-col items-center justify-center text-neutral-600 p-4 space-y-1">
          <Camera className="w-6 h-6 stroke-[1.2] text-neutral-700" />
          <span className="font-sans text-[10px] text-neutral-500">Resource Unavailable</span>
        </div>
      )}

      {/* Shimmer CSS Animation definition injected inline safely to avoid configuring PostCSS */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

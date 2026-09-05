import React from 'react';
import { PhotoFilters } from '../types';

export function getPhotoFilterStyle(filters?: PhotoFilters): React.CSSProperties {
  if (!filters) return {};

  const brightness = filters.brightness ?? 100;
  const contrast = filters.contrast ?? 100;
  const saturation = filters.saturation ?? 100;
  const sepia = filters.sepia ?? 0;
  const grayscale = filters.grayscale ?? 0;
  const blur = filters.blur ?? 0;
  const hueRotate = filters.hueRotate ?? 0;
  const rotate = filters.rotate ?? 0;
  const flipH = filters.flipH ?? false;
  const flipV = filters.flipV ?? false;

  const parts: string[] = [];
  if (brightness !== 100) parts.push(`brightness(${brightness}%)`);
  if (contrast !== 100) parts.push(`contrast(${contrast}%)`);
  if (saturation !== 100) parts.push(`saturate(${saturation}%)`);
  if (sepia > 0) parts.push(`sepia(${sepia}%)`);
  if (grayscale > 0) parts.push(`grayscale(${grayscale}%)`);
  if (blur > 0) parts.push(`blur(${blur}px)`);
  if (hueRotate > 0) parts.push(`hue-rotate(${hueRotate}deg)`);

  const transformParts: string[] = [];
  if (rotate !== 0) transformParts.push(`rotate(${rotate}deg)`);
  if (flipH) transformParts.push('scaleX(-1)');
  if (flipV) transformParts.push('scaleY(-1)');

  const style: React.CSSProperties = {};
  if (parts.length > 0) style.filter = parts.join(' ');
  if (transformParts.length > 0) style.transform = transformParts.join(' ');

  return style;
}

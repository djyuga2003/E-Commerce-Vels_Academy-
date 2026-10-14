import { useState } from 'react';

const FALLBACK_IMAGE = '/images/placeholder.svg';

// Product photo that swaps to a neutral placeholder if the URL is missing or fails to load.
export default function ProductImage({ src, alt, ...props }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const showFallback = !src || failedSrc === src;

  return <img src={showFallback ? FALLBACK_IMAGE : src} alt={alt} onError={() => setFailedSrc(src)} {...props} />;
}

import { useEffect } from 'react';
import { STORE_NAME, STORE_TAGLINE } from '../config';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${STORE_NAME}` : `${STORE_NAME} — ${STORE_TAGLINE}`;
  }, [title]);
}

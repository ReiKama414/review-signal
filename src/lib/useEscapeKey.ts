import { useEffect } from 'react';

/**
 * 當 active 為 true 時，監聽 Escape 鍵並呼叫 onEscape（用於 Modal 關閉）。
 */
export function useEscapeKey(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, onEscape]);
}

import { useEffect, useRef } from 'react';
import katex from 'katex';

interface LaTeXProps {
  math: string;
  display?: boolean;
  className?: string;
}

export function LaTeX({ math, display = false, className = '' }: LaTeXProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(math, ref.current, {
          displayMode: display,
          throwOnError: false,
          trust: true,
        });
      } catch {
        ref.current.textContent = math;
      }
    }
  }, [math, display]);

  return <span ref={ref} className={className} />;
}

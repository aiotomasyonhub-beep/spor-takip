import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

function Ikon({ children, ...p }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      {children}
    </svg>
  );
}

export const IkonEv = (p: P) => (
  <Ikon {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </Ikon>
);
export const IkonGecmis = (p: P) => (
  <Ikon {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l3 2" />
  </Ikon>
);
export const IkonGrafik = (p: P) => (
  <Ikon {...p}>
    <path d="M3 3v18h18" />
    <path d="m7 15 4-4 3 3 6-6" />
  </Ikon>
);
export const IkonAyar = (p: P) => (
  <Ikon {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </Ikon>
);
export const IkonKalkan = (p: P) => (
  <Ikon {...p}>
    <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </Ikon>
);
export const IkonGeri = (p: P) => (
  <Ikon {...p}>
    <path d="m15 18-6-6 6-6" />
  </Ikon>
);
export const IkonKapat = (p: P) => (
  <Ikon {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Ikon>
);
export const IkonTik = (p: P) => (
  <Ikon {...p} strokeWidth={3}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Ikon>
);
export const IkonOynat = (p: P) => (
  <Ikon {...p}>
    <path d="M7 4.5v15l12-7.5-12-7.5Z" fill="currentColor" />
  </Ikon>
);
export const IkonSaat = (p: P) => (
  <Ikon {...p}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2 2" />
    <path d="M10 2h4" />
  </Ikon>
);
export const IkonCop = (p: P) => (
  <Ikon {...p}>
    <path d="M4 7h16" />
    <path d="M10 11v6M14 11v6" />
    <path d="M6 7l1 13h10l1-13" />
    <path d="M9 7V4h6v3" />
  </Ikon>
);
export const IkonUyari = (p: P) => (
  <Ikon {...p}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </Ikon>
);
export const IkonDis = (p: P) => (
  <Ikon {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4 10 14" />
    <path d="M18 14v6H4V6h6" />
  </Ikon>
);

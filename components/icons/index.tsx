import type { SVGProps } from "react";

/**
 * WohnWert Icon-System
 * ---------------------------------------------------------------------------
 * Eigenstaendig gezeichnete Outline-Icons auf einem 24er-Raster.
 * Einheitliche Strichstaerke (1.5), runde Enden, geometrische Formsprache.
 * Alle Icons erben `currentColor` und skalieren ueber die Schriftgroesse.
 */

export type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

function Icon({ size = 24, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------ Objekttypen */

export const IconHouse = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 10.4 12 3.75l8.5 6.65" />
    <path d="M5.4 11.9v7.35a.9.9 0 0 0 .9.9h11.4a.9.9 0 0 0 .9-.9V11.9" />
    <path d="M9.9 20.15v-5.1h4.2v5.1" />
  </Icon>
);

export const IconApartment = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.25 20.25V6.4a.9.9 0 0 1 .55-.83l6.85-2.77a.9.9 0 0 1 1.25.83v16.62" />
    <path d="M12.9 9.6h5.95a.9.9 0 0 1 .9.9v9.75" />
    <path d="M3 20.25h18" />
    <path d="M7.3 8.75h1.9M7.3 12.2h1.9M7.3 15.6h1.9M15.4 13h1.4M15.4 16.4h1.4" />
  </Icon>
);

export const IconBuilding = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.25 20.25h17.5" />
    <path d="M5.4 20.25V5.6a.9.9 0 0 1 .9-.9h5a.9.9 0 0 1 .9.9v14.65" />
    <path d="M12.2 20.25V9.9h5.5a.9.9 0 0 1 .9.9v9.45" />
    <path d="M8 7.8h1.6M8 11.1h1.6M8 14.4h1.6M14.6 13h1.6M14.6 16.3h1.6" />
  </Icon>
);

export const IconLand = (p: IconProps) => (
  <Icon {...p}>
    <path d="m12 4.4 8.4 4.85L12 14.1 3.6 9.25 12 4.4Z" />
    <path d="m5.2 12.35-1.6.9 8.4 4.85 8.4-4.85-1.6-.9" />
    <path d="M12 17.2v2.4" />
  </Icon>
);

export const IconCommercial = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.4 9.5h17.2l-1.1-3.35a.9.9 0 0 0-.86-.62H5.36a.9.9 0 0 0-.86.62L3.4 9.5Z" />
    <path d="M4.9 9.5v10.15a.6.6 0 0 0 .6.6h13a.6.6 0 0 0 .6-.6V9.5" />
    <path d="M9.4 20.25v-4.7h5.2v4.7" />
    <path d="M8 9.5v1.15a1.9 1.9 0 0 1-3.8 0M11.9 9.5v1.15a1.9 1.9 0 0 1-3.8 0M15.8 9.5v1.15a1.9 1.9 0 0 1-3.8 0M19.7 9.5v1.15a1.9 1.9 0 0 1-3.8 0" />
  </Icon>
);

/* ---------------------------------------------------------------- Aktion */

export const IconKey = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="8.1" cy="8.1" r="4.35" />
    <path d="m11.3 11.3 8 8" />
    <path d="m16.2 16.2 1.9-1.9M18.6 18.6l1.9-1.9" />
  </Icon>
);

export const IconValuation = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 19.5V6.2a.9.9 0 0 1 .9-.9h9.6a.9.9 0 0 1 .9.9v13.3" />
    <path d="M3.4 19.5h17.2" />
    <path d="M19 19.5V9.9" />
    <path d="M8 15.6v-2.3M11 15.6V9.9M14 15.6v-4" />
    <path d="M17.2 7.6 19 5.8l1.8 1.8" />
  </Icon>
);

export const IconLocation = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20.6s6.4-5.05 6.4-10a6.4 6.4 0 1 0-12.8 0c0 4.95 6.4 10 6.4 10Z" />
    <circle cx="12" cy="10.4" r="2.4" />
  </Icon>
);

export const IconPhone = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8.1 4.2h-2A2.1 2.1 0 0 0 4 6.5c.35 3.4 1.83 6.6 4.2 9.05 2.36 2.42 5.53 3.9 8.9 4.24a2.1 2.1 0 0 0 2.3-2.1v-2.05a1.4 1.4 0 0 0-1.2-1.4l-2-.28a1.4 1.4 0 0 0-1.44.7l-.5.9a11.3 11.3 0 0 1-4.5-4.53l.9-.5a1.4 1.4 0 0 0 .69-1.44l-.28-2a1.4 1.4 0 0 0-1.37-1.2Z" />
  </Icon>
);

export const IconMail = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.2" y="5.4" width="17.6" height="13.2" rx="1.6" />
    <path d="m3.8 6.7 7.35 5.4a1.45 1.45 0 0 0 1.7 0l7.35-5.4" />
  </Icon>
);

export const IconCalendar = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.6" y="5.4" width="16.8" height="15" rx="1.7" />
    <path d="M3.6 9.8h16.8M8.3 3.6v3.4M15.7 3.6v3.4" />
    <path d="M7.6 13.4h2.1M7.6 16.7h2.1M14.3 13.4h2.1" />
  </Icon>
);

export const IconSearch = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="10.6" cy="10.6" r="6.1" />
    <path d="m15.1 15.1 4.6 4.6" />
  </Icon>
);

export const IconFilter = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 6.6h16M7 12h10M10 17.4h4" />
  </Icon>
);

export const IconSliders = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7.6h5.4M13.4 7.6H20M4 16.4h6.6M14.6 16.4H20" />
    <circle cx="11.4" cy="7.6" r="2" />
    <circle cx="12.6" cy="16.4" r="2" />
  </Icon>
);

/* ------------------------------------------------------------ Objektdaten */

export const IconPrice = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.3" />
    <path d="M15 8.9a3.9 3.9 0 0 0-5.7 1.5M9.3 13.6a3.9 3.9 0 0 0 5.7 1.5" />
    <path d="M7.8 10.9h5.4M7.8 13.2h5.4" />
  </Icon>
);

export const IconArea = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4" y="4" width="16" height="16" rx="1.6" />
    <path d="M4 9.4h3.2M4 14.6h3.2M9.4 20v-3.2M14.6 20v-3.2" />
    <path d="m11 13 4-4M15 9h-2.6M15 9v2.6" />
  </Icon>
);

export const IconRooms = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.6" y="4.4" width="16.8" height="15.2" rx="1.6" />
    <path d="M12 4.4v15.2M12 12h8.4" />
    <circle cx="9.5" cy="12.3" r="0.9" />
  </Icon>
);

export const IconBath = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.6 12.3h16.8v2.1a4.3 4.3 0 0 1-4.3 4.3H7.9a4.3 4.3 0 0 1-4.3-4.3v-2.1Z" />
    <path d="M6.4 12.3V6.5a2 2 0 0 1 3.6-1.2" />
    <path d="M9.2 7.4h2.3" />
    <path d="M7.6 18.9 6.6 20.6M16.4 18.9l1 1.7" />
  </Icon>
);

export const IconBed = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 18.4v-10" />
    <path d="M3.5 12.6h17v5.8" />
    <path d="M3.5 15.9h17" />
    <path d="M7 12.6v-2.4a.9.9 0 0 1 .9-.9h3a.9.9 0 0 1 .9.9v2.4" />
    <path d="M13 12.6v-2.4a.9.9 0 0 1 .9-.9h3a.9.9 0 0 1 .9.9v2.4" />
  </Icon>
);

export const IconYear = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.3" />
    <path d="M12 7.3V12l3.2 1.9" />
  </Icon>
);

export const IconEnergy = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13.3 3.4 6.2 13.2h4.6l-.9 7.4 7.4-9.9h-4.7l.7-7.3Z" />
  </Icon>
);

export const IconHeating = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.6c1.9 2.4 2.6 4.3 2 5.9-.6 1.6-2 2.3-2 4a2.6 2.6 0 0 0 2.6 2.6" />
    <path d="M12 20.4a5.4 5.4 0 0 0 5.4-5.4c0-2.1-1-3.6-2.2-5" />
    <path d="M12 20.4a5.4 5.4 0 0 1-5.4-5.4c0-1.7.7-3 1.7-4.2" />
  </Icon>
);

export const IconDocument = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13.6 3.6H7a1.6 1.6 0 0 0-1.6 1.6v13.6A1.6 1.6 0 0 0 7 20.4h10a1.6 1.6 0 0 0 1.6-1.6V8.6l-5-5Z" />
    <path d="M13.4 3.7v4.2a.9.9 0 0 0 .9.9h4.2" />
    <path d="M8.6 13h6.8M8.6 16.3h4.4" />
  </Icon>
);

export const IconFloorplan = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="1.3" />
    <path d="M3.6 11.2h6.6V3.6M10.2 11.2v9.2M14.6 11.2v9.2M14.6 15.8h5.8" />
  </Icon>
);

/* ---------------------------------------------------------------- System */

export const IconArrowRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.6 12h14.8M13.6 6.4 19.4 12l-5.8 5.6" />
  </Icon>
);

export const IconArrowLeft = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19.4 12H4.6M10.4 6.4 4.6 12l5.8 5.6" />
  </Icon>
);

export const IconArrowUpRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 17 17 7M8.4 7H17v8.6" />
  </Icon>
);

export const IconChevronDown = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5.8 9.2 6.2 6 6.2-6" />
  </Icon>
);

export const IconChevronLeft = (p: IconProps) => (
  <Icon {...p}>
    <path d="m14.8 5.8-6 6.2 6 6.2" />
  </Icon>
);

export const IconChevronRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="m9.2 5.8 6 6.2-6 6.2" />
  </Icon>
);

export const IconCheck = (p: IconProps) => (
  <Icon {...p}>
    <path d="m4.8 12.6 4.6 4.6 9.8-10.4" />
  </Icon>
);

export const IconCheckCircle = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="m8.2 12.3 2.6 2.6 5-5.4" />
  </Icon>
);

export const IconClose = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6 18 18M18 6 6 18" />
  </Icon>
);

export const IconMenu = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.8 7.2h16.4M3.8 12h16.4M3.8 16.8h11" />
  </Icon>
);

export const IconStar = ({ filled = false, ...p }: IconProps & { filled?: boolean }) => (
  <Icon {...p} fill={filled ? "currentColor" : "none"}>
    <path d="m12 3.9 2.6 5.4 5.9.85-4.25 4.15 1 5.9L12 17.4l-5.25 2.8 1-5.9L3.5 10.15l5.9-.85L12 3.9Z" />
  </Icon>
);

export const IconShield = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.4 5 6v6c0 4.2 2.9 7.2 7 8.6 4.1-1.4 7-4.4 7-8.6V6l-7-2.6Z" />
    <path d="m9.2 12 2 2 3.6-4" />
  </Icon>
);

export const IconConsulting = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 6.6a1.6 1.6 0 0 1 1.6-1.6h7.6a1.6 1.6 0 0 1 1.6 1.6v4.5a1.6 1.6 0 0 1-1.6 1.6H8l-4 3v-3.1a1.6 1.6 0 0 1-.001-.05V6.6Z" />
    <path d="M17 9.1h1.4A1.6 1.6 0 0 1 20 10.7v4.5a1.6 1.6 0 0 1-1.6 1.6H18v3l-3.4-3h-2.2" />
  </Icon>
);

export const IconHandshake = (p: IconProps) => (
  <Icon {...p}>
    <path d="m2.8 12.4 3-3 3.3 1.9 2.9-2.9h3.4l3.2 3.2" />
    <path d="m11.1 13.6 2.1 2.1M9.2 15.1l1.9 1.9M7.4 16.7l1.6 1.6" />
    <path d="m18.6 11.6-4.2 4.2" />
    <path d="M2.8 12.4 5.9 15.5M21.2 12.4l-2.6 2.6" />
  </Icon>
);

export const IconTrend = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.6 16.8 9 11.4l3.4 3.4 7-7" />
    <path d="M15.2 7.8h4.2V12" />
    <path d="M3.6 20.4h16.8" />
  </Icon>
);

export const IconUsers = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="9.4" cy="8.6" r="3.2" />
    <path d="M3.6 19.4a5.8 5.8 0 0 1 11.6 0" />
    <path d="M15.6 6a3.2 3.2 0 0 1 0 6.2" />
    <path d="M17.2 14.4a5.8 5.8 0 0 1 3.2 5" />
  </Icon>
);

export const IconAward = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="9.4" r="5.4" />
    <path d="m8.8 14 -1.2 6.4 4.4-2.3 4.4 2.3L15.2 14" />
  </Icon>
);

export const IconCompass = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="m14.9 9.1-1.5 4.3-4.3 1.5 1.5-4.3 4.3-1.5Z" />
  </Icon>
);

export const IconCamera = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.6 8.8a1.6 1.6 0 0 1 1.6-1.6h2.1l1.2-2h7l1.2 2h2.1a1.6 1.6 0 0 1 1.6 1.6v9a1.6 1.6 0 0 1-1.6 1.6H5.2a1.6 1.6 0 0 1-1.6-1.6v-9Z" />
    <circle cx="12" cy="13" r="3.4" />
  </Icon>
);

export const IconHeart = ({ filled = false, ...p }: IconProps & { filled?: boolean }) => (
  <Icon {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20.1s-7.3-4.35-7.3-9.4A4.1 4.1 0 0 1 12 8.05a4.1 4.1 0 0 1 7.3 2.65c0 5.05-7.3 9.4-7.3 9.4Z" />
  </Icon>
);

export const IconShare = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="17.4" cy="6.2" r="2.4" />
    <circle cx="6.6" cy="12" r="2.4" />
    <circle cx="17.4" cy="17.8" r="2.4" />
    <path d="m8.7 10.9 6.6-3.5M8.7 13.1l6.6 3.5" />
  </Icon>
);

export const IconClock = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 7v5.3l3.4 2" />
  </Icon>
);

export const IconInfo = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 11.2v5M12 8.2h.01" />
  </Icon>
);

export const IconPlus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5.4v13.2M5.4 12h13.2" />
  </Icon>
);

export const IconMinus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5.4 12h13.2" />
  </Icon>
);

export const IconTrash = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.6 6.8h14.8M9.4 6.8V5.2a1.2 1.2 0 0 1 1.2-1.2h2.8a1.2 1.2 0 0 1 1.2 1.2v1.6" />
    <path d="M6.6 6.8 7.5 19a1.4 1.4 0 0 0 1.4 1.3h6.2A1.4 1.4 0 0 0 16.5 19l.9-12.2" />
    <path d="M10.4 10.4v6M13.6 10.4v6" />
  </Icon>
);

export const IconEdit = (p: IconProps) => (
  <Icon {...p}>
    <path d="M11.6 5.4H5.8A1.8 1.8 0 0 0 4 7.2v11a1.8 1.8 0 0 0 1.8 1.8h11a1.8 1.8 0 0 0 1.8-1.8v-5.8" />
    <path d="M16.9 4.1a1.9 1.9 0 0 1 2.7 2.7l-8 8-3.5.8.8-3.5 8-8Z" />
  </Icon>
);

export const IconLogout = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9.6 4.6H6.4A1.8 1.8 0 0 0 4.6 6.4v11.2a1.8 1.8 0 0 0 1.8 1.8h3.2" />
    <path d="M14.6 15.6 18.6 12l-4-3.6M18.2 12H9.4" />
  </Icon>
);

export const IconDashboard = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.8" y="3.8" width="7" height="7" rx="1.2" />
    <rect x="13.2" y="3.8" width="7" height="4.4" rx="1.2" />
    <rect x="3.8" y="13.2" width="7" height="7" rx="1.2" />
    <rect x="13.2" y="10.6" width="7" height="9.6" rx="1.2" />
  </Icon>
);

export const IconInbox = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.6 13.4h4.2l1.3 2.4h5.8l1.3-2.4h4.2" />
    <path d="M5.4 5.2h13.2l1.8 8.2v4.2a1.6 1.6 0 0 1-1.6 1.6H5.2a1.6 1.6 0 0 1-1.6-1.6v-4.2L5.4 5.2Z" />
  </Icon>
);

export const IconWhatsApp = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 20.2 5.3 16a7.6 7.6 0 1 1 2.9 2.8L4 20.2Z" />
    <path d="M9.6 9.1c.3 1.9 2.3 3.9 4.2 4.2l.9-1.1 1.6.6-.2 1.5c-2.6.5-6.5-3.4-6-6l1.5-.2.6 1.6-.9.9" />
  </Icon>
);

export const IconQuote = (p: IconProps) => (
  <Icon {...p} strokeWidth={0} fill="currentColor">
    <path d="M9.4 5.6c-3 1.4-4.9 4-4.9 7.4 0 3.3 1.8 5.4 4.3 5.4 2 0 3.5-1.4 3.5-3.3 0-1.8-1.3-3.1-3-3.1-.3 0-.7 0-.9.1.3-1.6 1.5-3 3.3-3.9l-2.3-2.6Zm9.2 0c-3 1.4-4.9 4-4.9 7.4 0 3.3 1.8 5.4 4.3 5.4 2 0 3.5-1.4 3.5-3.3 0-1.8-1.3-3.1-3-3.1-.3 0-.7 0-.9.1.3-1.6 1.5-3 3.3-3.9l-2.3-2.6Z" />
  </Icon>
);

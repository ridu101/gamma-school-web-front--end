const paths = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" />,
  play: <path d="M8 5.5l10 6.5-10 6.5V5.5z" />,
  video: (
    <>
      <rect x="3" y="6" width="12" height="12" rx="2.5" />
      <path d="M15 10.5l6-3.5v10l-6-3.5" />
    </>
  ),
  guide: (
    <>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a3 3 0 0 1 2 5.2V20a3 3 0 0 0-2-.8H5.5A1.5 1.5 0 0 1 4 17.7V5.5z" />
      <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H14a3 3 0 0 0-2 5.2V20a3 3 0 0 1 2-.8h4.5a1.5 1.5 0 0 0 1.5-1.5V5.5z" />
    </>
  ),
  facebook: <path d="M14.5 8.5h2.2V5.8h-2.4c-2.1 0-3.4 1.3-3.4 3.4v1.6H8.8v2.8h2.1V19h2.9v-5.4h2.2l.4-2.8h-2.6V9.6c0-.7.3-1.1.7-1.1z" />,
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="M11 9.8l4 2.2-4 2.2V9.8z" />
    </>
  ),
  linkedin: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 10.5V16M8 7.7v.1M12 16v-3.2a1.8 1.8 0 0 1 3.6 0V16" />
    </>
  ),
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  expand: <path d="M9 4H4v5M15 20h5v-5M20 9V4h-5M4 15v5h5" />,

  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  phone: (
    <path d="M4 5c0-.6.4-1 1-1h2.6c.5 0 .9.3 1 .8l.8 3c.1.4 0 .8-.4 1L7.6 10c1 2.1 2.6 3.7 4.7 4.7l1.2-1.4c.2-.3.6-.4 1-.3l3 .8c.5.1.8.5.8 1V17c0 .6-.4 1-1 1h-1C9.6 18 4 12.4 4 5.5V5z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
  location: (
    <>
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUpRight: <path d="M7 17L17 7M9 7h8v8" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  download: <path d="M12 4v10m0 0l-4-4m4 4l4-4M5 19h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3.5v3M16 3.5v3" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="9" r="3.2" />
      <path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6S13.9 16 14.5 19M16 6.2a3 3 0 0 1 0 5.6M17.5 19c-.2-1.4-.6-2.6-1.3-3.5" />
    </>
  ),
  teacher: (
    <>
      <path d="M4 6.5h11a2 2 0 0 1 2 2V17H6a2 2 0 0 1-2-2V6.5z" />
      <path d="M7.5 10.5h6M7.5 13.5h4M17 9h3v11h-3" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2 2 0 0 1 6 3.5h5v15H6a2 2 0 0 0-2 2v-15z" />
      <path d="M20 5.5a2 2 0 0 0-2-2h-5v15h5a2 2 0 0 1 2 2v-15z" />
    </>
  ),
  form: (
    <>
      <path d="M6 3.5h8l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1-1.5z" />
      <path d="M13.5 3.5V8H18M8.5 12.5h7M8.5 16h4.5" />
    </>
  ),
  result: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 15l3-3.5 2.5 2.5L17 9" />
    </>
  ),
  attendance: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.3l2.4 2.4 4.6-4.9" />
    </>
  ),
  routine: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M12 10v10M8 3.5v3M16 3.5v3" />
    </>
  ),
  bell: (
    <>
      <path d="M6.5 10a5.5 5.5 0 1 1 11 0c0 3.4 1 4.6 1.6 5.3.3.4 0 1.2-.6 1.2H5.5c-.6 0-.9-.8-.6-1.2.7-.7 1.6-1.9 1.6-5.3z" />
      <path d="M10 19.5a2.2 2.2 0 0 0 4 0" />
    </>
  ),
  student: (
    <>
      <path d="M3.5 9L12 5l8.5 4-8.5 4-8.5-4z" />
      <path d="M7 11v4c0 1.4 2.2 2.6 5 2.6s5-1.2 5-2.6v-4M20.5 9v5" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  spark: <path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9L12 3.5z" />,
  cap: (
    <>
      <path d="M2.8 8.6L12 4.5l9.2 4.1L12 12.8 2.8 8.6z" />
      <path d="M6.5 10.6v4.2c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-4.2M21.2 8.6v5.6" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.5V12l3 1.8" />
    </>
  ),
  send: <path d="M20 4L3.8 10.6l6.3 2.3 2.3 6.3L20 4z" />,
  route: (
    <>
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
      <path d="M9 6.5h4.5A3.5 3.5 0 0 1 17 10v5" />
    </>
  ),
};

export default function Icon({ name, className = "h-5 w-5", strokeWidth = 1.7 }) {
  const shape = paths[name];
  if (!shape) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {shape}
    </svg>
  );
}

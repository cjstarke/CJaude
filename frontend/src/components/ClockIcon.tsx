const ClockIcon = () => {
  return (
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 240 240"
  role="img"
  aria-label="Clock"
>
  <circle
    cx="120"
    cy="120"
    r="88"
    fill="none"
    stroke="#0A0A0A"
    stroke-width="22"
  />

  <path
    fill="#0A0A0A"
    d="M115 47h10v17h-10zM176 115h17v10h-17zM115 176h10v17h-10zM47 115h17v10H47z"
  />

  <path fill="#0A0A0A" d="M112 72h16v52h-16z" />
  <path fill="#0A0A0A" d="m119 111 47 32-9 13-47-32z" />

  <circle cx="120" cy="120" r="14" fill="#0A0A0A" />
  <circle cx="120" cy="120" r="5" fill="#FFFFFF" />
</svg>
  );
};

export default ClockIcon;

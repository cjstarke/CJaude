const DiceIcon = () => {
  return (
    <div className="w-full max-w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 240"
        role="img"
        aria-label="Dice"
      >
        <path
          fill="#0A0A0A"
          stroke="#ffffff"
          stroke-width="5"
          stroke-linejoin="round"
          d="m120 14 91 49-91 49-91-49 91-49Z"
        />

        <path
          fill="#0A0A0A"
          stroke="#ffffff"
          stroke-width="5"
          stroke-linejoin="round"
          d="m29 63 91 49v113l-91-49V63Z"
        />

        <path
          fill="#0A0A0A"
          stroke="#ffffff"
          stroke-width="5"
          stroke-linejoin="round"
          d="m120 112 91-49v113l-91 49V112Z"
        />

        <ellipse cx="76" cy="63" rx="13" ry="8" fill="#ffffff" />
        <ellipse cx="120" cy="63" rx="13" ry="8" fill="#ffffff" />
        <ellipse cx="164" cy="63" rx="13" ry="8" fill="#ffffff" />

        <ellipse
          cx="75"
          cy="144"
          rx="10"
          ry="15"
          transform="rotate(-27 75 144)"
          fill="#ffffff"
        />

        <ellipse
          cx="150"
          cy="130"
          rx="10"
          ry="15"
          transform="rotate(27 150 130)"
          fill="#ffffff"
        />

        <ellipse
          cx="181"
          cy="158"
          rx="10"
          ry="15"
          transform="rotate(27 181 158)"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
};

export default DiceIcon;

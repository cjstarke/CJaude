const RandomIcon = () => {
  return (
    <div className="w-full max-w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 240"
        role="img"
        aria-label="Question mark box"
      >
        <defs>
          <path
            id="question-mark"
            d="M-22-26c2-14 12-22 27-22 17 0 28 9 28 23 0 11-7 17-15 22C12 1 8 4 8 11v4H-8V9C-8-2-1-8 6-13c6-4 10-7 10-12 0-6-5-10-12-10-8 0-13 4-14 12l-18-3ZM-9 29H9v18H-9V29Z"
          />
        </defs>

        <path
          fill="#0A0A0A"
          stroke="#FFFFFF"
          stroke-width="5"
          stroke-linejoin="round"
          d="m120 18 96 45-96 47-96-47 96-45Z"
        />

        <path
          fill="#0A0A0A"
          stroke="#FFFFFF"
          stroke-width="5"
          stroke-linejoin="round"
          d="m24 63 96 47v112l-96-47V63Z"
        />

        <path
          fill="#0A0A0A"
          stroke="#FFFFFF"
          stroke-width="5"
          stroke-linejoin="round"
          d="m120 110 96-47v112l-96 47V110Z"
        />

        <use
          href="#question-mark"
          fill="#FFFFFF"
          transform="matrix(.78 0 0 .42 120 64)"
        />

        <use
          href="#question-mark"
          fill="#FFFFFF"
          transform="matrix(.7 .33 0 .68 72 145)"
        />

        <use
          href="#question-mark"
          fill="#FFFFFF"
          transform="matrix(.7 -.33 0 .68 168 145)"
        />
      </svg>
    </div>
  );
};

export default RandomIcon;
